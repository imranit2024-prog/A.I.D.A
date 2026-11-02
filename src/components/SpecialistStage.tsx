import React, { useEffect, useRef } from 'react';
import { SpecialistDesign, SPECIALIST_DESIGNS } from '../data/models';
import { AvatarState } from '../types';
import { WaveformOverlay } from './WaveformOverlay';

interface SpecialistStageProps {
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  avatarState: AvatarState;
  audioVolume: number;
  frequencyData: Uint8Array;
  idleIntensity: number; // 0 to 2
  glowEnabled: boolean;
}

export const SpecialistStage: React.FC<SpecialistStageProps> = ({
  currentIndex,
  onSelectIndex,
  avatarState,
  audioVolume,
  frequencyData,
  idleIntensity = 1,
  glowEnabled = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const stateRef = useRef({
    currentIndex,
    avatarState,
    audioVolume,
    frequencyData,
    idleIntensity,
  });

  useEffect(() => {
    stateRef.current = {
      currentIndex,
      avatarState,
      audioVolume,
      frequencyData,
      idleIntensity,
    };
  }, [currentIndex, avatarState, audioVolume, frequencyData, idleIntensity]);

  // Pointer swipe handling
  const startXRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (startXRef.current !== null) {
      const diff = e.clientX - startXRef.current;
      if (Math.abs(diff) > 55) {
        if (diff < 0) {
          onSelectIndex((currentIndex + 1) % SPECIALIST_DESIGNS.length);
        } else {
          onSelectIndex((currentIndex - 1 + SPECIALIST_DESIGNS.length) % SPECIALIST_DESIGNS.length);
        }
      }
      startXRef.current = null;
    }
  };

  // Build SVG string for avatar
  const getAvatarSvg = (p: SpecialistDesign) => {
    const h = p.hair;
    const k = p.skin;
    const o = p.outfit;

    const hairBack =
      p.style === 3 || p.style === 4
        ? `<path d="M52 100c-10 50 0 90 8 100h80c8-10 18-50 8-100z" fill="${h}"/>`
        : '';

    const hairTops = [
      `<path d="M56 100c-4-48 28-66 46-66s52 14 42 66c-8-26-26-34-44-34s-36 8-44 34z" fill="${h}"/>`,
      `<path d="M56 98c-6-46 30-62 48-58 24-2 46 16 40 58-10-22-30-26-46-26-16 0-32 4-42 26z" fill="${h}"/>`,
      `<path d="M54 100c-8-50 24-70 48-68 28 0 52 20 44 68-6-30-24-40-46-40s-38 10-46 40z" fill="${h}"/>`,
      `<path d="M54 104c-6-52 28-72 48-72s54 18 44 72c-6-34-28-46-46-46s-40 12-46 46z" fill="${h}"/>`,
      `<path d="M54 102c-4-50 24-70 50-68 26 2 48 20 42 68-8-30-30-36-48-34-18 2-36 8-44 34z" fill="${h}"/>`,
    ];
    const hairTop = hairTops[p.style] || hairTops[0];

    let ex = '';
    if (p.x === 'glasses') {
      ex = `<g fill="none" stroke="#111" stroke-width="3"><rect x="68" y="98" width="28" height="22" rx="7"/><rect x="104" y="98" width="28" height="22" rx="7"/><path d="M96 108h8"/></g>`;
    }
    if (p.x === 'round') {
      ex = `<g fill="none" stroke="#111" stroke-width="3"><circle cx="82" cy="109" r="13"/><circle cx="118" cy="109" r="13"/><path d="M95 108h10"/></g>`;
    }

    let wear = `<path d="M30 300c0-52 22-92 70-92s70 40 70 92z" fill="${o}"/>`;
    if (p.x === 'tie') {
      wear += `<path d="M84 208l16 20 16-20 6 18-14 4 8 66h-32l8-66-14-4z" fill="#fff"/><path d="M96 226h8l5 60h-18z" fill="#111"/>`;
    }
    if (p.x === 'vest') {
      wear += `<path d="M70 208l30 40 30-40v92H70z" fill="#fff" opacity=".9"/><path d="M100 248l-18 52h36z" fill="#111" opacity=".6"/>`;
    }
    if (p.x === 'blazer') {
      wear += `<path d="M84 208l16 36 16-36 22 12-20 80H82l-20-80z" fill="#eaeaf5" opacity=".9"/>`;
    }
    if (p.x === 'tee') {
      wear += `<path d="M82 208q18 18 36 0" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="3"/>`;
    }

    return `<svg viewBox="0 0 200 300" aria-hidden="true">${hairBack}<g class="body">${wear}<rect x="86" y="170" width="28" height="44" rx="12" fill="${k}"/><g class="head"><ellipse cx="100" cy="112" rx="42" ry="50" fill="${k}"/>${hairTop}
 <g class="brows" stroke="${h}" stroke-width="3.5" stroke-linecap="round"><path d="M70 94q12-6 24 0"/><path d="M106 94q12-6 24 0"/></g>
 <g class="eyes"><g class="eye" style="transform-origin:82px 108px"><ellipse cx="82" cy="108" rx="7" ry="5.5" fill="#fff"/><circle class="pu" cx="82" cy="108" r="3.4" fill="#1a1a22"/></g><g class="eye" style="transform-origin:118px 108px"><ellipse cx="118" cy="108" rx="7" ry="5.5" fill="#fff"/><circle class="pu" cx="118" cy="108" r="3.4" fill="#1a1a22"/></g></g>${ex}
 <path d="M100 112q-4 14 2 18" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="2.5" stroke-linecap="round"/>
 <ellipse class="mo" cx="100" cy="143" rx="11" ry="2" fill="#5a1f2a"/></g></g></svg>`;
  };

  // Continuous animation loop
  useEffect(() => {
    let animId: number;
    let mouth = 0;
    let target = 0;
    let blink = 0;
    let nextBlink = 2.5;

    // Cache DOM queries inside slides
    const parts = slidesRef.current.map((slideEl) => {
      if (!slideEl) return null;
      return {
        el: slideEl,
        head: slideEl.querySelector('.head') as SVGElement | null,
        body: slideEl.querySelector('.body') as SVGElement | null,
        eyes: Array.from(slideEl.querySelectorAll('.eye')) as SVGElement[],
        pu: Array.from(slideEl.querySelectorAll('.pu')) as SVGElement[],
        mo: slideEl.querySelector('.mo') as SVGElement | null,
        brows: slideEl.querySelector('.brows') as SVGElement | null,
        phase: Math.random() * 9,
      };
    });

    const frame = (ms: number) => {
      animId = requestAnimationFrame(frame);
      const t = ms / 1000;
      const {
        currentIndex: cur,
        avatarState: st,
        audioVolume: vol,
        idleIntensity: I,
      } = stateRef.current;

      // Natural random eye blinking
      if (t > nextBlink) {
        blink = 1;
        nextBlink = t + 2.5 + Math.random() * 3.5;
      }
      blink = Math.max(0, blink - 0.12);
      const bl = blink > 0 ? 1 - Math.sin((1 - blink) * Math.PI) * 0.92 : 1;

      // Update character transforms
      parts.forEach((p, i) => {
        if (!p) return;
        const isCurrent = i === cur;
        const q = isCurrent ? 1 : 0.5;
        const u = t + p.phase;

        const br = Math.sin(u * 1.7) * 1.6 * I;
        const sway = (Math.sin(u * 0.55) * 2.2 + Math.sin(u * 0.23) * 1.5) * I * q;

        let hr = sway;
        let hy = br * 0.6;
        let hx = Math.sin(u * 0.4) * 2 * I * q;
        const bs = Math.sin(u * 0.8) * 1.2 * I;

        if (isCurrent) {
          if (st === 'listening') {
            hr = -5 + sway * 0.3;
            hy += 3;
          } else if (st === 'processing') {
            hr = 4;
            hy -= 2;
            hx += 4;
          } else if (st === 'speaking') {
            hr += Math.sin(u * 2.3) * 2.2;
            hy += Math.sin(u * 4.1) * 1.2;
          }
        }

        if (p.body) p.body.setAttribute('transform', `translate(${bs} ${br})`);
        if (p.head) p.head.setAttribute('transform', `translate(${hx} ${hy}) rotate(${hr} 100 170)`);

        p.eyes.forEach((eye) => {
          eye.style.transform = `scaleY(${isCurrent ? bl : 1})`;
        });

        const gx = isCurrent ? (st === 'processing' ? -2.5 : Math.sin(u * 0.6) * 1.4 * I) : 0;
        p.pu.forEach((pu) => {
          pu.setAttribute('transform', `translate(${gx} ${st === 'processing' && isCurrent ? -2 : 0})`);
        });

        if (p.brows) {
          p.brows.setAttribute('transform', `translate(0 ${isCurrent && st === 'speaking' ? -1.5 + Math.sin(u * 3) * 1 : 0})`);
        }

        if (isCurrent && p.mo) {
          const open = st === 'speaking' ? mouth : 0;
          p.mo.setAttribute('ry', String(2 + open * 11));
          p.mo.setAttribute('rx', String(11 - open * 3));
        }
      });

      // Lip-sync speech oscillation
      if (st === 'speaking') {
        const normalizedVol = Math.max(0, Math.min(1, vol / 255));
        const syl = Math.abs(Math.sin(t * 9.5) * Math.sin(t * 3.1 + 1)) * (0.55 + 0.45 * Math.sin(t * 1.3));
        target = 0.15 + syl * 0.55 + normalizedVol * 0.45;
      } else {
        target = 0;
      }

      mouth += (target - mouth) * 0.35;
    };

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Update layout of slides
  useEffect(() => {
    const total = SPECIALIST_DESIGNS.length;
    const innerW = window.innerWidth;

    slidesRef.current.forEach((slideEl, i) => {
      if (!slideEl) return;
      let offset = i - currentIndex;
      if (offset > 3) offset -= total;
      if (offset < -3) offset += total;

      const absOffset = Math.abs(offset);
      const xDistance = offset * Math.min(innerW * 0.34, 380);

      slideEl.style.transform = `translateX(calc(-50% + ${xDistance}px)) scale(${absOffset ? 0.62 : 1})`;
      slideEl.style.opacity = absOffset === 0 ? '1' : absOffset === 1 ? '0.35' : '0';
      slideEl.style.pointerEvents = absOffset === 0 ? 'auto' : 'none';
      slideEl.style.zIndex = String(10 - absOffset);

      if (absOffset > 0) {
        slideEl.classList.add('side');
      } else {
        slideEl.classList.remove('side');
      }
    });
  }, [currentIndex]);

  const currentSpecialist = SPECIALIST_DESIGNS[currentIndex] || SPECIALIST_DESIGNS[0];

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="slides select-none"
    >
      {/* Glowing Elliptical Platform */}
      <div className="platform" />

      {/* 7 Specialist Avatar Slides */}
      {SPECIALIST_DESIGNS.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => {
            slidesRef.current[i] = el;
          }}
          className="slide cursor-pointer"
          onClick={() => {
            if (i !== currentIndex) onSelectIndex(i);
          }}
          dangerouslySetInnerHTML={{ __html: getAvatarSvg(p) }}
        />
      ))}

      {/* Real-time Waveform / Equalizer Overlay positioned at platform base */}
      <WaveformOverlay
        avatarState={avatarState}
        activeModel={{
          id: currentSpecialist.id as any,
          name: currentSpecialist.n,
          tagline: currentSpecialist.role,
          role: currentSpecialist.role,
          shortIntro: currentSpecialist.intro,
          specialization: currentSpecialist.skills.join(', '),
          description: currentSpecialist.intro,
          accentColor: currentSpecialist.c,
          accentGlow: `color-mix(in srgb, ${currentSpecialist.c} 50%, transparent)`,
          avatarStyle: {
            hairColor: 0x1d1a22,
            clothingColor: 0x1c2a44,
            accentColor: 0x22b8e8,
            visorOrGlass: false,
            garmentType: 'tactical',
          },
          voiceConfig: {
            pitch: 1.0,
            rate: 1.0,
            lang: 'en-US',
            preferredVoiceNames: [],
          },
          capabilities: currentSpecialist.skills,
          suggestedPrompts: [],
          systemPrompt: '',
        }}
        audioVolume={audioVolume}
        frequencyData={frequencyData}
      />
    </div>
  );
};
