import React from 'react';
import {
  FileText,
  History,
  MessageSquare,
  Mic,
  Settings,
  Sparkles,
  Wifi,
} from 'lucide-react';
import { AIModel, AvatarState } from '../types';

interface TopNavigationProps {
  activeModel: AIModel;
  avatarState: AvatarState;
  isChatOpen: boolean;
  isHistoryOpen: boolean;
  onToggleChat: () => void;
  onToggleHistory: () => void;
  onOpenSettings: () => void;
  onOpenFRD: () => void;
  onToggleVoice: () => void;
  isVoiceActive: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeModel,
  avatarState,
  isChatOpen,
  isHistoryOpen,
  onToggleChat,
  onToggleHistory,
  onOpenSettings,
  onOpenFRD,
  onToggleVoice,
  isVoiceActive,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 pointer-events-none">
      {/* Left: Brand & Identity */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <button
          onClick={onToggleHistory}
          aria-label="Toggle Conversation History"
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
            isHistoryOpen
              ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-lg shadow-sky-500/10'
              : 'bg-slate-900/80 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <History className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">History</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 shadow-inner">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wider text-white">A.I.D.A</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Virtual AI Desktop Assistant</p>
          </div>
        </div>
      </div>

      {/* Center: Active Specialist Status */}
      <div className="pointer-events-auto hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-lg backdrop-blur-sm">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: activeModel.accentColor }}
        />
        <span className="text-xs font-semibold tracking-wide text-slate-200">
          {activeModel.name}
        </span>
        <span className="text-xs text-slate-500">|</span>
        <span className="text-xs text-slate-400 max-w-[200px] truncate">{activeModel.role}</span>
        <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded bg-slate-800 text-slate-300 border border-slate-700">
          {avatarState}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {/* FRD Specification Hub Button */}
        <button
          onClick={onOpenFRD}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-500/15 border border-indigo-400/40 text-indigo-300 hover:bg-indigo-500/25 hover:border-indigo-400 transition-all shadow-md shadow-indigo-500/10"
          title="Open Complete 35-Section Functional Requirements Document"
        >
          <FileText className="w-4 h-4 text-indigo-400" />
          <span className="hidden lg:inline">FRD Spec (35 Sections)</span>
          <span className="lg:hidden">FRD</span>
        </button>

        {/* Voice Interaction Toggle */}
        <button
          onClick={onToggleVoice}
          aria-label={isVoiceActive ? 'Stop Voice Recording' : 'Start Voice Recording'}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
            isVoiceActive
              ? 'bg-rose-500/20 border-rose-400 text-rose-300 animate-pulse'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Mic className={`w-4 h-4 ${isVoiceActive ? 'text-rose-400' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">{isVoiceActive ? 'Listening' : 'Voice'}</span>
        </button>

        {/* Text Chat Drawer Toggle */}
        <button
          onClick={onToggleChat}
          aria-label="Toggle Chat Panel"
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
            isChatOpen
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Chat</span>
        </button>

        {/* Settings Modal Trigger */}
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="p-2 text-slate-400 hover:text-white bg-slate-900/80 border border-slate-700 hover:border-slate-600 rounded-lg transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Online Status */}
        <div
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
          title="Online & Ready"
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>Online</span>
        </div>
      </div>
    </header>
  );
};
