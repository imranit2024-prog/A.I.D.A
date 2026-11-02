import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  MessageSquare,
  Mic,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AIModel } from '../types';

interface NonStopWelcomeProps {
  model: AIModel;
  onSelectPrompt: (prompt: string) => void;
  onStartVoice: () => void;
  onOpenChat: () => void;
  onExploreSpecialists: () => void;
}

export const NonStopWelcome: React.FC<NonStopWelcomeProps> = ({
  model,
  onSelectPrompt,
  onStartVoice,
  onOpenChat,
  onExploreSpecialists,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div className="absolute top-20 left-6 z-20 pointer-events-auto">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-xl hover:bg-slate-800 transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Show Welcome Overview</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-20 left-6 max-w-xl z-20 pointer-events-none">
      <div className="pointer-events-auto p-6 rounded-2xl bg-slate-950/85 border border-slate-800/80 shadow-2xl backdrop-blur-md transition-all">
        {/* Header Controls */}
        <div className="flex items-start justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Default Launch Mode • Non-Stop Coordinator</span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Minimize Welcome Overview"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Welcome Text */}
        <div className="space-y-1 mb-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">A.I.D.A</span>
          </h1>
          <h2 className="text-lg font-semibold text-slate-200">
            Your Virtual AI Team.
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          A unified AI platform with specialized experts to help you plan, build, analyze, create and protect — all in one place.
        </p>

        {/* Non-stop Coordinator Overview Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/20 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>NON-STOP Coordinator Intelligence</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              Active Ready
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>General AI Assistance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Intent Recognition</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Specialist Recommendations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Intelligent Task Routing</span>
            </div>
          </div>
        </div>

        {/* Quick Starter Prompts */}
        <div className="space-y-2 mb-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Suggested Collaborative Prompts:
          </p>
          <div className="space-y-1.5">
            {model.suggestedPrompts.slice(0, 2).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPrompt(prompt)}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-200 hover:text-white transition-all flex items-center justify-between group"
              >
                <span className="truncate pr-2">{prompt}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
          <button
            onClick={onStartVoice}
            className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Mic className="w-4 h-4" />
            <span>Voice Interaction</span>
          </button>

          <button
            onClick={onOpenChat}
            className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white font-semibold text-xs transition-all"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Text Conversation</span>
          </button>

          <button
            onClick={onExploreSpecialists}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-all"
            title="Inspect 6 Specialists"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
