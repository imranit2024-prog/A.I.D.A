import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { AIModel, AvatarState } from '../types';
import { WaveformOverlay } from './WaveformOverlay';

interface AvatarStageProps {
  activeModel: AIModel;
  avatarState: AvatarState;
  audioVolume: number; // 0 to 255
  frequencyData: Uint8Array;
  wireframeMode?: boolean;
  enableIdleAnimation?: boolean;
}

// Pre-allocated math objects to guarantee zero garbage collection in render loop
const _vec3 = new THREE.Vector3();
const _targetHeadRot = new THREE.Vector3();
const _currentHeadRot = new THREE.Vector3();
const _targetJawPos = new THREE.Vector3();

export const AvatarStage: React.FC<AvatarStageProps> = ({
  activeModel,
  avatarState,
  audioVolume,
  frequencyData,
  wireframeMode = false,
  enableIdleAnimation = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // References to dynamic avatar body parts
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const headGroupRef = useRef<THREE.Group | null>(null);
  const jawMeshRef = useRef<THREE.Mesh | null>(null);
  const mouthOpeningMeshRef = useRef<THREE.Mesh | null>(null);
  const leftEyelidRef = useRef<THREE.Mesh | null>(null);
  const rightEyelidRef = useRef<THREE.Mesh | null>(null);
  const eyesGroupRef = useRef<THREE.Group | null>(null);
  const irisMatLeftRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const irisMatRightRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const garmentGroupRef = useRef<THREE.Group | null>(null);
  const haloRingRef = useRef<THREE.Mesh | null>(null);
  const sonicRingsRef = useRef<THREE.Mesh[]>([]);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // State refs for animation loops
  const stateRef = useRef({
    avatarState,
    audioVolume,
    frequencyData,
    activeModel,
    wireframeMode,
    enableIdleAnimation,
  });

  useEffect(() => {
    stateRef.current = {
      avatarState,
      audioVolume,
      frequencyData,
      activeModel,
      wireframeMode,
      enableIdleAnimation,
    };
  }, [avatarState, audioVolume, frequencyData, activeModel, wireframeMode, enableIdleAnimation]);

  // Update specialist materials when active model changes
  useEffect(() => {
    if (!avatarGroupRef.current) return;

    const accentHex = activeModel.avatarStyle.accentColor;
    if (irisMatLeftRef.current) irisMatLeftRef.current.color.setHex(accentHex);
    if (irisMatRightRef.current) irisMatRightRef.current.color.setHex(accentHex);
    if (rimLightRef.current) rimLightRef.current.color.setHex(accentHex);

    // Rebuild specialized garment
    if (garmentGroupRef.current) {
      // Clear previous garment parts
      while (garmentGroupRef.current.children.length > 0) {
        const obj = garmentGroupRef.current.children[0];
        garmentGroupRef.current.remove(obj);
        if ((obj as any).geometry) (obj as any).geometry.dispose();
        if ((obj as any).material) {
          if (Array.isArray((obj as any).material)) {
            (obj as any).material.forEach((m: any) => m.dispose());
          } else {
            (obj as any).material.dispose();
          }
        }
      }

      // Build model-specific garment accessories
      buildSpecialistGarment(garmentGroupRef.current, activeModel);
    }
  }, [activeModel]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Setup Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x070b14, 0.055);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.45, 2.5);
    camera.lookAt(0, 1.45, 0);
    cameraRef.current = camera;

    // 4. Studio Environment Reflection
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch (e) {
      console.warn('RoomEnvironment generation fallback:', e);
    }

    // 5. 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(1.5, 3.0, 2.2);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x4facfe, 0x070b14, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(activeModel.avatarStyle.accentColor, 3.5);
    rimLight.position.set(-2.0, 2.8, -1.8);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // 6. Contact Ground Shadow & Holographic Stage Ring
    const groundShadowGeo = new THREE.PlaneGeometry(3, 3);
    const groundShadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const groundShadow = new THREE.Mesh(groundShadowGeo, groundShadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = 0.01;
    scene.add(groundShadow);

    // Glowing Holographic Stage Platform
    const stageRingGeo = new THREE.RingGeometry(0.7, 0.76, 64);
    const stageRingMat = new THREE.MeshBasicMaterial({
      color: activeModel.avatarStyle.accentColor,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const stageRing = new THREE.Mesh(stageRingGeo, stageRingMat);
    stageRing.rotation.x = -Math.PI / 2;
    stageRing.position.y = 0.02;
    scene.add(stageRing);
    haloRingRef.current = stageRing;

    // Outer concentric dashed ring
    const outerRingGeo = new THREE.RingGeometry(0.95, 0.98, 48);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.02;
    scene.add(outerRing);

    // Audio-Reactive Sonic Pulse Waves (react to audioVolume)
    const sonicRings: THREE.Mesh[] = [];
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.RingGeometry(0.72 + r * 0.15, 0.74 + r * 0.15, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: activeModel.avatarStyle.accentColor,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.025 + r * 0.005;
      scene.add(ringMesh);
      sonicRings.push(ringMesh);
    }
    sonicRingsRef.current = sonicRings;

    // Subtle Holographic Particle Field
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 3.5;
      particlePos[i + 1] = Math.random() * 2.8;
      particlePos[i + 2] = (Math.random() - 0.5) * 2.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 7. Assemble 3D Human Avatar Character Bust
    const avatarGroup = new THREE.Group();
    avatarGroupRef.current = avatarGroup;
    scene.add(avatarGroup);

    // Shared realistic PBR skin material
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.58,
      metalness: 0.04,
    });

    // Torso / Shoulders base
    const torsoGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.55, 32);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: activeModel.avatarStyle.clothingColor,
      roughness: 0.65,
      metalness: 0.2,
    });
    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.position.y = 0.72;
    torsoMesh.castShadow = !isSoftwareGl;
    avatarGroup.add(torsoMesh);

    // Shoulder Caps
    const shoulderGeo = new THREE.SphereGeometry(0.14, 24, 24);
    const leftShoulder = new THREE.Mesh(shoulderGeo, torsoMat);
    leftShoulder.position.set(-0.35, 0.88, 0);
    leftShoulder.scale.set(1.4, 0.9, 1.0);
    avatarGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, torsoMat);
    rightShoulder.position.set(0.35, 0.88, 0);
    rightShoulder.scale.set(1.4, 0.9, 1.0);
    avatarGroup.add(rightShoulder);

    // Garment Group for model-specific additions
    const garmentGroup = new THREE.Group();
    garmentGroupRef.current = garmentGroup;
    avatarGroup.add(garmentGroup);
    buildSpecialistGarment(garmentGroup, activeModel);

    // Neck Column
    const neckGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.22, 24);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.y = 1.08;
    avatarGroup.add(neckMesh);

    // Head Group (pivots for looking, nods, breathing)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.28, 0);
    headGroupRef.current = headGroup;
    avatarGroup.add(headGroup);

    // Head Cranium & Face
    const headGeo = new THREE.SphereGeometry(0.19, 32, 32);
    headGeo.scale(1.0, 1.25, 1.08);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = !isSoftwareGl;
    headGroup.add(headMesh);

    // Cheekbones & Chin contour
    const chinGeo = new THREE.ConeGeometry(0.12, 0.18, 24);
    chinGeo.scale(1.0, 0.9, 0.8);
    const chinMesh = new THREE.Mesh(chinGeo, skinMat);
    chinMesh.position.set(0, -0.16, 0.1);
    chinMesh.rotation.x = Math.PI;
    headGroup.add(chinMesh);

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.035, 0.09, 16);
    const noseMesh = new THREE.Mesh(noseGeo, skinMat);
    noseMesh.position.set(0, 0.01, 0.21);
    noseMesh.rotation.x = -Math.PI / 8;
    headGroup.add(noseMesh);

    // Eyes Group
    const eyesGroup = new THREE.Group();
    eyesGroupRef.current = eyesGroup;
    headGroup.add(eyesGroup);

    // Eye Sclera (White)
    const scleraGeo = new THREE.SphereGeometry(0.04, 20, 20);
    const scleraMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.15,
      metalness: 0.05,
    });

    // Iris & Pupil Material (Tinted to specialist color)
    const irisMatLeft = new THREE.MeshStandardMaterial({
      color: activeModel.avatarStyle.accentColor,
      roughness: 0.2,
      metalness: 0.7,
      emissive: activeModel.avatarStyle.accentColor,
      emissiveIntensity: 0.35,
    });
    irisMatLeftRef.current = irisMatLeft;

    const irisMatRight = irisMatLeft.clone();
    irisMatRightRef.current = irisMatRight;

    const irisGeo = new THREE.CircleGeometry(0.022, 24);
    const pupilGeo = new THREE.CircleGeometry(0.01, 24);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });

    // Left Eye
    const leftSclera = new THREE.Mesh(scleraGeo, scleraMat);
    leftSclera.position.set(-0.075, 0.07, 0.16);
    eyesGroup.add(leftSclera);

    const leftIris = new THREE.Mesh(irisGeo, irisMatLeft);
    leftIris.position.set(-0.075, 0.07, 0.198);
    eyesGroup.add(leftIris);

    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(-0.075, 0.07, 0.199);
    eyesGroup.add(leftPupil);

    // Right Eye
    const rightSclera = new THREE.Mesh(scleraGeo, scleraMat);
    rightSclera.position.set(0.075, 0.07, 0.16);
    eyesGroup.add(rightSclera);

    const rightIris = new THREE.Mesh(irisGeo, irisMatRight);
    rightIris.position.set(0.075, 0.07, 0.198);
    eyesGroup.add(rightIris);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0.075, 0.07, 0.199);
    eyesGroup.add(rightPupil);

    // Eyelids for natural blinking
    const eyelidGeo = new THREE.SphereGeometry(0.042, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const eyelidMat = skinMat.clone();

    const leftEyelid = new THREE.Mesh(eyelidGeo, eyelidMat);
    leftEyelid.position.set(-0.075, 0.07, 0.16);
    leftEyelid.rotation.x = -Math.PI / 2;
    leftEyelid.scale.set(1, 0.05, 1); // open by default
    eyesGroup.add(leftEyelid);
    leftEyelidRef.current = leftEyelid;

    const rightEyelid = new THREE.Mesh(eyelidGeo, eyelidMat);
    rightEyelid.position.set(0.075, 0.07, 0.16);
    rightEyelid.rotation.x = -Math.PI / 2;
    rightEyelid.scale.set(1, 0.05, 1);
    eyesGroup.add(rightEyelid);
    rightEyelidRef.current = rightEyelid;

    // Eyebrows
    const browGeo = new THREE.BoxGeometry(0.065, 0.012, 0.02);
    const hairColor = activeModel.avatarStyle.hairColor;
    const browMat = new THREE.MeshStandardMaterial({
      color: hairColor,
      roughness: 0.9,
    });
    const leftBrow = new THREE.Mesh(browGeo, browMat);
    leftBrow.position.set(-0.075, 0.125, 0.185);
    leftBrow.rotation.z = -0.06;
    headGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, browMat);
    rightBrow.position.set(0.075, 0.125, 0.185);
    rightBrow.rotation.z = 0.06;
    headGroup.add(rightBrow);

    // Hair Cap & Volume
    const hairGeo = new THREE.SphereGeometry(0.205, 32, 24);
    hairGeo.scale(1.02, 1.2, 1.05);
    const hairMat = new THREE.MeshStandardMaterial({
      color: hairColor,
      roughness: 0.85,
      metalness: 0.1,
    });
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.06, -0.02);
    headGroup.add(hairMesh);

    // Moving Mouth & Jaw for Real-Time Lip-Sync
    const jawGeo = new THREE.BoxGeometry(0.11, 0.055, 0.07);
    const jawMesh = new THREE.Mesh(jawGeo, skinMat);
    jawMesh.position.set(0, -0.13, 0.14);
    headGroup.add(jawMesh);
    jawMeshRef.current = jawMesh;

    // Dark interior mouth opening that expands during phonemes
    const mouthOpeningGeo = new THREE.PlaneGeometry(0.07, 0.025);
    const mouthOpeningMat = new THREE.MeshBasicMaterial({
      color: 0x180808,
      side: THREE.DoubleSide,
    });
    const mouthOpeningMesh = new THREE.Mesh(mouthOpeningGeo, mouthOpeningMat);
    mouthOpeningMesh.position.set(0, -0.088, 0.195);
    mouthOpeningMesh.scale.set(1.0, 0.1, 1.0); // thin line closed by default
    headGroup.add(mouthOpeningMesh);
    mouthOpeningMeshRef.current = mouthOpeningMesh;

    // 8. Animation & Render Loop
    let clock = new THREE.Clock();
    let blinkTimer = 0;
    let nextBlinkInterval = 3.5;
    let isBlinking = false;
    let blinkProgress = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const {
        avatarState: state,
        audioVolume: vol,
        frequencyData: freq,
        wireframeMode: wireframe,
        enableIdleAnimation: idleAnim,
      } = stateRef.current;

      // Handle Wireframe Debug Mode toggle
      skinMat.wireframe = Boolean(wireframe);
      torsoMat.wireframe = Boolean(wireframe);

      // Rotate background holographic particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.03;
      }

      // Rotate stage platform ring (accelerates with speech energy)
      if (haloRingRef.current) {
        const speedBoost = state === 'speaking' ? 0.15 + (vol / 255) * 0.4 : 0.15;
        haloRingRef.current.rotation.z = elapsed * speedBoost;
      }

      // Audio-Reactive Sonic Pulse Waves
      const normalizedVol = Math.max(0, Math.min(1, vol / 255));
      if (sonicRingsRef.current.length > 0) {
        sonicRingsRef.current.forEach((ring, idx) => {
          const wavePhase = (elapsed * 2.5 + idx * 0.35) % 1;
          const targetScale = state === 'speaking'
            ? 1.0 + wavePhase * (0.35 + normalizedVol * 0.6)
            : state === 'listening'
            ? 1.0 + wavePhase * 0.25
            : 1.0 + Math.sin(elapsed * 1.2 + idx) * 0.04;
          ring.scale.set(targetScale, targetScale, 1);

          const mat = ring.material as THREE.MeshBasicMaterial;
          if (mat) {
            const baseOpacity = state === 'speaking' ? 0.2 + normalizedVol * 0.55 : state === 'listening' ? 0.2 : 0.08;
            mat.opacity = baseOpacity * (1 - wavePhase);
          }
        });
      }

      // Dynamic Rim Light Intensity Reaction
      if (rimLightRef.current) {
        const baseIntensity = 3.5;
        const targetIntensity = state === 'speaking' ? baseIntensity + normalizedVol * 2.5 : baseIntensity;
        rimLightRef.current.intensity = THREE.MathUtils.damp(rimLightRef.current.intensity, targetIntensity, 10, delta);
      }

      // Natural Idle Breathing (Sine oscillation on torso & head)
      if (idleAnim && avatarGroupRef.current && headGroupRef.current) {
        const breathFreq = state === 'listening' ? 2.5 : 1.8;
        const breathAmp = 0.018;
        const breathY = Math.sin(elapsed * breathFreq) * breathAmp;

        avatarGroupRef.current.position.y = breathY;

        // Head micro-rotations (organic drifting)
        if (state === 'idle') {
          _targetHeadRot.set(
            Math.sin(elapsed * 0.9) * 0.04,
            Math.sin(elapsed * 0.6) * 0.06,
            Math.sin(elapsed * 0.4) * 0.02
          );
        } else if (state === 'listening') {
          // Attentive forward tilt toward user
          _targetHeadRot.set(0.08 + (vol / 255) * 0.06, Math.sin(elapsed * 1.5) * 0.03, 0);
        } else if (state === 'processing') {
          // Thinking posture (slight head turn upward)
          _targetHeadRot.set(-0.06, 0.08, 0.03);
        } else if (state === 'speaking') {
          // Conversational head emphasis
          _targetHeadRot.set(
            Math.sin(elapsed * 3.5) * 0.05 + (vol / 255) * 0.08,
            Math.cos(elapsed * 2.2) * 0.04,
            Math.sin(elapsed * 1.8) * 0.02
          );
        }

        _currentHeadRot.x = THREE.MathUtils.damp(_currentHeadRot.x, _targetHeadRot.x, 6, delta);
        _currentHeadRot.y = THREE.MathUtils.damp(_currentHeadRot.y, _targetHeadRot.y, 6, delta);
        _currentHeadRot.z = THREE.MathUtils.damp(_currentHeadRot.z, _targetHeadRot.z, 6, delta);

        headGroupRef.current.rotation.set(
          _currentHeadRot.x,
          _currentHeadRot.y,
          _currentHeadRot.z
        );
      }

      // Natural Eye Blinking Logic
      blinkTimer += delta;
      if (blinkTimer >= nextBlinkInterval && !isBlinking) {
        isBlinking = true;
        blinkTimer = 0;
        blinkProgress = 0;
        nextBlinkInterval = 2.8 + Math.random() * 3.0; // Random interval 2.8s - 5.8s
      }

      if (isBlinking && leftEyelidRef.current && rightEyelidRef.current) {
        blinkProgress += delta * 7.5; // ~130ms blink duration
        const eyelidScale = Math.sin(Math.min(Math.PI, blinkProgress * Math.PI));
        const yVal = THREE.MathUtils.lerp(0.05, 1.05, eyelidScale);
        leftEyelidRef.current.scale.y = yVal;
        rightEyelidRef.current.scale.y = yVal;

        if (blinkProgress >= 1.0) {
          isBlinking = false;
          leftEyelidRef.current.scale.y = 0.05;
          rightEyelidRef.current.scale.y = 0.05;
        }
      }

      // Real-Time Lip-Sync & Jaw Morphing Driven by Audio Frequencies
      if (jawMeshRef.current && mouthOpeningMeshRef.current) {
        let mouthOpenFactor = 0;

        if (state === 'speaking') {
          // Extract lower-mid formant frequencies (bins 2-12)
          let speechFormantSum = 0;
          const count = Math.min(12, freq.length);
          for (let i = 2; i < count; i++) {
            speechFormantSum += freq[i];
          }
          const formantAvg = speechFormantSum / Math.max(1, count - 2);

          // Combined audio volume and formant power
          mouthOpenFactor = Math.min(1.0, (formantAvg / 180) * 0.7 + (vol / 255) * 0.5);
        } else if (state === 'listening') {
          // Subtle mouth parting during intense listening
          mouthOpenFactor = Math.min(0.2, (vol / 255) * 0.2);
        }

        // Jaw drops downward on Y
        const currentJawY = jawMeshRef.current.position.y;
        const targetJawY = -0.13 - mouthOpenFactor * 0.025;
        jawMeshRef.current.position.y = THREE.MathUtils.damp(currentJawY, targetJawY, 14, delta);

        // Mouth opening aperture scale
        const currentMouthScaleY = mouthOpeningMeshRef.current.scale.y;
        const targetMouthScaleY = 0.1 + mouthOpenFactor * 1.5;
        mouthOpeningMeshRef.current.scale.y = THREE.MathUtils.damp(
          currentMouthScaleY,
          targetMouthScaleY,
          16,
          delta
        );
        mouthOpeningMeshRef.current.scale.x = 1.0 + mouthOpenFactor * 0.25;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* 3D Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Real-time Audio Waveform & Equalizer Visualizer Overlay */}
      <WaveformOverlay
        avatarState={avatarState}
        activeModel={activeModel}
        audioVolume={audioVolume}
        frequencyData={frequencyData}
      />
    </div>
  );
};

// Helper: Builds model-specific 3D procedural accessories and garment cues
function buildSpecialistGarment(group: THREE.Group, model: AIModel) {
  const accentColor = model.avatarStyle.accentColor;
  const clothingColor = model.avatarStyle.clothingColor;

  const garmentMat = new THREE.MeshStandardMaterial({
    color: clothingColor,
    roughness: 0.5,
    metalness: 0.25,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.3,
    metalness: 0.8,
    emissive: accentColor,
    emissiveIntensity: 0.4,
  });

  switch (model.avatarStyle.garmentType) {
    case 'tactical': {
      // NON-STOP: Cyber-tactical collar with glowing insignia
      const collarGeo = new THREE.TorusGeometry(0.18, 0.025, 16, 32);
      const collar = new THREE.Mesh(collarGeo, garmentMat);
      collar.position.set(0, 0.98, 0);
      collar.rotation.x = Math.PI / 2;
      group.add(collar);

      const crestGeo = new THREE.BoxGeometry(0.04, 0.04, 0.015);
      const crest = new THREE.Mesh(crestGeo, accentMat);
      crest.position.set(0, 0.94, 0.22);
      group.add(crest);
      break;
    }

    case 'suit': {
      // EXECUTIVE: Tailored suit lapels and champagne tie clip
      const lapelGeo = new THREE.BoxGeometry(0.05, 0.28, 0.02);
      const leftLapel = new THREE.Mesh(lapelGeo, garmentMat);
      leftLapel.position.set(-0.09, 0.78, 0.17);
      leftLapel.rotation.z = -0.22;
      group.add(leftLapel);

      const rightLapel = new THREE.Mesh(lapelGeo, garmentMat);
      rightLapel.position.set(0.09, 0.78, 0.17);
      rightLapel.rotation.z = 0.22;
      group.add(rightLapel);

      const tieClipGeo = new THREE.BoxGeometry(0.04, 0.008, 0.015);
      const tieClip = new THREE.Mesh(tieClipGeo, accentMat);
      tieClip.position.set(0, 0.76, 0.18);
      group.add(tieClip);
      break;
    }

    case 'hoodie': {
      // CODER: Cyberpunk hoodie rim with neon fiber-optic trim
      const hoodRimGeo = new THREE.TorusGeometry(0.24, 0.035, 16, 32);
      const hoodRim = new THREE.Mesh(hoodRimGeo, garmentMat);
      hoodRim.position.set(0, 0.95, -0.04);
      hoodRim.rotation.x = Math.PI / 2.3;
      group.add(hoodRim);

      const trimGeo = new THREE.TorusGeometry(0.23, 0.008, 12, 32);
      const trim = new THREE.Mesh(trimGeo, accentMat);
      trim.position.set(0, 0.94, -0.03);
      trim.rotation.x = Math.PI / 2.3;
      group.add(trim);
      break;
    }

    case 'architect': {
      // ARCHITECT: Geometric structural collar with titanium plates
      const plateGeo = new THREE.BoxGeometry(0.12, 0.08, 0.02);
      const leftPlate = new THREE.Mesh(plateGeo, garmentMat);
      leftPlate.position.set(-0.2, 0.88, 0.1);
      leftPlate.rotation.z = -0.3;
      group.add(leftPlate);

      const rightPlate = new THREE.Mesh(plateGeo, garmentMat);
      rightPlate.position.set(0.2, 0.88, 0.1);
      rightPlate.rotation.z = 0.3;
      group.add(rightPlate);

      const lineGeo = new THREE.BoxGeometry(0.25, 0.006, 0.01);
      const line = new THREE.Mesh(lineGeo, accentMat);
      line.position.set(0, 0.85, 0.19);
      group.add(line);
      break;
    }

    case 'armor': {
      // SECURITY: Reinforced ballistic gorget and red warning badge
      const gorgetGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.12, 24, 1, true);
      const gorget = new THREE.Mesh(gorgetGeo, garmentMat);
      gorget.position.set(0, 0.92, 0);
      group.add(gorget);

      const badgeGeo = new THREE.OctahedronGeometry(0.025);
      const badge = new THREE.Mesh(badgeGeo, accentMat);
      badge.position.set(0, 0.88, 0.22);
      group.add(badge);
      break;
    }

    case 'coat': {
      // RESEARCHER: Deep scholar coat collar with analytical prism
      const collarGeo = new THREE.TorusGeometry(0.19, 0.02, 16, 24);
      const collar = new THREE.Mesh(collarGeo, garmentMat);
      collar.position.set(0, 0.98, 0.02);
      collar.rotation.x = Math.PI / 2.2;
      group.add(collar);

      const prismGeo = new THREE.ConeGeometry(0.02, 0.04, 3);
      const prism = new THREE.Mesh(prismGeo, accentMat);
      prism.position.set(-0.12, 0.86, 0.18);
      prism.rotation.z = Math.PI / 4;
      group.add(prism);
      break;
    }

    case 'minimalist': {
      // WRITER: Elegant asymmetric drape and warm amber collar
      const drapeGeo = new THREE.TorusGeometry(0.18, 0.022, 16, 32);
      const drape = new THREE.Mesh(drapeGeo, garmentMat);
      drape.position.set(0.02, 0.96, 0.01);
      drape.rotation.set(Math.PI / 2.1, 0.15, -0.1);
      group.add(drape);

      const broochGeo = new THREE.SphereGeometry(0.018, 16, 16);
      const brooch = new THREE.Mesh(broochGeo, accentMat);
      brooch.position.set(0.1, 0.92, 0.18);
      group.add(brooch);
      break;
    }
  }
}
