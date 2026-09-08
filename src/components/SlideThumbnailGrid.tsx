import React, { useState, useMemo, useEffect } from 'react';
import { Slide, SectionId } from '../types';
import { SECTIONS } from '../data/allSlides';
import { Layers, Search, Sparkles, Terminal, Database, Bookmark, BookmarkCheck, ArrowRight, Lock, AlertCircle } from 'lucide-react';

interface SlideThumbnailGridProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onClose: () => void;
  bookmarkedSlideIds: string[];
  onToggleBookmark: (slideId: string) => void;
  initialTab?: SectionId | 'all' | 'bookmarks';
  isDocsCompleted?: boolean;
  onAttemptBlockedSlide?: () => void;
}

export const SlideThumbnailGrid: React.FC<SlideThumbnailGridProps> = ({
  slides,
  currentSlideIndex,
  onSelectSlide,
  onClose,
  bookmarkedSlideIds,
  onToggleBookmark,
  initialTab = 'all',
  isDocsCompleted = true,
  onAttemptBlockedSlide
}) => {
  const [selectedSection, setSelectedSection] = useState<SectionId | 'all' | 'bookmarks'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredSlides = useMemo(() => {
    return slides.filter(slide => {
      let matchesSection = false;
      if (selectedSection === 'all') {
        matchesSection = true;
      } else if (selectedSection === 'bookmarks') {
        matchesSection = bookmarkedSlideIds.includes(slide.id);
      } else {
        matchesSection = slide.sectionId === selectedSection;
      }

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesSection;

      const matchesQuery =
        slide.slideTitle.toLowerCase().includes(q) ||
        (slide.slideSubtitle && slide.slideSubtitle.toLowerCase().includes(q)) ||
        slide.sectionTitle.toLowerCase().includes(q) ||
        (slide.tags && slide.tags.some(t => t.toLowerCase().includes(q))) ||
        (slide.content.paragraphs && slide.content.paragraphs.some(p => p.toLowerCase().includes(q))) ||
        (slide.content.codeBlocks && slide.content.codeBlocks.some(cb => cb.code.toLowerCase().includes(q)));

      return matchesSection && matchesQuery;
    });
  }, [slides, selectedSection, searchQuery, bookmarkedSlideIds]);

  const bookmarkCount = bookmarkedSlideIds.length;

  return (
    <div className="fixed inset-0 z-50 bg-[#070a12]/95 backdrop-blur-md flex flex-col p-2.5 sm:p-6 lg:p-8 animate-in fade-in duration-200 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      {/* Header & Controls */}
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4 pb-3 sm:pb-6 border-b border-slate-800">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <h2 className="text-base sm:text-2xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
              <Layers className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400 flex-shrink-0" />
              <span>Slide Sorter ({slides.length})</span>
            </h2>
            <p className="text-[10px] sm:text-sm text-slate-400 leading-tight">
              Tap any slide to jump • {bookmarkCount} bookmarked for quick revision
            </p>
          </div>
          <button
            onClick={onClose}
            className="sm:hidden px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors min-h-[36px] flex items-center justify-center border border-slate-700"
          >
            Close
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search in slides..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-slate-900 border border-slate-700 rounded-lg sm:rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 min-h-[36px] sm:min-h-[40px]"
            />
          </div>
          <button
            onClick={onClose}
            className="hidden sm:inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            Esc to Close
          </button>
        </div>
      </div>

      {/* Section & My Bookmarks Filter Pills */}
      <div className="max-w-7xl w-full mx-auto py-2.5 sm:py-4 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar touch-pan-x">
        {/* All Slides Tab */}
        <button
          onClick={() => setSelectedSection('all')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 sm:gap-1.5 ${
            selectedSection === 'all'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          All Slides ({slides.length})
        </button>

        {/* My Bookmarks Tab */}
        <button
          onClick={() => setSelectedSection('bookmarks')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 sm:gap-1.5 ${
            selectedSection === 'bookmarks'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 font-bold'
              : bookmarkCount > 0
              ? 'bg-amber-950/40 text-amber-300 border border-amber-600/50 hover:bg-amber-900/50'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Bookmark className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${selectedSection === 'bookmarks' ? 'fill-current' : bookmarkCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
          My Bookmarks ({bookmarkCount})
        </button>

        {/* Section Tabs */}
        {SECTIONS.map(sec => {
          const count = slides.filter(s => s.sectionId === sec.id).length;
          return (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSection === sec.id
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {sec.number}. {sec.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Slide Grid */}
      <div className="max-w-7xl w-full mx-auto flex-1 overflow-y-auto pr-1 sm:pr-2 py-2 sm:py-4">
        {selectedSection === 'bookmarks' && bookmarkCount === 0 ? (
          <div className="text-center py-16 sm:py-20 px-4 max-w-md mx-auto space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Bookmark className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">No Bookmarked Slides Yet</h3>
            <p className="text-[11px] sm:text-sm text-slate-400 leading-relaxed">
              Pin high-priority questions, Kadane's algorithm, SQL JOINs, or HR responses by tapping the bookmark icon on any slide or card.
            </p>
            <button
              onClick={() => setSelectedSection('all')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Explore All Slides
            </button>
          </div>
        ) : filteredSlides.length === 0 ? (
          <div className="text-center py-16 sm:py-20 text-slate-500">
            <p className="text-sm sm:text-base">No slides match your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
            {filteredSlides.map(slide => {
              const slideIndex = slides.findIndex(s => s.id === slide.id);
              const isActive = slideIndex === currentSlideIndex;
              const isPinned = bookmarkedSlideIds.includes(slide.id);
              const isChecklist = !!slide.isMandatoryChecklist;
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
                  className={`group relative p-3 sm:p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[130px] sm:min-h-[160px] ${
                    isLocked
                      ? 'opacity-50 bg-slate-950/80 border-slate-800/80 cursor-not-allowed hover:border-slate-700'
                      : isChecklist
                      ? 'bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-950/40 cursor-pointer'
                      : isActive
                      ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-950/50 cursor-pointer'
                      : isPinned
                      ? 'bg-amber-950/20 border-amber-500/50 hover:border-amber-400 hover:bg-amber-950/30 cursor-pointer'
                      : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-850 cursor-pointer'
                  } ${slide.isDivider ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] sm:text-[11px] font-bold text-cyan-400">
                          #{slide.slideNumber}
                        </span>
                        <span className={`text-[9px] sm:text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                          isChecklist ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/50' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isChecklist ? 'Mandatory' : slide.sectionId}
                        </span>
                      </div>

                      {/* Card Action / Lock / Bookmark */}
                      {isLocked ? (
                        <div className="p-1 rounded-md bg-slate-800/80 text-slate-500 border border-slate-700 flex items-center gap-1 text-[10px] font-mono">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span className="hidden xs:inline text-amber-300">Locked</span>
                        </div>
                      ) : isChecklist ? (
                        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                          Checklist
                        </span>
                      ) : (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onToggleBookmark(slide.id);
                          }}
                          className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg border transition-colors cursor-pointer min-h-[28px] min-w-[28px] flex items-center justify-center ${
                            isPinned
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                              : 'bg-slate-800/60 text-slate-500 border-slate-700/60 hover:text-amber-300 hover:border-amber-500/40'
                          }`}
                          title={isPinned ? 'Remove Bookmark' : 'Pin to My Bookmarks'}
                        >
                          <Bookmark className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isPinned ? 'fill-current' : ''}`} />
                        </button>
                      )}
                    </div>

                    <h3 className={`text-xs sm:text-sm font-semibold group-hover:text-cyan-300 line-clamp-2 transition-colors pr-2 leading-snug ${
                      isChecklist ? 'text-cyan-300 font-bold' : isLocked ? 'text-slate-400' : 'text-white'
                    }`}>
                      {slide.slideTitle}
                    </h3>
                    {slide.slideSubtitle && (
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 line-clamp-1">
                        {slide.slideSubtitle}
                      </p>
                    )}
                  </div>

                  <div className="mt-2.5 sm:mt-3 pt-1.5 sm:pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      {isLocked ? (
                        <span className="text-amber-400/80 text-[10px] flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Complete Slide #2 first
                        </span>
                      ) : isChecklist ? (
                        <span className="text-cyan-400 text-[10px] font-semibold flex items-center gap-1">
                          ★ Gatekeeper Slide
                        </span>
                      ) : (
                        <>
                          {isPinned && (
                            <span className="text-amber-400 text-[9px] sm:text-[10px] font-semibold flex items-center gap-0.5">
                              ★ Pinned
                            </span>
                          )}
                          {slide.content.codeBlocks && slide.content.codeBlocks.length > 0 && (
                            <Terminal className="w-3 h-3 text-cyan-400" />
                          )}
                          {slide.content.tables && slide.content.tables.length > 0 && (
                            <Database className="w-3 h-3 text-amber-400" />
                          )}
                          {slide.isDivider && <Sparkles className="w-3 h-3 text-purple-400" />}
                        </>
                      )}
                    </span>
                    {!isLocked && (
                      <span className="group-hover:translate-x-0.5 transition-transform text-cyan-400 flex items-center gap-0.5">
                        Open <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
