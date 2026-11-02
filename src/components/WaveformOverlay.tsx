import React, { useEffect, useRef, useState } from 'react';
import { Activity, Radio, Volume2, Zap } from 'lucide-react';
import { AIModel, AvatarState } from '../types';

interface WaveformOverlayProps {
  avatarState: AvatarState;
  activeModel: AIModel;
  audioVolume: number; // 0 to 255
  frequencyData: Uint8Array;
}

export const WaveformOverlay: React.FC<WaveformOverlayProps> = ({
  avatarState,
  activeModel,
  audioVolume,
  frequencyData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Peak trackers for studio visualizer
  const peaksRef = useRef<number[]>(new Array(40).fill(0));
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isSpeaking = avatarState === 'speaking';
      const isListening = avatarState === 'listening';
      const normalizedVol = Math.max(0, Math.min(1, audioVolume / 255));

      phaseRef.current += 0.08 + normalizedVol * 0.15;
      const phase = phaseRef.current;

      const numBars = 40;
      const barWidth = 4;
      const barGap = 4;
      const totalWidth = numBars * (barWidth + barGap);
      const startX = (width - totalWidth) / 2;
      const centerY = height * 0.65;

      // 1. Draw Symmetrical Equalizer Spectrum
      for (let i = 0; i < numBars; i++) {
        // Map bar index symmetrically from center outward
        const distFromCenter = Math.abs(i - numBars / 2) / (numBars / 2);
        const freqIndex = Math.min(
          frequencyData.length - 1,
          Math.floor((1 - distFromCenter) * (frequencyData.length * 0.8))
        );
        const rawFreq = frequencyData[freqIndex] || 0;

        let barHeight = 0;
        if (isSpeaking) {
          // Dynamic height driven by frequency + audioVolume
          const energy = (rawFreq / 255) * 0.7 + normalizedVol * 0.5;
          barHeight = Math.max(3, energy * (height * 0.55));
        } else if (isListening) {
          const energy = (rawFreq / 255) * 0.5 + normalizedVol * 0.3;
          barHeight = Math.max(2, energy * (height * 0.35));
        } else {
          // Idle baseline rhythm
          barHeight = Math.sin(phase * 1.5 + i * 0.3) * 2 + 3;
        }

        // Update peak decay
        if (barHeight > peaksRef.current[i]) {
          peaksRef.current[i] = barHeight;
        } else {
          peaksRef.current[i] = Math.max(2, peaksRef.current[i] - 0.8);
        }

        const x = startX + i * (barWidth + barGap);
        const yTop = centerY - barHeight / 2;

        // Equalizer Bar Gradient
        const gradient = ctx.createLinearGradient(x, yTop, x, centerY + barHeight / 2);
        gradient.addColorStop(0, activeModel.accentColor);
        gradient.addColorStop(0.5, '#ffffff');
        gradient.addColorStop(1, activeModel.accentColor);

        ctx.fillStyle = gradient;
        ctx.globalAlpha = isSpeaking ? 0.9 : isListening ? 0.65 : 0.25;

        // Draw rounded bar
        ctx.beginPath();
        if ((ctx as any).roundRect) {
          (ctx as any).roundRect(x, yTop, barWidth, Math.max(2, barHeight), 2);
        } else {
          ctx.rect(x, yTop, barWidth, Math.max(2, barHeight));
        }
        ctx.fill();

        // Draw floating peak pip
        if (isSpeaking || isListening) {
          const peakY = centerY - peaksRef.current[i] / 2 - 2;
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.95;
          ctx.fillRect(x, peakY, barWidth, 1.5);
        }
      }

      // 2. Continuous Oscilloscope Harmonic Waveform Ribbon
      ctx.globalAlpha = isSpeaking ? 0.85 : isListening ? 0.5 : 0.2;
      ctx.lineWidth = isSpeaking ? 2 : 1;
      ctx.strokeStyle = activeModel.accentColor;
      ctx.beginPath();

      const wavePoints = 80;
      const waveSpan = totalWidth * 1.35;
      const waveStartX = (width - waveSpan) / 2;

      for (let j = 0; j <= wavePoints; j++) {
        const t = j / wavePoints;
        const wx = waveStartX + t * waveSpan;

        // Multi-frequency sinusoidal modulation
        const ampMultiplier = isSpeaking
          ? (normalizedVol * 22 + 4) * Math.sin(t * Math.PI)
          : isListening
          ? (normalizedVol * 12 + 2) * Math.sin(t * Math.PI)
          : 2 * Math.sin(t * Math.PI);

        const wy =
          centerY +
          Math.sin(t * 12 + phase * 2) * ampMultiplier * 0.6 +
          Math.sin(t * 24 - phase * 3) * ampMultiplier * 0.4;

        if (j === 0) {
          ctx.moveTo(wx, wy);
        } else {
          ctx.lineTo(wx, wy);
        }
      }
      ctx.stroke();

      // Second harmonic soft glow wave
      if (isSpeaking && normalizedVol > 0.15) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6 * normalizedVol;
        ctx.beginPath();
        for (let j = 0; j <= wavePoints; j++) {
          const t = j / wavePoints;
          const wx = waveStartX + t * waveSpan;
          const wy =
            centerY +
            Math.cos(t * 16 - phase * 2.5) * (normalizedVol * 14) * Math.sin(t * Math.PI);

          if (j === 0) {
            ctx.moveTo(wx, wy);
          } else {
            ctx.lineTo(wx, wy);
          }
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [avatarState, activeModel, audioVolume, frequencyData]);

  const normalizedVolPct = Math.round((Math.max(0, Math.min(255, audioVolume)) / 255) * 100);
  const isSpeaking = avatarState === 'speaking';
  const isListening = avatarState === 'listening';

  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
      {/* Telemetry Status Pill */}
      <div className="pointer-events-auto flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-slate-800 text-[10px] font-mono shadow-xl transition-all">
        <div className="flex items-center gap-1.5">
          <Activity
            className="w-3.5 h-3.5 transition-colors"
            style={{ color: isSpeaking || isListening ? activeModel.accentColor : '#64748b' }}
          />
          <span className="font-bold tracking-wider text-slate-300">
            {isSpeaking
              ? 'LIP-SYNC EQUALIZER'
              : isListening
              ? 'USER AUDIO CAPTURE'
              : 'AUDIO STANDBY'}
          </span>
        </div>

        <span className="text-slate-600">|</span>

        {/* Level Percentage & Decibel simulation */}
        <div className="flex items-center gap-1.5">
          <Volume2 className="w-3 h-3 text-slate-400" />
          <span
            className="font-semibold transition-colors"
            style={{ color: isSpeaking ? activeModel.accentColor : '#94a3b8' }}
          >
            {normalizedVolPct}%
          </span>
          <span className="text-slate-500 text-[9px]">
            ({isSpeaking ? `-${Math.max(2, 60 - Math.round(normalizedVolPct * 0.58))} dB` : 'SILENT'})
          </span>
        </div>

        {/* Frequency Band Badge */}
        {isSpeaking && (
          <>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400">
              <Zap className="w-3 h-3" />
              <span>PHONEMES ACTIVE</span>
            </div>
          </>
        )}
      </div>

      {/* Real-time Oscilloscope & Symmetrical Equalizer Canvas */}
      <div className="relative mt-1">
        <canvas
          ref={canvasRef}
          width={420}
          height={75}
          className="w-[360px] sm:w-[420px] h-[75px] block pointer-events-none"
        />

        {/* Subtle Horizontal Baseline Glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[24px] h-[1px] w-[260px] transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${activeModel.accentColor}, transparent)`,
            opacity: isSpeaking ? 0.75 : isListening ? 0.45 : 0.15,
          }}
        />
      </div>
    </div>
  );
};
