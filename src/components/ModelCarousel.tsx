import React, { useRef, useState } from 'react';
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code,
  Compass,
  FileEdit,
  Microscope,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AIModel, AIModelId } from '../types';

interface ModelCarouselProps {
  models: AIModel[];
  activeModelId: AIModelId;
  onSelectModel: (id: AIModelId) => void;
  isControlsCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ModelCarousel: React.FC<ModelCarouselProps> = ({
  models,
  activeModelId,
  onSelectModel,
  isControlsCollapsed,
  onToggleCollapse,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 260;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getModelIcon = (id: AIModelId) => {
    switch (id) {
      case 'non-stop':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'executive':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'coder':
        return <Code className="w-4 h-4 text-emerald-400" />;
      case 'architect':
        return <Compass className="w-4 h-4 text-blue-400" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'researcher':
        return <Microscope className="w-4 h-4 text-purple-400" />;
      case 'writer':
        return <FileEdit className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-5xl pointer-events-none transition-all duration-300">
      {/* Collapse / Expand Tab (Three.js bottom dock guidance) */}
      <div className="flex justify-center mb-2 pointer-events-auto">
        <button
          onClick={onToggleCollapse}
          className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-semibold text-slate-400 hover:text-white shadow-lg backdrop-blur-sm transition-all"
        >
          {isControlsCollapsed ? '▲ Show Specialist Team' : '▼ Hide Specialist Team'}
        </button>
      </div>

      {!isControlsCollapsed && (
        <div className="pointer-events-auto p-3.5 rounded-2xl bg-slate-950/85 border border-slate-800/80 shadow-2xl backdrop-blur-md">
          {/* Header Row */}
          <div className="flex items-center justify-between px-2 mb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                A.I.D.A Specialist Team
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                (7 Specialized AI Modes)
              </span>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScroll('left')}
                aria-label="Scroll left"
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                aria-label="Scroll right"
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Model Cards */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex items-stretch gap-3 overflow-x-auto pb-1 no-scrollbar cursor-grab active:cursor-grabbing select-none"
          >
            {models.map((model) => {
              const isActive = model.id === activeModelId;

              return (
                <div
                  key={model.id}
                  onClick={() => onSelectModel(model.id)}
                  className={`flex-shrink-0 w-60 p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-slate-900/95 shadow-xl scale-[1.02]'
                      : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
                  }`}
                  style={{
                    borderColor: isActive ? model.accentColor : undefined,
                    boxShadow: isActive ? `0 8px 24px ${model.accentGlow}` : undefined,
                  }}
                >
                  {/* Active Indicator Top Tag */}
                  {isActive && (
                    <div
                      className="absolute top-0 right-0 px-2 py-0.5 text-[9px] font-bold uppercase rounded-bl-lg tracking-wider"
                      style={{
                        backgroundColor: model.accentColor,
                        color: '#070b14',
                      }}
                    >
                      Active
                    </div>
                  )}

                  {/* Header: Icon + Name */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg border shadow-sm"
                      style={{
                        backgroundColor: `${model.accentColor}15`,
                        borderColor: `${model.accentColor}40`,
                      }}
                    >
                      {getModelIcon(model.id)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        {model.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate max-w-[130px]">
                        {model.role}
                      </p>
                    </div>
                  </div>

                  {/* Short Introduction */}
                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 mb-2.5">
                    {model.shortIntro}
                  </p>

                  {/* Specialization Tags */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 truncate max-w-[150px]">
                      {model.specialization}
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: model.accentColor }}
                    >
                      Ready
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
