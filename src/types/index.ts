export type AIModelId =
  | 'non-stop'
  | 'executive'
  | 'coder'
  | 'architect'
  | 'security'
  | 'researcher'
  | 'writer';

export type AvatarState = 'idle' | 'listening' | 'processing' | 'speaking' | 'transition';

export interface AIModel {
  id: AIModelId;
  name: string;
  tagline: string;
  role: string;
  shortIntro: string;
  specialization: string;
  description: string;
  accentColor: string;
  accentGlow: string;
  avatarStyle: {
    hairColor: number;
    clothingColor: number;
    accentColor: number;
    visorOrGlass: boolean;
    garmentType: 'tactical' | 'suit' | 'hoodie' | 'architect' | 'armor' | 'coat' | 'minimalist';
  };
  voiceConfig: {
    pitch: number;
    rate: number;
    lang: string;
    preferredVoiceNames: string[];
  };
  capabilities: string[];
  suggestedPrompts: string[];
  systemPrompt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  modelId: AIModelId;
  content: string;
  timestamp: number;
  routedFrom?: AIModelId;
  routedTo?: AIModelId;
}

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  modelId: AIModelId;
  messages: ChatMessage[];
}

export interface UserSettings {
  defaultModelId: AIModelId;
  appLanguage: string;
  soundEffects: boolean;
  avatarQuality: 'high' | 'medium' | 'performance';
  enableIdleAnimation: boolean;
  wireframeMode: boolean;
  speechRate: number;
  speechPitch: number;
  autoPlayAudio: boolean;
  autoOpenChat: boolean;
  themeAccent: string;
}

export interface FRDRequirement {
  id: string;
  module: string;
  feature: string;
  trigger: string;
  behavior: string;
  input: string;
  output: string;
  dependencies: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  acceptanceCriteria: string;
}

export interface FRDSection {
  number: number;
  title: string;
  summary: string;
  contentMarkdown: string;
}
