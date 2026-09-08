import React, { useState, useEffect } from 'react';
import { Slide } from '../types';
import { SECTIONS } from '../data/allSlides';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Grid,
  Search,
  Download,
  Play,
  Pause,
  Timer,
  BookOpen,
  Bookmark,
  Compass,
  Hash,
  Sparkles
} from 'lucide-react';
import { EunchaeLogo } from './EunchaeLogo';

interface PresentationControlsProps {
  slides: Slide[];
  currentIndex: number;
  onSelectSlide: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenGrid: () => void;
  onOpenSearch: () => void;
  onOpenExport: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  bookmarkedSlideIds?: string[];
  onToggleBookmark?: (slideId: string) => void;
  onOpenBookmarks?: () => void;
  onOpenQuickJump?: () => void;
  onOpenNiKi?: () => void;
}

export const PresentationControls: React.FC<PresentationControlsProps> = ({
  slides,
  currentIndex,
  onSelectSlide,
  onNext,
  onPrev,
  onOpenGrid,
  onOpenSearch,
  onOpenExport,
  isFullscreen,
  onToggleFullscreen,
  bookmarkedSlideIds = [],
  onToggleBookmark,
  onOpenBookmarks,
  onOpenQuickJump,
  onOpenNiKi
}) => {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25);
  const [remainingTime, setRemainingTime] = useState(25);

  const currentSlide = slides[currentIndex];
  const progressPercent = ((currentIndex + 1) / slides.length) * 100;

  // Auto-play interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            onNext();
            return timerSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setRemainingTime(timerSeconds);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, timerSeconds, currentIndex, onNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        onToggleBookmark?.(currentSlide.id);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        onToggleFullscreen();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        onOpenGrid();
      } else if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        onOpenQuickJump?.();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onOpenNiKi?.();
      } else if (e.key === '/') {
        e.preventDefault();
        onOpenSearch();
      } else if (e.key === 'Home') {
        e.preventDefault();
        onSelectSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        onSelectSlide(slides.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onToggleFullscreen, onOpenGrid, onOpenSearch, onSelectSlide, slides.length, onToggleBookmark, currentSlide.id]);

  const isCurrentBookmarked = bookmarkedSlideIds.includes(currentSlide.id);

  return (
    <>
      {/* Top Header Controls Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Subashini Header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold font-mono text-sm shadow-md shadow-cyan-900/30">
              TI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm tracking-tight font-['Plus_Jakarta_Sans']">
                  TCS B.Sc Ignite
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-[10px] font-mono uppercase">
                  Handbook
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Prepared for <span className="text-cyan-400 font-semibold">SUBASHINI</span> • by ARISH
              </p>
            </div>
          </div>

          {/* Center Quick Section Jump Dropdown */}
          <div className="hidden md:flex items-center gap-1.5">
            <select
              value={currentSlide.sectionId}
              onChange={e => {
                const targetSec = e.target.value;
                const targetIndex = slides.findIndex(s => s.sectionId === targetSec);
                if (targetIndex !== -1) onSelectSlide(targetIndex);
              }}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              {SECTIONS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.number} • {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick My Bookmarks Button */}
            <button
              onClick={onOpenBookmarks}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors min-h-[38px] min-w-[38px] sm:min-h-auto sm:min-w-auto justify-center ${
                bookmarkedSlideIds.length > 0
                  ? 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border-amber-600/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              }`}
              title="My Bookmarks (B)"
            >
              <Bookmark className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${bookmarkedSlideIds.length > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Bookmarks</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                bookmarkedSlideIds.length > 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}>
                {bookmarkedSlideIds.length}
              </span>
            </button>

            <button
              onClick={onOpenSearch}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 border border-slate-700 transition-colors min-h-[38px] min-w-[38px] sm:min-h-auto sm:min-w-auto justify-center"
              title="Search slides (/)"
            >
              <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline font-mono text-[10px] text-slate-500 bg-slate-900 px-1 py-0.2 rounded">/</kbd>
            </button>

            {onOpenQuickJump && (
              <button
                onClick={onOpenQuickJump}
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 hover:text-white text-xs flex items-center gap-1.5 border border-cyan-800/60 transition-colors min-h-[38px] min-w-[38px] sm:min-h-auto sm:min-w-auto justify-center"
                title="Quick Jump to Slide (J)"
              >
                <Compass className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Jump</span>
                <kbd className="hidden lg:inline font-mono text-[10px] text-slate-500 bg-slate-900 px-1 py-0.2 rounded">J</kbd>
              </button>
            )}

            <button
              onClick={onOpenGrid}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 border border-slate-700 transition-colors min-h-[38px] min-w-[38px] sm:min-h-auto sm:min-w-auto justify-center"
              title="All slides grid (G)"
            >
              <Grid className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Slides (73)</span>
              <kbd className="hidden lg:inline font-mono text-[10px] text-slate-500 bg-slate-900 px-1 py-0.2 rounded">G</kbd>
            </button>

            <button
              onClick={onOpenExport}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 hover:text-white text-xs flex items-center gap-1.5 border border-cyan-700/60 transition-colors min-h-[38px] min-w-[38px] sm:min-h-auto sm:min-w-auto justify-center"
              title="Download PowerPoint (.pptx)"
            >
              <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={onToggleFullscreen}
              className="p-2 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors min-h-[38px] min-w-[38px] sm:min-h-auto sm:min-w-auto flex items-center justify-center"
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile-Friendly Quick Section Strip */}
        <div className="flex md:hidden items-center gap-1.5 pt-2 pb-1 overflow-x-auto no-scrollbar touch-pan-x">
          {SECTIONS.map(s => {
            const isCurrentSection = currentSlide.sectionId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  const targetIndex = slides.findIndex(slide => slide.sectionId === s.id);
                  if (targetIndex !== -1) onSelectSlide(targetIndex);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all ${
                  isCurrentSection
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:bg-slate-800'
                }`}
              >
                {s.number}. {s.title.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Mobile Progress Readout Bar - Interactive Quick Jump Trigger */}
        <button
          onClick={onOpenQuickJump || onOpenGrid}
          className="flex md:hidden items-center justify-between pt-1.5 pb-1 text-[11px] font-mono w-full text-left active:opacity-85 transition-opacity cursor-pointer group"
          title="Tap to jump to any slide (J)"
        >
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400 group-hover:rotate-45 transition-transform" />
              Slide {currentIndex + 1}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{slides.length}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 truncate max-w-[120px]">{currentSlide.sectionTitle.split(' ')[0]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40 flex items-center gap-0.5">
              <span>Jump</span>
              <span className="text-cyan-400">↗</span>
            </span>
            <span className="text-cyan-400 font-bold">{Math.round(progressPercent)}%</span>
          </div>
        </button>

        {/* Visual Progress Line (Prominent Gradient on Mobile and Desktop) */}
        <div className="w-full h-1.5 sm:h-1 bg-slate-800/90 mt-0.5 sm:mt-2 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Floating Bottom Presentation Bar - Mobile Thumb Optimized */}
      <footer className="fixed bottom-2 sm:bottom-3 inset-x-0 z-40 px-2 sm:px-4 pointer-events-none pb-[env(safe-area-inset-bottom)]">
        <div className="relative max-w-3xl mx-auto bg-slate-900/95 backdrop-blur-lg border border-slate-700/80 rounded-2xl px-2.5 sm:px-4 py-2 sm:py-2.5 shadow-2xl shadow-black/90 flex items-center justify-between gap-2 sm:gap-3 pointer-events-auto overflow-hidden">
          {/* Mobile Bottom Bar Integrated Progress Track */}
          <div className="sm:hidden absolute top-0 inset-x-0 h-[2.5px] bg-slate-800/90">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-sky-400 transition-all duration-300 ease-out shadow-[0_0_6px_rgba(6,182,212,0.9)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Previous Slide - 44px min touch target */}
          <button
            onClick={onPrev}
            disabled={currentIndex <= 0}
            className="flex items-center justify-center gap-1 px-3 sm:px-3.5 py-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-200 transition-colors cursor-pointer min-h-[44px] min-w-[54px] sm:min-h-auto"
            title="Previous (Left Arrow or Swipe Right)"
          >
            <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Center Indicator & Slide Dropdown / Tap for Grid on Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Desktop dropdown */}
            <select
              value={currentIndex}
              onChange={e => onSelectSlide(Number(e.target.value))}
              className="hidden sm:inline-block bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-400 max-w-[240px]"
            >
              {slides.map((s, idx) => (
                <option key={s.id} value={idx}>
                  Slide {s.slideNumber}: {s.slideTitle.slice(0, 26)}...
                </option>
              ))}
            </select>

            {/* Mobile compact slide badge with progress % - Opens Quick Jump */}
            <button
              onClick={onOpenQuickJump || onOpenGrid}
              className="sm:hidden px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center gap-1 min-h-[38px] active:scale-95 transition-transform"
              title="Quick Jump to Slide (J)"
            >
              <span className="font-bold">{currentIndex + 1}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">{slides.length}</span>
              <span className="text-[10px] text-cyan-300/80 bg-cyan-950/80 px-1 py-0.2 rounded border border-cyan-800/40">
                {Math.round(progressPercent)}%
              </span>
            </button>

            {/* Dedicated Eunchae AI Assistant Button with Official Logo (in place of 'Go to') */}
            {onOpenNiKi && (
              <button
                type="button"
                id="eunchae-activation-button"
                onClick={onOpenNiKi}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 hover:from-cyan-900 hover:to-indigo-900 border border-cyan-500/60 hover:border-cyan-400 text-cyan-200 hover:text-white text-xs font-semibold flex items-center gap-2 min-h-[38px] cursor-pointer active:scale-95 transition-all shadow-md shadow-cyan-950/80 group"
                title="Open Eunchae - Your AI Interview Prep Companion (N)"
                aria-label="Open Eunchae AI Assistant"
              >
                <EunchaeLogo size={24} showSparkle={true} glow={true} alt="Eunchae AI Assistant" />
                <span className="font-bold font-['Plus_Jakarta_Sans'] text-white group-hover:text-cyan-200 transition-colors text-[11px] sm:text-xs whitespace-nowrap flex items-center gap-1">
                  Eunchae <span className="text-cyan-400">✦</span>
                </span>
              </button>
            )}

            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              of {slides.length}
            </span>

            {/* Timer / Autoplay button */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`p-2 sm:p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 font-mono min-h-[38px] sm:min-h-auto ${
                isAutoPlaying
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title={isAutoPlaying ? 'Pause Timer' : 'Start Auto-timer'}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px]">{remainingTime}s</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden md:inline">Auto</span>
                </>
              )}
            </button>

            {/* Bookmark Current Slide Toggle */}
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(currentSlide.id)}
                className={`p-2 sm:p-1.5 rounded-lg border text-xs transition-colors flex items-center justify-center min-h-[38px] min-w-[38px] sm:min-h-auto sm:min-w-auto ${
                  isCurrentBookmarked
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title={
                  isCurrentBookmarked
                    ? 'Bookmarked (Click to unpin or press B)'
                    : 'Pin to My Bookmarks (Press B)'
                }
              >
                <Bookmark className={`w-3.5 h-3.5 ${isCurrentBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
            )}
          </div>

          {/* Next Slide - 44px min touch target */}
          <button
            onClick={onNext}
            disabled={currentIndex >= slides.length - 1}
            className="flex items-center justify-center gap-1 px-3 sm:px-3.5 py-2.5 sm:py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-xs font-semibold text-white shadow-md shadow-cyan-900/30 transition-colors cursor-pointer min-h-[44px] min-w-[54px] sm:min-h-auto"
            title="Next (Right Arrow or Swipe Left)"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
        </div>
      </footer>
    </>
  );
};
