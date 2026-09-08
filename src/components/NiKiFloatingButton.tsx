import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, MessageSquare } from 'lucide-react';

interface NiKiFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
  activeTopic?: string;
}

export const NiKiFloatingButton: React.FC<NiKiFloatingButtonProps> = ({
  onClick,
  isOpen,
  activeTopic
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Show a subtle welcoming tooltip briefly on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (isOpen) return null;

  return (
    <div className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-auto">
      {/* Interactive Tooltip Callout */}
      {showTooltip && (
        <div className="mb-2 mr-1 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-cyan-500/50 text-slate-200 text-xs shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-2 max-w-[240px]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="leading-tight">
            <span className="text-cyan-300 font-bold block">Need Help?</span>
            <span className="text-[11px] text-slate-400">Ask Eunchae anything about {activeTopic || 'your interview'}!</span>
          </div>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-slate-500 hover:text-slate-300 ml-auto text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Floating Eunchae Button */}
      <button
        type="button"
        onClick={() => {
          setShowTooltip(false);
          onClick();
        }}
        className="group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-cyan-950/80 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-cyan-400/40"
        title="Open Eunchae - Your Interview Prep Companion"
        aria-label="Open Eunchae AI Assistant"
      >
        {/* Pulsing halo */}
        <span className="absolute -inset-0.5 rounded-full bg-cyan-400/30 blur-sm group-hover:bg-cyan-400/50 animate-pulse" />

        <div className="relative flex items-center justify-center">
          <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950" />
        </div>

        <span className="relative font-bold font-['Plus_Jakarta_Sans'] tracking-wide">
          Eunchae ✦
        </span>

        {/* Small subtitle on wider viewports */}
        <span className="hidden md:inline-block relative text-[11px] font-normal text-cyan-200/80 pl-1 border-l border-white/20">
          AI Coach
        </span>
      </button>
    </div>
  );
};
