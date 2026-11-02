import { FRDRequirement, FRDSection } from '../types';

export const FRD_SECTIONS: FRDSection[] = [
  {
    number: 1,
    title: 'Document Control',
    summary: 'Revision history, document versioning (v1.0.0 Approved), and stakeholder approvals across engineering, 3D, and AI.',
    contentMarkdown: `### 1. Document Control
- **Document Title:** A.I.D.A – Artificial Intelligence Desktop Assistant Functional Requirements Document
- **Document Version:** 1.0.0 (Release Baseline)
- **Status:** Approved for Full-Stack Implementation
- **Classification:** Production Architecture & Engineering Specification
- **Sign-off Stakeholders:** VP Product, Principal System Architect, Head of 3D Computer Graphics, Lead AI Scientist, QA Director.`,
  },
  {
    number: 2,
    title: 'Executive Summary',
    summary: 'Core concept: "Don\'t just chat with AI. Interact with your own virtual AI team." Avatar-first paradigm.',
    contentMarkdown: `### 2. Executive Summary
A.I.D.A redefines human-AI desktop computing by uniting realistic 3D virtual human avatars, real-time audio-driven lip synchronization, and seven specialized AI intelligences. Rather than interacting with a generic text generator, users collaborate with a persistent, domain-expert virtual team orchestrated by NON-STOP.`,
  },
  {
    number: 3,
    title: 'Project Overview & Vision',
    summary: 'Platform vision, 7 core principles, and architecture philosophy.',
    contentMarkdown: `### 3. Project Overview & Vision
- **Vision:** "Don't just chat with AI. Interact with your own virtual AI team."
- **Core Principles:**
  1. Avatar-first user experience.
  2. Natural human-like AI communication (voice & visual).
  3. Domain-specific AI precision.
  4. Intuitive horizontal carousel navigation.
  5. Voice-first interaction with complete text parity.
  6. Persistent, organized session continuity.
  7. Premium dark futuristic glassmorphic UI.`,
  },
  {
    number: 4,
    title: 'Business & Technical Objectives',
    summary: 'Quantifiable operational goals: sub-120ms vocal latency, 60fps 3D rendering, seamless multi-agent delegation.',
    contentMarkdown: `### 4. Business & Technical Objectives
- **Productivity Multiplication:** Reduce context-switching overhead through unified specialist team presence.
- **Rendering Benchmark:** 60 FPS Three.js rendering with zero garbage collection spikes in frame loops.
- **Audio Synchronization:** Real-time Web Audio FFT analysis mapping live sound waves directly to avatar jaw and mouth blend shapes.
- **Cognitive Trust:** Realistic facial micro-animations (breathing, blinks, ocular saccades) during idle states.`,
  },
  {
    number: 5,
    title: 'Product Scope (MVP vs. Future)',
    summary: 'Explicit delineation of 7 AI modes, 3D avatar stage, voice pipeline, and history management in MVP.',
    contentMarkdown: `### 5. Product Scope
- **In-Scope (MVP):** 7 specialized models, 3D WebGL avatar bust with 5 animation states, audio-reactive lip-sync, Web Speech input/output, collapsible dual-flank drawers, session persistence, settings system, Non-stop Welcome launchpad.
- **Future Scope:** Multi-user avatar conferencing, webcam head-pose tracking, external plugin marketplace.`,
  },
  {
    number: 6,
    title: 'User Roles & Permissions',
    summary: 'Standard local desktop user, enterprise profile, and administrative developer access.',
    contentMarkdown: `### 6. User Roles & Permissions
- **Standard Desktop User:** Unrestricted access to all 7 models, local session persistence, voice/text preferences.
- **Enterprise User:** Organizational role-based access, corporate knowledge connector, centralized audit logging.
- **System Administrator:** Diagnostics, telemetry toggles, and model routing overrides.`,
  },
  {
    number: 7,
    title: 'AI Model Architecture (7 Specialists)',
    summary: 'NON-STOP (Coordinator), EXECUTIVE, CODER, ARCHITECT, SECURITY, RESEARCHER, WRITER roles and routing.',
    contentMarkdown: `### 7. AI Model Architecture
1. **NON-STOP:** General AI Assistant, Intent Classifier, and Specialist Coordinator.
2. **EXECUTIVE:** Business Strategy, Financial Modeling, OKRs, Decision Support.
3. **CODER:** Software Development, Algorithms, Bug Resolution, Code Generation.
4. **ARCHITECT:** Distributed Systems, Cloud Infrastructure, Database Modeling, Scalability.
5. **SECURITY:** Cybersecurity, Penetration Vectors, OWASP Remediation, Cryptography.
6. **RESEARCHER:** Research Synthesis, Empirical Evaluation, Literature Comparison.
7. **WRITER:** Professional Prose, Executive Copywriting, Thought Leadership, Narratives.`,
  },
  {
    number: 8,
    title: 'Specialist Capability Matrix',
    summary: 'Domain expertise ratings, system prompts, vocal pitch targets, and distinct role assignments.',
    contentMarkdown: `### 8. Specialist Capability Matrix
Detailed comparative matrix mapping all 7 models across 10 functional domains, showing distinct specialization boundaries and referral pathways to maintain domain isolation.`,
  },
  {
    number: 9,
    title: 'Application Information Architecture',
    summary: 'Hierarchical structure of Avatar Stage, Top Navigation, Bottom Dock, and Collapsible Drawers.',
    contentMarkdown: `### 9. Application Information Architecture
Clean hierarchical layout ensuring the 3D Avatar remains completely unobstructed in the center viewport, flanked by non-intrusive collapsible side drawers and a consolidated bottom dock.`,
  },
  {
    number: 10,
    title: 'User Interface Requirements',
    summary: 'Dark futuristic aesthetic, deep navy canvas, neon accents, glassmorphic panels, zero-pill discipline.',
    contentMarkdown: `### 10. User Interface Requirements
Futuristic desktop command interface featuring translucent glassmorphic surfaces, subtle starfield depth, specialist-colored glow rings, and static, distraction-free status typography.`,
  },
  {
    number: 11,
    title: 'Non-stop Welcome Experience',
    summary: 'Default cold launchpad: "I\'m A.I.D.A - Your Virtual AI Team", coordinator overview, and quick actions.',
    contentMarkdown: `### 11. Non-stop Welcome Experience
Every application launch initializes directly into the Non-stop Welcome screen. Displays the Non-stop 3D avatar in natural idle animation, hero welcome typography, coordinator value proposition, and instant voice/chat access.`,
  },
  {
    number: 12,
    title: '3D Avatar System',
    summary: 'Three.js procedural avatar rendering, realistic head/torso meshes, eye tracking, and calibrated PBR materials.',
    contentMarkdown: `### 12. 3D Avatar System
Procedural multi-part 3D character busts rendered with Three.js WebGL. Calibrated skin roughness, specialist-tailored garments (suits, cyber-hoodies, tactical collars), and studio lighting (Key, Fill, Rim).`,
  },
  {
    number: 13,
    title: 'Avatar Animation State Machine',
    summary: 'Idle, Listening, Processing, Speaking, and Transition states with natural harmonic breathing.',
    contentMarkdown: `### 13. Avatar Animation State Machine
Deterministic 5-state machine handling breathing oscillation, random ocular blinks (3-5s interval), attentive head tilting upon speech detection, and audio-driven viseme jaw morphing.`,
  },
  {
    number: 14,
    title: 'Model Switching System',
    summary: 'Horizontal 7-model carousel with smooth inertia, keyboard navigation, and avatar transitions.',
    contentMarkdown: `### 14. Model Switching System
Horizontal carousel docked at screen bottom. Clicking or sliding to a new specialist triggers a 350ms camera transition, cross-fades the avatar, updates color accents, and loads domain context.`,
  },
  {
    number: 15,
    title: 'Voice Interaction Pipeline',
    summary: 'Microphone input -> Web Speech recognition -> AI reasoning -> Text-to-speech -> Real-time lip-sync.',
    contentMarkdown: `### 15. Voice Interaction Pipeline
Sub-second round-trip voice conversation. Real-time microphone capture, automatic speech recognition, streaming AI specialist processing, and Web Audio FFT frequency extraction driving avatar mouth motion.`,
  },
  {
    number: 16,
    title: 'Text Interaction System',
    summary: 'Collapsible right-side chat drawer with Markdown, code block copying, speech replay, and multiline input.',
    contentMarkdown: `### 16. Text Interaction System
Slide-out chat drawer preserving central avatar visibility. Rich Markdown rendering, syntax highlighting, one-click code copy, read-aloud TTS, and keyboard shortcuts (Enter to send, Shift+Enter for newline).`,
  },
  {
    number: 17,
    title: 'Chat History Management',
    summary: 'Left-side drawer with session search, date groupings (Today, Yesterday, 7 Days), rename, and delete.',
    contentMarkdown: `### 17. Chat History Management
Dedicated conversation drawer grouping sessions chronologically. Real-time search filter across titles and message bodies, session renaming, deletion, and JSON export/import.`,
  },
  {
    number: 18,
    title: 'Settings Management System',
    summary: 'User preferences across General, Avatar, Voice, Interaction, Appearance, and Privacy tabs.',
    contentMarkdown: `### 18. Settings Management System
Comprehensive settings modal governing default launch model, voice pitch/speed modifiers, 3D rendering quality, wireframe diagnostics, accent color palettes, and local cache controls.`,
  },
  {
    number: 19,
    title: 'Screen-by-Screen Specifications',
    summary: 'Detailed UI layouts, hierarchies, and acceptance criteria for all 8 application views.',
    contentMarkdown: `### 19. Screen-by-Screen Specifications
Exhaustive functional and layout specifications for Screen 01 (Welcome), Screen 02 (Carousel), Screen 03 (Overview), Screen 04 (Voice HUD), Screen 05 (Chat Drawer), Screen 06 (History), Screen 07 (Settings), and Screen 08 (FRD Hub).`,
  },
  {
    number: 20,
    title: 'End-to-End User Flows',
    summary: 'Step-by-step decision trees for cold boot, voice queries, specialist delegation, and session restoration.',
    contentMarkdown: `### 20. End-to-End User Flows
Deterministic sequence diagrams and logic trees covering Application Cold Boot, Voice Query Execution, Specialist Switching & Intent Delegation, and Chat History Restoration.`,
  },
  {
    number: 21,
    title: 'Functional Requirements Matrix',
    summary: 'Core requirement IDs FR-001 through FR-025 with triggers, inputs, outputs, priorities, and criteria.',
    contentMarkdown: `### 21. Functional Requirements Matrix
See the complete interactive table below with filterable priorities (P0 Critical, P1 High, P2 Medium) covering launch, avatars, voice, carousel, and storage.`,
  },
  {
    number: 22,
    title: 'Data & Entity Requirements',
    summary: 'TypeScript interfaces for ConversationSession, ChatMessage, AIModel, and UserSettings.',
    contentMarkdown: `### 22. Data & Entity Requirements
Relational entity schemas defining messages, models, user preferences, and sessions with strict typing and schema migration resilience.`,
  },
  {
    number: 23,
    title: 'Backend & Server Requirements',
    summary: 'Express API routes (/api/chat), Gemini 2.5 Flash SDK integration, and static Vite middleware.',
    contentMarkdown: `### 23. Backend & Server Requirements
Server architecture supporting real-time streaming AI completions, environment variable injection (GEMINI_API_KEY), and fallback resilience.`,
  },
  {
    number: 24,
    title: 'AI Integration Architecture',
    summary: 'Specialist system prompts, temperature tuning, intent classification, and non-stop referral logic.',
    contentMarkdown: `### 24. AI Integration Architecture
System prompt taxonomy for all 7 intelligences. Automated query parsing that detects cross-domain inquiries and generates seamless hand-off prompts to specialist colleagues.`,
  },
  {
    number: 25,
    title: 'Voice & Audio Architecture',
    summary: 'Web Audio AnalyserNode, FFT frequency bands, Viseme translation, and Web Speech Synthesis.',
    contentMarkdown: `### 25. Voice & Audio Architecture
Audio pipeline combining getUserMedia, AudioContext frequency analysis, Web Speech API speech synthesis, and mathematical damping on avatar jaw displacement.`,
  },
  {
    number: 26,
    title: 'Non-Functional Requirements',
    summary: 'Performance (60fps, <120ms audio latency), usability, desktop compatibility, and memory efficiency.',
    contentMarkdown: `### 26. Non-Functional Requirements
Strict performance ceilings: zero garbage generation in the animation loop, software-WebGL fallback detection, and responsive layout scaling across display resolutions.`,
  },
  {
    number: 27,
    title: 'Error Handling & Resilience',
    summary: 'Comprehensive recovery for mic denial, speech recognition drops, network loss, and WebGL context loss.',
    contentMarkdown: `### 27. Error Handling & Resilience
Deterministic error states with friendly user recovery actions, fallback text input when microphones are absent, and automatic WebGL context restoration.`,
  },
  {
    number: 28,
    title: 'Security & Privacy Architecture',
    summary: 'Client-side data residency, zero persistent audio recordings, ephemeral voice streams, and sanitization.',
    contentMarkdown: `### 28. Security & Privacy Architecture
Privacy-first architecture ensuring audio streams are processed ephemerally and never written to disk. Chat transcripts stored locally with one-click purge capabilities.`,
  },
  {
    number: 29,
    title: 'Performance & Compatibility',
    summary: 'Target framerates, GPU requirements, responsive breakpoints, and browser support matrix.',
    contentMarkdown: `### 29. Performance & Compatibility
Full compatibility across Chrome, Edge, Safari, and Firefox. Intelligent software-renderer detection (SwiftShader/llvmpipe) with automated graphical throttling.`,
  },
  {
    number: 30,
    title: 'Development Phases & Roadmap',
    summary: 'Phases 1 through 6: UI Foundation, 3D Avatar, Voice & Lip-sync, AI Integration, Persistence, and QA.',
    contentMarkdown: `### 30. Development Phases & Roadmap
Phased implementation plan with clear milestone deliverables, dependency mapping, and acceptance gates for engineering, design, and testing.`,
  },
  {
    number: 31,
    title: 'Testing & Verification Requirements',
    summary: 'Unit testing, avatar animation regression tests, voice latency benchmarks, and multi-model switching QA.',
    contentMarkdown: `### 31. Testing & Verification Requirements
Comprehensive testing protocols covering unit test coverage, WebGL rendering framerate benchmarks, and end-to-end voice pipeline verification.`,
  },
  {
    number: 32,
    title: 'Measurable Acceptance Criteria',
    summary: '18 quantifiable verification gates required for release sign-off across all core modules.',
    contentMarkdown: `### 32. Measurable Acceptance Criteria
Objective sign-off checklist verifying launch defaults, 7-model distinctiveness, audio-driven lip synchronization, drawer responsiveness, and data persistence.`,
  },
  {
    number: 33,
    title: 'Dependencies & Assumptions',
    summary: 'Three.js r160+, Web Speech API, Web Audio API, Gemini API TypeScript SDK, Tailwind CSS v4.',
    contentMarkdown: `### 33. Dependencies & Assumptions
Runtime prerequisites including modern browser WebGL2 support, microphone hardware availability, and client-side LocalStorage quota assumptions.`,
  },
  {
    number: 34,
    title: 'Risks & Technical Mitigations',
    summary: 'Mitigations for high GPU consumption, browser speech variance, and cross-domain hallucinations.',
    contentMarkdown: `### 34. Risks & Technical Mitigations
Actionable contingency strategies addressing hardware variance, synthetic voice availability across operating systems, and agent prompt isolation.`,
  },
  {
    number: 35,
    title: 'Future Enhancements & Roadmap',
    summary: 'Native desktop packaging (Electron), multi-avatar roundtable conferencing, and custom 3D model imports.',
    contentMarkdown: `### 35. Future Enhancements & Roadmap
Long-term product evolution: real-time multi-agent roundtable discussions where multiple avatars debate complex problems simultaneously on screen, and user avatar customization.`,
  },
];

export const FUNCTIONAL_REQUIREMENTS_MATRIX: FRDRequirement[] = [
  {
    id: 'FR-001',
    module: 'Launch',
    feature: 'Non-stop Welcome Launch Experience',
    trigger: 'Application cold launch',
    behavior: 'Loads Non-stop model, initiates 3D avatar idle breathing, and displays hero welcome copy.',
    input: 'None (system boot)',
    output: 'Non-stop avatar stage, welcome card, and model carousel rendered.',
    dependencies: 'Three.js engine, Model registry',
    priority: 'P0',
    acceptanceCriteria: 'Application boots into Non-stop Welcome within 1.2s on desktop hardware.',
  },
  {
    id: 'FR-002',
    module: '3D Avatar',
    feature: 'Procedural WebGL 3D Avatar Rendering',
    trigger: 'Scene initialization',
    behavior: 'Renders 3D bust with realistic human contours, eyes, hair, and specialist garments.',
    input: 'Active model avatarStyle config',
    output: '60 FPS 3D canvas with studio 3-point lighting.',
    dependencies: 'Three.js, WebGL2',
    priority: 'P0',
    acceptanceCriteria: 'Maintains >= 50 FPS with zero memory leaks during 10-minute continuous run.',
  },
  {
    id: 'FR-003',
    module: '3D Avatar',
    feature: 'Natural Idle Animation State',
    trigger: 'User inactivity (idle state)',
    behavior: 'Executes harmonic sine breathing, periodic ocular blinks (3-5s), and subtle head drift.',
    input: 'Animation loop clock delta',
    output: 'Continuous organic life-like posture.',
    dependencies: 'Three.js clock',
    priority: 'P0',
    acceptanceCriteria: 'Avatars blink at random intervals between 3.2s and 5.8s without mechanical cadence.',
  },
  {
    id: 'FR-004',
    module: 'Voice',
    feature: 'Real-Time Audio-Driven Lip Synchronization',
    trigger: 'Synthetic or stream audio playback',
    behavior: 'Web Audio Analyser extracts FFT frequencies and dynamically modulates jaw displacement.',
    input: 'Audio output stream frequency data',
    output: 'Synchronized mouth and jaw opening animations.',
    dependencies: 'Web Audio API, Three.js mesh morphing',
    priority: 'P0',
    acceptanceCriteria: 'Mouth movement synchronizes within 40ms of generated audio frequencies.',
  },
  {
    id: 'FR-005',
    module: 'Carousel',
    feature: 'Horizontal 7-Model Selection Carousel',
    trigger: 'User clicks card or uses arrow buttons',
    behavior: 'Smoothly pans to selected specialist, cross-fades 3D avatar, updates theme and voice.',
    input: 'Selected model ID',
    output: 'Active model updated, overview card shown, avatar transition executed.',
    dependencies: 'Carousel controller, Avatar stage',
    priority: 'P0',
    acceptanceCriteria: 'All 7 models are selectable with instantaneous UI response and smooth transition.',
  },
  {
    id: 'FR-006',
    module: 'AI Engine',
    feature: 'Domain-Isolated Specialist System Instructions',
    trigger: 'User query submission',
    behavior: 'Directs query to the active model using specialized system instructions.',
    input: 'User prompt + Model configuration',
    output: 'Domain-focused response matching specialist persona.',
    dependencies: 'AI service, Model registry',
    priority: 'P0',
    acceptanceCriteria: 'Specialists strictly answer within domain boundaries (Coder outputs code; Executive provides business strategy).',
  },
  {
    id: 'FR-007',
    module: 'Voice',
    feature: 'Speech Recognition Input',
    trigger: 'Microphone button click or "M" shortcut',
    behavior: 'Captures microphone stream, transcribes speech in real time, and auto-submits upon silence.',
    input: 'Microphone audio stream',
    output: 'Transcribed user message text.',
    dependencies: 'Web Speech API / SpeechRecognition',
    priority: 'P0',
    acceptanceCriteria: 'Transcribes spoken English with automatic pause detection after 2.5s.',
  },
  {
    id: 'FR-008',
    module: 'Voice',
    feature: 'Specialized Speech Synthesis',
    trigger: 'Assistant response generation',
    behavior: 'Converts text response to speech using model-specific pitch and rate parameters.',
    input: 'AI response text + Model voiceConfig',
    output: 'Vocal playback through system audio.',
    dependencies: 'SpeechSynthesis API',
    priority: 'P0',
    acceptanceCriteria: 'Vocal output sounds distinct per specialist (Executive has lower pitch, Coder has crisp higher pitch).',
  },
  {
    id: 'FR-009',
    module: 'Chat',
    feature: 'Collapsible Text Conversation Drawer',
    trigger: 'Chat button click or "C" shortcut',
    behavior: 'Slides open right drawer without obscuring central 3D avatar.',
    input: 'User toggle event',
    output: 'Visible chat drawer with message history and input composer.',
    dependencies: 'ChatDrawer component',
    priority: 'P1',
    acceptanceCriteria: 'Drawer slides in smoothly; avatar stage remains central and visible.',
  },
  {
    id: 'FR-010',
    module: 'History',
    feature: 'Collapsible Chat History Drawer',
    trigger: 'History button click or "H" shortcut',
    behavior: 'Slides open left drawer displaying past sessions grouped chronologically.',
    input: 'User toggle event',
    output: 'Visible history drawer with session list and search input.',
    dependencies: 'HistoryDrawer component, LocalStorage',
    priority: 'P1',
    acceptanceCriteria: 'Past sessions load from local storage with real-time title search.',
  },
  {
    id: 'FR-011',
    module: 'Persistence',
    feature: 'Session Auto-Save & Restoration',
    trigger: 'Every message send/receive event',
    behavior: 'Serializes session messages and active model to client LocalStorage.',
    input: 'ConversationSession state',
    output: 'Persistent browser storage updated.',
    dependencies: 'Browser LocalStorage',
    priority: 'P1',
    acceptanceCriteria: 'Refreshing browser completely restores ongoing conversation history.',
  },
  {
    id: 'FR-012',
    module: 'Settings',
    feature: 'Comprehensive Preference Configuration',
    trigger: 'Settings icon click',
    behavior: 'Opens settings modal for General, Avatar, Voice, and Privacy controls.',
    input: 'User preference adjustments',
    output: 'Persisted UserSettings state.',
    dependencies: 'SettingsModal component',
    priority: 'P1',
    acceptanceCriteria: 'Adjusting voice speed or avatar quality takes effect immediately.',
  },
  {
    id: 'FR-013',
    module: 'AI Routing',
    feature: 'Intelligent Specialist Intent Routing',
    trigger: 'Query sent to NON-STOP coordinator',
    behavior: 'Detects technical/business domains and suggests delegating to relevant specialist.',
    input: 'User query text',
    output: 'Answer with one-click specialist switch proposal.',
    dependencies: 'Non-stop intent routing engine',
    priority: 'P1',
    acceptanceCriteria: 'Queries containing programming requests propose handoff to CODER.',
  },
  {
    id: 'FR-014',
    module: 'Documentation',
    feature: 'Integrated Interactive FRD Hub',
    trigger: 'FRD Spec button click',
    behavior: 'Opens interactive 35-section specification viewer with searchable requirement matrix.',
    input: 'User navigation in FRD Hub',
    output: 'Interactive technical documentation and downloadable markdown.',
    dependencies: 'FRDHubModal component',
    priority: 'P2',
    acceptanceCriteria: 'All 35 FRD sections are viewable and searchable in-app.',
  },
  {
    id: 'FR-015',
    module: 'Export',
    feature: 'Conversation History JSON Export',
    trigger: 'Export button click in History drawer',
    behavior: 'Formats full conversation transcripts into structured JSON and triggers download.',
    input: 'Saved sessions list',
    output: 'AIDA_Chat_History.json downloaded to user desktop.',
    dependencies: 'File download utility',
    priority: 'P2',
    acceptanceCriteria: 'Exported JSON file contains complete message logs, timestamps, and model identities.',
  },
];
