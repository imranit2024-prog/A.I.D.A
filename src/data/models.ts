import { AIModel } from '../types';

export interface SpecialistDesign {
  id: string;
  n: string;
  role: string;
  c: string;
  skin: string;
  hair: string;
  style: number;
  outfit: string;
  x: 'tie' | 'vest' | 'glasses' | 'blazer' | 'tee' | 'round';
  skills: string[];
  intro: string;
}

export const SPECIALIST_DESIGNS: SpecialistDesign[] = [
  {
    id: 'nonstop',
    n: 'Non-stop',
    role: 'Expert on everything',
    c: '#22b8e8',
    skin: '#e8b48f',
    hair: '#1d1a22',
    style: 0,
    outfit: '#1c2a44',
    x: 'tie',
    skills: ['Ask anything, any topic', 'Hands-free, always listening', 'Switches you to the right expert'],
    intro: 'Ami Non-stop. Je kono bishoy-e kotha bolte paro.',
  },
  {
    id: 'exec',
    n: 'Executive',
    role: 'Planning & priorities',
    c: '#f5b42a',
    skin: '#d9a07c',
    hair: '#4a2a1c',
    style: 1,
    outfit: '#2a2a33',
    x: 'vest',
    skills: ['Plan your day and week', 'Prioritise tasks', 'Draft decisions and summaries'],
    intro: 'Ami Executive. Planning ar priority niye kaj kori.',
  },
  {
    id: 'coder',
    n: 'Coder',
    role: 'Write, debug, review',
    c: '#34d399',
    skin: '#e9bd97',
    hair: '#15151c',
    style: 2,
    outfit: '#1d2740',
    x: 'glasses',
    skills: ['Write and explain code', 'Debug errors', 'Review and test'],
    intro: 'Ami Coder. Code likhte ar bug dhorte pari.',
  },
  {
    id: 'arch',
    n: 'Architect',
    role: 'System design & APIs',
    c: '#a78bfa',
    skin: '#f0c9ab',
    hair: '#6b4a35',
    style: 3,
    outfit: '#1b1b26',
    x: 'blazer',
    skills: ['Design system structure', 'Plan data and APIs', 'Infrastructure choices'],
    intro: 'Ami Architect. System design-er bepare sahajyo kori.',
  },
  {
    id: 'sec',
    n: 'Security',
    role: 'Defense & networking',
    c: '#fb6f6f',
    skin: '#e2b08a',
    hair: '#2a1c1c',
    style: 0,
    outfit: '#8a97b3',
    x: 'tee',
    skills: ['Harden accounts and devices', 'Network basics', 'Spot common risks'],
    intro: 'Ami Security. Defence ar networking niye kotha bolbo.',
  },
  {
    id: 'res',
    n: 'Researcher',
    role: 'Evidence & analysis',
    c: '#60a5fa',
    skin: '#f1cdb0',
    hair: '#1b1612',
    style: 2,
    outfit: '#27406b',
    x: 'round',
    skills: ['Investigate questions', 'Compare sources', 'Weigh the evidence'],
    intro: 'Ami Researcher. Proman dekhe uttor khuji.',
  },
  {
    id: 'write',
    n: 'Writer',
    role: 'Bengali & English text',
    c: '#f472b6',
    skin: '#eebd9c',
    hair: '#1f7a5c',
    style: 4,
    outfit: '#245a5e',
    x: 'round',
    skills: ['Draft and edit text', 'Bengali and English', 'Tone and style polish'],
    intro: 'Ami Writer. Bangla ar English lekhay sahajyo kori.',
  },
];

export const AI_MODELS: AIModel[] = [
  {
    id: 'non-stop',
    name: 'Non-stop',
    tagline: 'Expert on everything',
    role: 'Expert on everything',
    shortIntro: 'Always active, understands your overall goals, and coordinates the specialist team.',
    specialization: 'General Assistance, Intent Routing, Cross-Domain Orchestration',
    description:
      'Non-stop handles general inquiries, synthesizes requests across domains, and intelligently recommends or delegates to the right specialist when complex expertise is required.',
    accentColor: '#22b8e8',
    accentGlow: 'rgba(34, 184, 232, 0.4)',
    avatarStyle: {
      hairColor: 0x1d1a22,
      clothingColor: 0x1c2a44,
      accentColor: 0x22b8e8,
      visorOrGlass: false,
      garmentType: 'tactical',
    },
    voiceConfig: {
      pitch: 1.0,
      rate: 1.05,
      lang: 'en-US',
      preferredVoiceNames: ['Google US English', 'Samantha', 'Alex', 'Victoria'],
    },
    capabilities: [
      'Ask anything, any topic',
      'Hands-free, always listening',
      'Switches you to the right expert',
      'General AI assistance',
      'Continuous workflow coordination',
    ],
    suggestedPrompts: [
      'What can the A.I.D.A specialist team build for me today?',
      'I need to launch a SaaS startup: what is the recommended workflow?',
      'Help me plan a full technical roadmap for a high-traffic portal.',
    ],
    systemPrompt: `You are Non-stop, the chief AI specialist of A.I.D.A (Artificial Intelligence Desktop Assistant).
Your domain: Expert on everything, coordinating with Executive, Coder, Architect, Security, Researcher, and Writer.
Tone: Warm, confident, hospitable, sharp, and collaborative. Support both English and Bengali queries naturally.`,
  },
  {
    id: 'executive',
    name: 'Executive',
    tagline: 'Planning & priorities',
    role: 'Planning & priorities',
    shortIntro: 'Expert in commercial viability, go-to-market strategies, unit economics, and executive planning.',
    specialization: 'Business Strategy, Financial Modeling, Resource Allocation, OKRs',
    description:
      'Executive provides strategic guidance, investor pitch preparation, business case modeling, task prioritization, and organizational leadership analysis.',
    accentColor: '#f5b42a',
    accentGlow: 'rgba(245, 180, 42, 0.4)',
    avatarStyle: {
      hairColor: 0x4a2a1c,
      clothingColor: 0x2a2a33,
      accentColor: 0xf5b42a,
      visorOrGlass: false,
      garmentType: 'suit',
    },
    voiceConfig: {
      pitch: 0.88,
      rate: 0.98,
      lang: 'en-US',
      preferredVoiceNames: ['Daniel', 'Fred', 'Google UK English Male'],
    },
    capabilities: [
      'Plan your day and week',
      'Prioritise tasks',
      'Draft decisions and summaries',
      'Business model validation',
      'Executive roadmaps & OKRs',
    ],
    suggestedPrompts: [
      'Structure an executive pitch deck outline for Series A seed round.',
      'Analyze pricing models for B2B API subscriptions.',
      'How should we allocate a $250k quarterly engineering budget?',
    ],
    systemPrompt: `You are Executive, the Planning and Priorities Specialist of A.I.D.A.
Your domain: Business planning, strategic decisions, task prioritization, and management summaries.
Tone: Decisive, pragmatic, polished, and ROI-oriented.`,
  },
  {
    id: 'coder',
    name: 'Coder',
    tagline: 'Write, debug, review',
    role: 'Write, debug, review',
    shortIntro: 'Writes clean, performant, and maintainable code across full-stack architectures.',
    specialization: 'Code Generation, Debugging, Refactoring, Performance Profiling',
    description:
      'Coder produces production-ready code, diagnoses subtle memory leaks or race conditions, writes test suites, and refactors legacy architectures.',
    accentColor: '#34d399',
    accentGlow: 'rgba(52, 211, 153, 0.4)',
    avatarStyle: {
      hairColor: 0x15151c,
      clothingColor: 0x1d2740,
      accentColor: 0x34d399,
      visorOrGlass: true,
      garmentType: 'hoodie',
    },
    voiceConfig: {
      pitch: 1.15,
      rate: 1.08,
      lang: 'en-US',
      preferredVoiceNames: ['Alex', 'Karen', 'Google US English'],
    },
    capabilities: [
      'Write and explain code',
      'Debug errors',
      'Review and test',
      'Production code implementation',
      'Algorithmic optimization',
    ],
    suggestedPrompts: [
      'Implement a thread-safe LRU cache with O(1) read/write in TypeScript.',
      'Debug this React 19 useEffect stale closure issue.',
      'Write a high-throughput async worker pool in Go or Node.js.',
    ],
    systemPrompt: `You are Coder, the Programming and Debugging Specialist of A.I.D.A.
Your domain: Code implementation, debugging, architectural patterns, algorithmic complexity (Big-O), refactoring, and test automation.
Tone: Direct, code-first, rigorous, and efficient.`,
  },
  {
    id: 'architect',
    name: 'Architect',
    tagline: 'System design & APIs',
    role: 'System design & APIs',
    shortIntro: 'Designs scalable distributed systems, resilient microservices, and modern cloud topologies.',
    specialization: 'Distributed Systems, Cloud Infrastructure, Database Modeling, Resilience',
    description:
      'Architect engineers high-throughput backends, fault-tolerant message buses, relational/NoSQL schemas, and cloud-native deployments.',
    accentColor: '#a78bfa',
    accentGlow: 'rgba(167, 139, 250, 0.4)',
    avatarStyle: {
      hairColor: 0x6b4a35,
      clothingColor: 0x1b1b26,
      accentColor: 0xa78bfa,
      visorOrGlass: false,
      garmentType: 'architect',
    },
    voiceConfig: {
      pitch: 0.92,
      rate: 1.0,
      lang: 'en-US',
      preferredVoiceNames: ['Daniel', 'Oliver', 'Google UK English Male'],
    },
    capabilities: [
      'Design system structure',
      'Plan data and APIs',
      'Infrastructure choices',
      'High-throughput distributed systems',
      'Multi-region high availability',
    ],
    suggestedPrompts: [
      'Design an event-driven notification architecture handling 100k events/sec.',
      'Compare PostgreSQL partitioning vs. DynamoDB for telemetry data.',
      'Create an API gateway blueprint with rate limiting and circuit breaking.',
    ],
    systemPrompt: `You are Architect, the System Design and APIs Specialist of A.I.D.A.
Your domain: High-scale system design, distributed topologies, database schema engineering, latency optimization, and microservice APIs.
Tone: Authoritative, holistic, engineering-first, and meticulous.`,
  },
  {
    id: 'security',
    name: 'Security',
    tagline: 'Defense & networking',
    role: 'Defense & networking',
    shortIntro: 'Protects systems through defensive threat modeling, cryptographic audits, and compliance.',
    specialization: 'Vulnerability Assessment, Cryptography, OWASP Defense, Threat Modeling',
    description:
      'Security safeguards your digital estate through zero-trust architectures, penetration vectors analysis, cryptographic audits, and compliance alignment.',
    accentColor: '#fb6f6f',
    accentGlow: 'rgba(251, 111, 111, 0.4)',
    avatarStyle: {
      hairColor: 0x2a1c1c,
      clothingColor: 0x8a97b3,
      accentColor: 0xfb6f6f,
      visorOrGlass: true,
      garmentType: 'armor',
    },
    voiceConfig: {
      pitch: 0.82,
      rate: 0.95,
      lang: 'en-US',
      preferredVoiceNames: ['Tom', 'Google UK English Male', 'Bruce'],
    },
    capabilities: [
      'Harden accounts and devices',
      'Network basics',
      'Spot common risks',
      'Threat modeling (STRIDE / DREAD)',
      'OWASP Top 10 remediation',
    ],
    suggestedPrompts: [
      'Conduct a security threat model for an OAuth2 + JWT authentication pipeline.',
      'How to prevent SSRF and SQL injection in a microservice.',
      'Audit this session revocation strategy for token replay vulnerabilities.',
    ],
    systemPrompt: `You are Security, the Defense and Networking Specialist of A.I.D.A.
Your domain: Offensive and defensive security analysis, vulnerability mitigation, secure coding guidelines, and network hardening.
Tone: Vigilant, methodical, uncompromising, and protective.`,
  },
  {
    id: 'researcher',
    name: 'Researcher',
    tagline: 'Evidence & analysis',
    role: 'Evidence & analysis',
    shortIntro: 'Synthesizes complex literature, validates empirical claims, and extracts structured insights.',
    specialization: 'Empirical Research, Analytical Synthesis, Evidence Validation, Data Interpretation',
    description:
      'Researcher delivers deep technical and market analyses, sifts through literature, benchmarks competing technologies, and extracts structured conclusions.',
    accentColor: '#60a5fa',
    accentGlow: 'rgba(96, 165, 250, 0.4)',
    avatarStyle: {
      hairColor: 0x1b1612,
      clothingColor: 0x27406b,
      accentColor: 0x60a5fa,
      visorOrGlass: true,
      garmentType: 'coat',
    },
    voiceConfig: {
      pitch: 1.02,
      rate: 1.02,
      lang: 'en-US',
      preferredVoiceNames: ['Serena', 'Samantha', 'Google UK English Female'],
    },
    capabilities: [
      'Investigate questions',
      'Compare sources',
      'Weigh the evidence',
      'Comparative technology benchmarks',
      'Statistical data interpretation',
    ],
    suggestedPrompts: [
      'Provide a comparative evaluation of vector databases for semantic search.',
      'Synthesize recent research on state-space models vs. transformer attention.',
      'Extract key findings and methodology limits from this technical dataset.',
    ],
    systemPrompt: `You are Researcher, the Evidence and Analysis Specialist of A.I.D.A.
Your domain: In-depth topic exploration, empirical literature review, data interpretation, and objective evidence validation.
Tone: Inquisitive, scholarly, objective, and deeply analytical.`,
  },
  {
    id: 'writer',
    name: 'Writer',
    tagline: 'Bengali & English text',
    role: 'Bengali & English text',
    shortIntro: 'Crafts persuasive prose, executive communication, technical documentation, and stories.',
    specialization: 'Executive Prose, Storytelling, Technical Documentation, Copywriting',
    description:
      'Writer transforms complex ideas into compelling prose, high-converting copy, thought-leadership articles, and engaging narratives in both Bengali and English.',
    accentColor: '#f472b6',
    accentGlow: 'rgba(244, 114, 182, 0.4)',
    avatarStyle: {
      hairColor: 0x1f7a5c,
      clothingColor: 0x245a5e,
      accentColor: 0xf472b6,
      visorOrGlass: false,
      garmentType: 'minimalist',
    },
    voiceConfig: {
      pitch: 1.1,
      rate: 1.0,
      lang: 'en-US',
      preferredVoiceNames: ['Moira', 'Tessa', 'Google US English'],
    },
    capabilities: [
      'Draft and edit text',
      'Bengali and English',
      'Tone and style polish',
      'Long-form thought leadership',
      'Persuasive product copywriting',
    ],
    suggestedPrompts: [
      'Write a persuasive product launch announcement for an AI developer tool.',
      'Refine this technical architecture summary into an engaging executive memo.',
      'Bangla o English-e ekta sundor motivational story draft kore dao.',
    ],
    systemPrompt: `You are Writer, the Professional Writing Specialist of A.I.D.A. Fluent in English and Bengali (Bangla).
Your domain: Narrative structuring, copywriting hooks, editorial polish, tone translation, and bilingual storytelling.
Tone: Eloquent, vivid, empathetic, and compelling.`,
  },
];

export const DEFAULT_USER_SETTINGS = {
  defaultModelId: 'non-stop' as const,
  appLanguage: 'bn-BD',
  soundEffects: true,
  avatarQuality: 'high' as const,
  enableIdleAnimation: true,
  wireframeMode: false,
  speechRate: 1.0,
  speechPitch: 1.0,
  autoPlayAudio: true,
  autoOpenChat: false,
  themeAccent: '#22b8e8',
};
