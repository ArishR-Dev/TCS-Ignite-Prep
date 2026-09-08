import React, { useState, useEffect, useRef } from 'react';
import { Slide } from '../types';
import { SECTIONS } from '../data/allSlides';
import {
  Compass,
  X,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Sliders,
  Check,
  Lock
} from 'lucide-react';

interface QuickJumpModalProps {
  slides: Slide[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectSlide: (index: number) => void;
  bookmarkedSlideIds?: string[];
  isDocsCompleted?: boolean;
  onAttemptBlockedSlide?: () => void;
}

export const QuickJumpModal: React.FC<QuickJumpModalProps> = ({
  slides,
  currentIndex,
  isOpen,
  onClose,
  onSelectSlide,
  bookmarkedSlideIds = [],
  isDocsCompleted = true,
  onAttemptBlockedSlide
}) => {
  const [inputSlideNumber, setInputSlideNumber] = useState<string>('');
  const [sliderValue, setSliderValue] = useState<number>(currentIndex + 1);
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Directly derive locked status for any slide from the global isDocsCompleted flag
  const isSlideLocked = (targetIdx: number): boolean => !isDocsCompleted && targetIdx > 1;

  useEffect(() => {
    if (isOpen) {
      setInputSlideNumber(String(currentIndex + 1));
      setSliderValue(currentIndex + 1);
      setErrorMsg(null);
      // Auto-expand the section of the current slide
      const currentSectionId = slides[currentIndex]?.sectionId;
      setExpandedSectionId(currentSectionId || null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, currentIndex, slides]);

  if (!isOpen) return null;

  const handleSelectWithGate = (targetIdx: number) => {
    if (isSlideLocked(targetIdx)) {
      setErrorMsg('Please complete Slide #2 (Mandatory Documents Checklist) to unlock all slides.');
      onAttemptBlockedSlide?.();
      return;
    }
    setErrorMsg(null);
    onSelectSlide(targetIdx);
    onClose();
  };

  // Handle direct number jump
  const handleJumpToNumber = (numStr?: string) => {
    const valToUse = numStr !== undefined ? numStr : inputSlideNumber;
    const parsed = parseInt(valToUse.trim(), 10);
    if (isNaN(parsed) || parsed < 1 || parsed > slides.length) {
      setErrorMsg(`Please enter a slide number between 1 and ${slides.length}`);
      return;
    }
    handleSelectWithGate(parsed - 1);
  };

  // Preview target slide when dragging slider
  const previewIndex = Math.max(0, Math.min(slides.length - 1, sliderValue - 1));
  const previewSlide = slides[previewIndex];
  const isPreviewLocked = isSlideLocked(sliderValue - 1);

  // Quick milestone markers
  const milestones = [
    { num: 1, label: 'Cover', icon: '🎯' },
    { num: 2, label: 'Docs Checklist', icon: '📋' },
    { num: 3, label: 'Agenda & Rounds', icon: '📅' },
    { num: 8, label: 'OOP & Python', icon: '🐍' },
    { num: 23, label: 'Basic SQL', icon: '🗄️' },
    { num: 30, label: 'SQL JOINs', icon: '🔗' },
    { num: 43, label: 'Commands & DDL', icon: '⚡' },
    { num: 48, label: 'Coding & DSA', icon: '💻' },
    { num: 68, label: 'HR Round', icon: '💼' },
    { num: 73, label: 'Final Wish', icon: '✨' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-200 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      {/* Click-away backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg bg-[#0b0f19] border border-slate-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        
        {/* Mobile Pull Bar Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-700 rounded-full mx-auto mt-2.5 mb-1" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800 bg-[#0e1424]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
                Quick Jump to Slide
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono">
                Currently on Slide <span className="text-cyan-400 font-bold">{currentIndex + 1}</span> of {slides.length}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="overflow-y-auto p-4 space-y-4 divide-y divide-slate-800/60">

          {/* 1. Direct Slide Number Input Box */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Go to Specific Slide</span>
              <span className="text-cyan-400 text-[10px]">Range: 1 – {slides.length}</span>
            </label>

            <form
              onSubmit={e => {
                e.preventDefault();
                handleJumpToNumber();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="number"
                  min={1}
                  max={slides.length}
                  value={inputSlideNumber}
                  onChange={e => {
                    setInputSlideNumber(e.target.value);
                    setErrorMsg(null);
                    const n = parseInt(e.target.value, 10);
                    if (!isNaN(n) && n >= 1 && n <= slides.length) {
                      setSliderValue(n);
                    }
                  }}
                  placeholder="e.g. 42"
                  className="w-full pl-3.5 pr-14 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 min-h-[44px]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                  / {slides.length}
                </span>
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-950 min-h-[44px] cursor-pointer"
              >
                <span>JUMP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {errorMsg && (
              <p className="text-[11px] text-rose-400 font-mono mt-1 animate-in fade-in">
                {errorMsg}
              </p>
            )}
          </div>

          {/* 2. Interactive Slide Scrubber / Drag Slider */}
          <div className="pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Drag to Browse Slides</span>
              </span>
              <span className="font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                #{sliderValue}
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={slides.length}
              value={sliderValue}
              onChange={e => {
                const val = Number(e.target.value);
                setSliderValue(val);
                setInputSlideNumber(String(val));
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 touch-pan-x"
            />

            {/* Live Slider Card Preview */}
            {previewSlide && (
              <div
                onClick={() => {
                  handleSelectWithGate(sliderValue - 1);
                }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 group active:scale-[0.99] ${
                  isPreviewLocked
                    ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-75'
                    : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-mono text-[10px] font-bold text-cyan-400">
                      Slide {sliderValue}
                    </span>
                    <span className="text-[9px] uppercase font-mono text-slate-400 bg-slate-800 px-1 py-0.2 rounded">
                      {previewSlide.sectionId}
                    </span>
                    {isPreviewLocked ? (
                      <span className="text-amber-400 text-[10px] font-mono flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    ) : bookmarkedSlideIds.includes(previewSlide.id) ? (
                      <span className="text-amber-400 text-[10px]">★ Bookmarked</span>
                    ) : null}
                  </div>
                  <p className={`text-xs font-semibold truncate transition-colors ${
                    isPreviewLocked ? 'text-slate-400' : 'text-white group-hover:text-cyan-300'
                  }`}>
                    {previewSlide.slideTitle}
                  </p>
                </div>
                <button
                  type="button"
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-colors flex items-center gap-1 flex-shrink-0 ${
                    isPreviewLocked
                      ? 'bg-slate-800 text-amber-400 border border-slate-700'
                      : 'bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950'
                  }`}
                >
                  {isPreviewLocked ? (
                    <>
                      <Lock className="w-3 h-3" /> Locked
                    </>
                  ) : (
                    <>
                      Open <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 3. Section Milestone Quick Jumps */}
          <div className="pt-3 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono block">
              Direct Topic Milestones
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {milestones.map(m => {
                const targetIdx = m.num - 1;
                const isLocked = isSlideLocked(targetIdx);
                const isActive = currentIndex + 1 === m.num;
                return (
                  <button
                    key={m.num}
                    type="button"
                    onClick={() => {
                      handleSelectWithGate(targetIdx);
                    }}
                    className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between min-h-[50px] cursor-pointer ${
                      isLocked
                        ? 'bg-slate-950/60 border-slate-800/80 opacity-60 hover:border-slate-700'
                        : isActive
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-950'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">#{m.num}</span>
                      <span className="text-xs">{isLocked ? '🔒' : m.icon}</span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-200 truncate w-full mt-1">
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Complete Section Accordions & Slide List */}
          <div className="pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Browse by Section ({SECTIONS.length})
              </span>
              <span className="text-[10px] text-slate-500">Tap to expand</span>
            </div>

            <div className="space-y-1.5">
              {SECTIONS.map(sec => {
                const secSlides = slides.filter(s => s.sectionId === sec.id);
                if (secSlides.length === 0) return null;
                const firstSlideIndex = slides.findIndex(s => s.id === secSlides[0].id);
                const lastSlideIndex = firstSlideIndex + secSlides.length - 1;
                const isCurrentSec = slides[currentIndex]?.sectionId === sec.id;
                const isExpanded = expandedSectionId === sec.id;
                const isFirstSlideLocked = isSlideLocked(firstSlideIndex);

                return (
                  <div
                    key={sec.id}
                    className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/40"
                  >
                    {/* Section Header Row */}
                    <div className="flex items-center justify-between p-2.5 gap-2 hover:bg-slate-850/60 transition-colors">
                      <button
                        type="button"
                        onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                        className="flex-1 flex items-center gap-2 text-left min-w-0"
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                          isCurrentSec ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {sec.number}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white truncate">
                            {sec.title}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">
                            Slides {firstSlideIndex + 1}–{lastSlideIndex + 1} • {secSlides.length} slides
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleSelectWithGate(firstSlideIndex);
                        }}
                        className={`px-2 py-1 rounded-md border text-[10px] font-mono font-bold whitespace-nowrap flex-shrink-0 transition-colors ${
                          isFirstSlideLocked
                            ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800'
                            : 'bg-cyan-950/80 hover:bg-cyan-900 border-cyan-800/60 text-cyan-300'
                        }`}
                        title="Jump to first slide of section"
                      >
                        {isFirstSlideLocked ? 'Locked' : `Start #${firstSlideIndex + 1}`}
                      </button>
                    </div>

                    {/* Expanded Slide List */}
                    {isExpanded && (
                      <div className="bg-slate-950/70 border-t border-slate-800/60 p-2 space-y-1 max-h-48 overflow-y-auto">
                        {secSlides.map(s => {
                          const sIdx = slides.findIndex(item => item.id === s.id);
                          const isCurrent = sIdx === currentIndex;
                          const isBookmarked = bookmarkedSlideIds.includes(s.id);
                          const isLocked = isSlideLocked(sIdx);

                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                handleSelectWithGate(sIdx);
                              }}
                              className={`w-full p-1.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between gap-2 ${
                                isLocked
                                  ? 'opacity-50 hover:bg-slate-900/50 text-slate-400'
                                  : isCurrent
                                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-600/40 font-semibold'
                                  : 'hover:bg-slate-850 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono text-[10px] text-cyan-400 font-bold flex-shrink-0">
                                  #{s.slideNumber}
                                </span>
                                <span className="truncate">{s.slideTitle}</span>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0">
                                {isLocked ? (
                                  <Lock className="w-3 h-3 text-amber-400" />
                                ) : (
                                  <>
                                    {isBookmarked && (
                                      <span className="text-amber-400 text-[10px]">★</span>
                                    )}
                                    {isCurrent && (
                                      <Check className="w-3 h-3 text-cyan-400" />
                                    )}
                                  </>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#0e1424] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onSelectSlide(0);
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium transition-colors"
          >
            ⇤ Slide 1
          </button>

          <span className="text-[10px] font-mono text-slate-500">
            Tip: Press <kbd className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded">J</kbd> to jump
          </span>

          <button
            type="button"
            onClick={() => {
              handleSelectWithGate(slides.length - 1);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium transition-colors"
          >
            Slide {slides.length} ⇥
          </button>
        </div>

      </div>
    </div>
  );
};

