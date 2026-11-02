import React from 'react';
import { Mic, MicOff, Volume2, X } from 'lucide-react';
import { AIModel, AvatarState } from '../types';

interface VoiceHUDProps {
  avatarState: AvatarState;
  activeModel: AIModel;
  frequencyData: Uint8Array;
  liveTranscript: string;
  onStopVoice: () => void;
}

export const VoiceHUD: React.FC<VoiceHUDProps> = ({
  avatarState,
  activeModel,
  frequencyData,
  liveTranscript,
  onStopVoice,
}) => {
  if (avatarState !== 'listening' && avatarState !== 'processing' && avatarState !== 'speaking') {
    return null;
  }

  // Sample 16 frequency bars for visualizer
  const bars: number[] = [];
  const step = Math.max(1, Math.floor(frequencyData.length / 16));
  for (let i = 0; i < 16; i++) {
    const val = frequencyData[i * step] || 0;
    bars.push(Math.max(4, Math.min(48, Math.round((val / 255) * 48))));
  }

  return (
    <div className="absolute top-20 right-6 z-30 pointer-events-auto w-[90%] max-w-sm">
      <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {avatarState === 'listening' ? (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wide">
                  Listening to you...
                </span>
              </div>
            ) : avatarState === 'processing' ? (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-spin" />
                <span className="text-xs font-bold text-white tracking-wide">
                  {activeModel.name} is synthesizing...
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span className="text-xs font-bold text-white tracking-wide">
                  {activeModel.name} is speaking
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onStopVoice}
            className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all"
            title="Cancel voice session"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real-Time Audio Frequency Bar Visualizer */}
        <div className="flex items-end justify-center gap-1.5 h-12 py-1 px-4 bg-slate-900/80 rounded-xl border border-slate-800">
          {bars.map((height, idx) => (
            <div
              key={idx}
              className="w-1.5 rounded-full transition-all duration-75"
              style={{
                height: `${height}px`,
                backgroundColor: activeModel.accentColor,
                opacity: Math.max(0.35, height / 48),
              }}
            />
          ))}
        </div>

        {/* Live Transcript / Speech Feedback */}
        {liveTranscript && (
          <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-200 italic truncate text-center">
            "{liveTranscript}"
          </div>
        )}
      </div>
    </div>
  );
};
