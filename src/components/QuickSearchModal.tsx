import React, { useState, useEffect, useRef } from 'react';
import { Slide } from '../types';
import { Search, X, ArrowRight, Lock } from 'lucide-react';

interface QuickSearchModalProps {
  slides: Slide[];
  isOpen: boolean;
  onClose: () => void;
  onSelectSlide: (index: number) => void;
  isDocsCompleted?: boolean;
  onAttemptBlockedSlide?: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  slides,
  isOpen,
  onClose,
  onSelectSlide,
  isDocsCompleted = true,
  onAttemptBlockedSlide
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim() === '' ? [] : slides.filter(slide => {
    const q = query.toLowerCase();
    const inTitle = slide.slideTitle.toLowerCase().includes(q);
    const inSubtitle = slide.slideSubtitle?.toLowerCase().includes(q);
    const inSection = slide.sectionTitle.toLowerCase().includes(q);
    const inTags = slide.tags?.some(t => t.toLowerCase().includes(q));
    const inParagraphs = slide.content.paragraphs?.some(p => p.toLowerCase().includes(q));
    const inCode = slide.content.codeBlocks?.some(cb => cb.code.toLowerCase().includes(q));
    const inCallouts = slide.content.callouts?.some(c => c.content.toLowerCase().includes(q) || c.label.toLowerCase().includes(q));

    return inTitle || inSubtitle || inSection || inTags || inParagraphs || inCode || inCallouts;
  }).slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:pt-20 animate-in fade-in duration-150 pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-2xl bg-[#0d1322] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[min(85dvh,85vh)] min-w-0">
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 sm:px-4 py-3 sm:py-3.5 border-b border-slate-800 gap-2.5 sm:gap-3">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search anything (e.g. Kadane, Polymorphism, salary, 1NF)..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none min-h-[40px]"
            onKeyDown={e => {
              if (e.key === 'Escape') onClose();
            }}
          />
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-2 divide-y divide-slate-800/40">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Type to search across Subashini's full interview handbook (73 slides).
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No matching slides found for "<span className="text-slate-300">{query}</span>".
            </div>
          ) : (
            results.map(slide => {
              const slideIndex = slides.findIndex(s => s.id === slide.id);
              const isLocked = !isDocsCompleted && slideIndex > 1;

              return (
                <div
                  key={slide.id}
                  onClick={() => {
                    if (isLocked) {
                      onAttemptBlockedSlide?.();
                      return;
                    }
                    onSelectSlide(slideIndex);
                    onClose();
                  }}
                  className={`pt-2 first:pt-0 p-3 rounded-xl transition-colors group flex items-center justify-between gap-4 ${
                    isLocked
                      ? 'opacity-50 hover:bg-slate-900/40 cursor-not-allowed'
                      : 'hover:bg-slate-800/60 cursor-pointer'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        Slide #{slide.slideNumber}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {slide.sectionTitle}
                      </span>
                      {isLocked && (
                        <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/50">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      )}
                    </div>
                    <h4 className={`text-sm font-semibold transition-colors ${
                      isLocked ? 'text-slate-400' : 'text-white group-hover:text-cyan-300'
                    }`}>
                      {slide.slideTitle}
                    </h4>
                    {slide.slideSubtitle && (
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {slide.slideSubtitle}
                      </p>
                    )}
                  </div>
                  {isLocked ? (
                    <span className="text-xs text-amber-400/80 font-mono text-[11px] flex items-center gap-1 flex-shrink-0">
                      <Lock className="w-3.5 h-3.5" /> Verify Slide #2
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">Esc</kbd> to exit</span>
          <span>{results.length} results shown</span>
        </div>
      </div>
    </div>
  );
};
