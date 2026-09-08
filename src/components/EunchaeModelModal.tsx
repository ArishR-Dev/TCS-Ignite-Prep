import React, { useEffect } from 'react';
import { X, Sparkles, ExternalLink, Bot, Check, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { EunchaeLogo } from './EunchaeLogo';

interface EunchaeModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGoogleAI: () => void;
  onSelectChatGPT: () => void;
}

export const CHATGPT_EUNCHAE_URL = 'https://chatgpt.com/g/g-6a9ffbc4796081919b9f14a3e7f2f39b-eunchae';

export const EunchaeModelModal: React.FC<EunchaeModelModalProps> = ({
  isOpen,
  onClose,
  onSelectGoogleAI,
  onSelectChatGPT
}) => {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="model-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0b1120] border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl shadow-cyan-950/80 text-white animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Glowing top ambient line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <EunchaeLogo size={44} showSparkle={true} glow={true} alt="Eunchae AI" />
            <div>
              <div className="flex items-center gap-2">
                <h2 id="model-modal-title" className="text-lg sm:text-xl font-bold font-['Plus_Jakarta_Sans'] text-white">
                  Select Eunchae Model
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                  AI Companion
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Choose your preferred AI platform for TCS Ignite interview preparation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close model selector"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Two Model Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Built using Google AI */}
          <div
            onClick={onSelectGoogleAI}
            className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-slate-900/90 border-2 border-cyan-500/50 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/20 transition-all cursor-pointer text-left active:scale-[0.99]"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>RECOMMENDED • IN-APP</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400/80 font-bold">1</span>
            </div>

            {/* Model Title & Tagline */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 flex items-center justify-center border border-cyan-700/60 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Cpu className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                    Built using Google AI
                  </h3>
                  <span className="text-[11px] text-cyan-400/90 font-mono">Google Gemini 3.1 Flash</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Embedded interactive companion with dynamic screen awareness, full TCS syllabus RAG, and live web research.
              </p>
            </div>

            {/* Features List */}
            <ul className="space-y-1.5 text-[11px] text-slate-300 mb-5 pl-0.5">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong>Screen-Aware:</strong> Reads active slides & diagrams</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong>70+ Slides RAG:</strong> OOP, DBMS, SQL, HR checklist</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong>Web Research:</strong> Live TCS website search & citations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong>Interactive Drills:</strong> Instant Quiz & Mock interview mode</span>
              </li>
            </ul>

            {/* CTA Button */}
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-950/80 group-hover:shadow-cyan-500/30 transition-all cursor-pointer pointer-events-none"
            >
              <span>Launch Google AI Companion</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Option 2: ChatGPT's GPT */}
          <div
            onClick={onSelectChatGPT}
            className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-b from-emerald-950/30 via-slate-900/90 to-slate-900/90 border-2 border-emerald-600/40 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20 transition-all cursor-pointer text-left active:scale-[0.99]"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                <Bot className="w-3 h-3 text-emerald-400" />
                <span>CUSTOM GPT • OPENAI</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80 font-bold">2</span>
            </div>

            {/* Model Title & Tagline */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center border border-emerald-700/60 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Bot className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                    ChatGPT's GPT
                  </h3>
                  <span className="text-[11px] text-emerald-400/90 font-mono">OpenAI Custom GPT Platform</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                The official Eunchae Custom GPT tailored for TCS Ignite interview training directly inside your ChatGPT workspace.
              </p>
            </div>

            {/* Features List */}
            <ul className="space-y-1.5 text-[11px] text-slate-300 mb-5 pl-0.5">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Specialized Instructions:</strong> TCS Ignite preparation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Voice & Mobile:</strong> Use on ChatGPT app with voice chat</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Extended History:</strong> Syncs with your ChatGPT account</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>External Link:</strong> Opens dedicated GPT in a new tab</span>
              </li>
            </ul>

            {/* CTA Button */}
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/80 group-hover:shadow-emerald-500/30 transition-all cursor-pointer pointer-events-none"
            >
              <span>Open in ChatGPT</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Both models are fine-tuned for TCS Ignite interview excellence.</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            You can switch models anytime in the chat header
          </span>
        </div>
      </div>
    </div>
  );
};
