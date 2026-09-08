import React, { useState } from 'react';
import { Slide } from '../types';
import { useResponsiveSlideScale } from '../hooks/useResponsiveSlideScale';
import { useSlideSwipe } from '../hooks/useSlideSwipe';
import { MandatoryDocumentsChecklist } from './MandatoryDocumentsChecklist';
import { CoverReportingDetails } from './CoverReportingDetails';
import { CodeSyntax } from './CodeSyntax';
import { StudyCallout, StudyKeyNotes, StudyParagraphs } from './StudyBlocks';
import { StudyText } from './StudyText';
import {
  Copy,
  Check,
  Terminal,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  Lock
} from 'lucide-react';

interface SlideViewerProps {
  slide: Slide;
  totalSlides: number;
  onNext?: () => void;
  onPrev?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (slideId: string) => void;
  onCompleteDocuments?: () => void;
  onAttemptBlockedNext?: () => void;
  onAskNiKi?: (slide: Slide) => void;
  isExportMode?: boolean;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  slide,
  totalSlides,
  onNext,
  onPrev,
  isBookmarked = false,
  onToggleBookmark,
  onCompleteDocuments,
  onAttemptBlockedNext,
  onAskNiKi,
  isExportMode = false
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Dynamic viewport-aware font, padding, and spacing scaling hook
  const { typography, spacing, isTinyMobile, isMobile } = useResponsiveSlideScale(isExportMode);

  // Touch gesture hook with velocity detection, visual drag feedback, and internal scroll isolation
  const { swipeFeedback, containerRef } = useSlideSwipe({
    enabled: !isExportMode,
    onNext: isExportMode ? undefined : onNext,
    onPrev: isExportMode ? undefined : onPrev,
    canSwipePrev: !isExportMode && slide.slideNumber > 1,
    canSwipeNext: !isExportMode && (slide.isMandatoryChecklist ? false : slide.slideNumber < totalSlides),
    threshold: 64,
  });

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const studySkin = { typography, spacing };

  return (
    <div
      id="slide-canvas"
      ref={isExportMode ? undefined : containerRef}
      style={
        isExportMode
          ? { width: '1920px', height: '1080px', minWidth: '1920px', minHeight: '1080px', boxSizing: 'border-box' }
          : undefined
      }
      className={
        isExportMode
          ? 'w-[1920px] h-[1080px] p-12 flex flex-col justify-between bg-gradient-to-b from-[#0f172a] to-[#0b0f19] relative overflow-hidden select-text border border-slate-800/80 rounded-none shadow-none'
          : `w-full max-w-6xl mx-auto flex flex-col justify-between min-h-[auto] sm:min-h-[640px] bg-gradient-to-b from-[#0f172a] to-[#0b0f19] border border-slate-800/80 rounded-xl sm:rounded-2xl ${spacing.containerPadding} shadow-2xl shadow-cyan-950/20 relative overflow-hidden transition-all duration-300 select-text touch-pan-y`
      }
    >
      {/* Subtle background ambient tech glow */}
      <div className="absolute -top-32 -right-32 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Swipe Feedback Visual Effect on Completed Gesture */}
      {swipeFeedback && (
        <div
          className={`absolute inset-y-0 ${
            swipeFeedback === 'left' ? 'right-0' : 'left-0'
          } w-16 bg-gradient-to-r from-cyan-500/20 to-transparent pointer-events-none animate-pulse`}
        />
      )}

      {/* Slide Top Metadata Bar */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 border-b border-slate-800/80 pb-2 sm:pb-4 mb-2.5 sm:mb-6 relative z-10">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
          <span className={`font-mono font-bold tracking-wider uppercase rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 flex items-center gap-1 ${typography.badge}`}>
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-none">{slide.sectionTitle}</span>
          </span>
          {slide.badge && (
            <span className="hidden sm:inline-block px-2 py-0.5 text-xs rounded bg-slate-800/80 text-slate-300 border border-slate-700">
              {slide.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-slate-400 flex-shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-cyan-400 font-bold">SLIDE {slide.slideNumber}</span>
            <span className="text-slate-600">/</span>
            <span>{totalSlides}</span>
          </div>
        </div>
      </div>

      {/* Main Slide Header */}
      <div className={`${spacing.headerMargin} relative z-10`}>
        <h1 className={`${typography.title} tracking-tight text-white mb-1 sm:mb-2 font-['Plus_Jakarta_Sans'] break-words`}>
          {slide.slideTitle}
        </h1>
        {slide.slideSubtitle && (
          <p className={`${typography.subtitle} text-cyan-400/90 font-medium break-words`}>
            {slide.slideSubtitle}
          </p>
        )}
      </div>

      {/* Mandatory Documents Verification Checklist Layout */}
      {slide.isMandatoryChecklist ? (
        <div className="flex-1 my-2 sm:my-4 relative z-10">
          <MandatoryDocumentsChecklist
            onComplete={onCompleteDocuments || onNext || (() => {})}
            onAttemptIncomplete={onAttemptBlockedNext}
            isMobile={isMobile}
            isExportMode={isExportMode}
          />
        </div>
      ) : slide.isDivider ? (
        <div className={`flex-1 flex flex-col justify-center my-2 sm:my-6 py-3.5 sm:py-8 ${spacing.cardPadding} rounded-xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm relative z-10`}>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-2.5 sm:mb-4 w-fit">
            <Sparkles className="w-3 h-3" /> Section Master Deck
          </div>
          <p className={`${isMobile ? 'text-xs sm:text-sm' : 'text-lg sm:text-xl'} text-slate-200 leading-relaxed max-w-3xl mb-3 sm:mb-8 break-words`}>
            <StudyText text={slide.content.paragraphs?.[0] || ''} />
          </p>

          {slide.content.keyNotes && slide.content.keyNotes.length > 0 && (
            <StudyKeyNotes notes={slide.content.keyNotes} skin={studySkin} />
          )}

          {slide.id === 'cover' && (
            <CoverReportingDetails isMobile={isMobile} />
          )}
        </div>
      ) : (
        /* Regular Slide Content Area */
        <div className={`flex-1 ${spacing.sectionGap} relative z-10 text-slate-200`}>
          {slide.content.paragraphs && slide.content.paragraphs.length > 0 && (
            <StudyParagraphs paragraphs={slide.content.paragraphs} skin={studySkin} />
          )}

          {slide.content.bullets && slide.content.bullets.length > 0 && (
            <StudyParagraphs paragraphs={slide.content.bullets.map(b => (b.startsWith('•') ? b : `• ${b}`))} skin={studySkin} />
          )}

          {/* ASCII Diagrams / Visual Trees */}
          {slide.content.diagram && (
            <div data-no-slide-swipe className={`${spacing.cardPadding} rounded-xl bg-slate-950/80 border border-slate-800 ${typography.diagram} text-cyan-300 overflow-x-auto whitespace-pre shadow-inner touch-pan-x overscroll-x-contain min-w-0 max-w-full`}>
              {slide.content.diagram}
            </div>
          )}

          {/* Code Blocks */}
          {slide.content.codeBlocks && slide.content.codeBlocks.length > 0 && (
            <div className="space-y-2.5 sm:space-y-4">
              {slide.content.codeBlocks.map((cb, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-slate-800 bg-[#090d16] shadow-lg">
                  <div className={`flex items-center justify-between ${spacing.cardPadding} py-1.5 sm:py-2 bg-slate-900/90 border-b border-slate-800 text-[10px] sm:text-xs font-mono text-slate-400`}>
                    <span className="flex items-center gap-1.5 text-cyan-400 font-semibold truncate max-w-[180px] sm:max-w-[280px]">
                      <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      {cb.title || `${cb.language.toUpperCase()} SNIPPET`}
                    </span>
                    <button
                      id={`copy-code-${idx}`}
                      onClick={() => handleCopy(cb.code, idx)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[10px] sm:text-xs min-h-[30px] sm:min-h-auto"
                      title="Copy code to clipboard"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre data-no-slide-swipe className={`${spacing.cardPadding} ${typography.code} overflow-x-auto bg-[#060a12] touch-pan-x overscroll-x-contain min-w-0 max-w-full`}>
                    <code className="text-sky-200">
                      <CodeSyntax code={cb.code} language={cb.language} />
                    </code>
                  </pre>
                  {cb.output && (
                    <div className={`${spacing.cardPadding} py-1.5 sm:py-2.5 bg-slate-900/60 border-t border-slate-800/80 font-mono text-[10px] sm:text-xs text-slate-300 overflow-x-auto`}>
                      <span className="text-emerald-400/90 block mb-0.5 font-semibold uppercase tracking-wider text-[9px] sm:text-[10px]">Output</span>
                      <pre className="whitespace-pre-wrap text-[10px] sm:text-xs text-emerald-300">{cb.output}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tables with Mobile Horizontal Scroll Indicator */}
          {slide.content.tables && slide.content.tables.length > 0 && (
            <div className="space-y-2.5 sm:space-y-4">
              {slide.content.tables.map((tbl, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-slate-800/90 shadow-md">
                  <div className={`px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-800/80 border-b border-slate-700/80 text-[11px] sm:text-sm font-semibold text-cyan-300 flex items-center justify-between gap-2`}>
                    <div className="flex items-center gap-1.5 truncate">
                      <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      <span className="truncate">{tbl.title || 'Data Reference'}</span>
                    </div>
                    {tbl.headers.length > 2 && (
                      <span className="text-[9px] sm:text-[10px] text-cyan-400/80 font-normal sm:hidden whitespace-nowrap bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
                        Scroll →
                      </span>
                    )}
                  </div>
                  <div data-no-slide-swipe className="overflow-x-auto touch-pan-x overscroll-x-contain min-w-0 max-w-full">
                    <table className={`w-full text-left ${typography.table} min-w-[300px]`}>
                      <thead className="bg-slate-900 text-cyan-400 uppercase font-mono text-[9px] sm:text-xs tracking-wider border-b border-slate-800">
                        <tr>
                          {tbl.headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-2 sm:px-4 py-1.5 sm:py-3 font-semibold whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                        {tbl.rows.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-900/50'}>
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-2 sm:px-4 py-1.5 sm:py-2.5 leading-relaxed break-words ${
                                  cIdx === 0 ? 'text-cyan-200 font-medium' : 'text-slate-300'
                                }`}
                              >
                                <StudyText text={cell} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {tbl.caption && (
                    <div className="px-2.5 sm:px-4 py-1 sm:py-2 bg-slate-900/60 text-[10px] sm:text-xs text-slate-400 border-t border-slate-800">
                      {tbl.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {slide.content.keyNotes && slide.content.keyNotes.length > 0 && !slide.isDivider && (
            <StudyKeyNotes notes={slide.content.keyNotes} skin={studySkin} />
          )}

          {slide.content.callouts && slide.content.callouts.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              {slide.content.callouts.map((callout, idx) => (
                <StudyCallout key={idx} callout={callout} skin={studySkin} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Slide Bottom Bar Navigation & Mobile Swipe Hint */}
      {isExportMode ? (
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">TCS Ignite Interview Preparation Handbook</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-medium">{slide.sectionTitle}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-cyan-400 font-bold">SLIDE {slide.slideNumber}</span>
            <span className="text-slate-600">/</span>
            <span>{totalSlides}</span>
          </div>
        </div>
      ) : (
        <div className={`${spacing.blockMargin} border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 relative z-10`}>
          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs">
            <span className="sm:hidden text-cyan-400 font-semibold flex items-center gap-1">
              <ArrowLeft className="w-3 h-3 animate-pulse" /> Swipe to flip <ArrowRight className="w-3 h-3 animate-pulse" />
            </span>
            <span className="hidden sm:inline">TCS B.Sc Ignite Prep</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-cyan-400">Subashini</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {onPrev && (
              <button
                onClick={onPrev}
                disabled={slide.slideNumber <= 1}
                className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-medium transition-colors text-[11px] sm:text-xs min-h-[34px] sm:min-h-[36px] flex items-center cursor-pointer"
              >
                Previous
              </button>
            )}
            {onNext && (
              slide.isMandatoryChecklist ? (
                <button
                  type="button"
                  onClick={onAttemptBlockedNext}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 border border-slate-700 font-medium transition-colors flex items-center gap-1.5 text-[11px] sm:text-xs min-h-[34px] sm:min-h-[36px] cursor-pointer"
                  title="Verify all 7 documents to unlock"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verify 7 Items</span>
                </button>
              ) : (
                <button
                  onClick={onNext}
                  disabled={slide.slideNumber >= totalSlides}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white font-medium transition-colors flex items-center gap-1 text-[11px] sm:text-xs min-h-[34px] sm:min-h-[36px] cursor-pointer"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};



