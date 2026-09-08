import React, { useState, useEffect, useMemo } from 'react';
import { Slide } from './types';
import { getAllSlides } from './data/allSlides';
import { SlideViewer } from './components/SlideViewer';
import { SlideThumbnailGrid } from './components/SlideThumbnailGrid';
import { QuickSearchModal } from './components/QuickSearchModal';
import { QuickJumpModal } from './components/QuickJumpModal';
import { ExportModal } from './components/ExportModal';
import { PresentationControls } from './components/PresentationControls';
import { EunchaeChat } from './components/EunchaeChat';
import { EunchaeModelModal, CHATGPT_EUNCHAE_URL } from './components/EunchaeModelModal';
import { initializeContentIndex } from './utils/eunchaeEngine';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [isDocsCompleted, setIsDocsCompleted] = useState<boolean>(() => {
    try {
      const v1 = localStorage.getItem('tcs_documents_slide_completed');
      const v2 = localStorage.getItem('tcs_ignite_gatekeeper_completed');
      return v1 === 'true' || v2 === 'true';
    } catch {
      return false;
    }
  });

  const slides = useMemo(() => getAllSlides(isDocsCompleted), [isDocsCompleted]);

  // Warm and pre-index all slides for instant sub-millisecond search retrieval
  useEffect(() => {
    initializeContentIndex(slides);
  }, [slides]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (hash && hash.startsWith('#slide-')) {
      const parsed = parseInt(hash.replace('#slide-', ''), 10);
      if (!isNaN(parsed) && parsed >= 1) {
        const targetIdx = Math.min(Math.max(0, parsed - 1), 72);
        try {
          const completed =
            localStorage.getItem('tcs_documents_slide_completed') === 'true' ||
            localStorage.getItem('tcs_ignite_gatekeeper_completed') === 'true';
          if (!completed && targetIdx > 1) {
            return 1;
          }
        } catch {
          // ignore
        }
        return targetIdx;
      }
    }
    return 0;
  });

  const [isGridOpen, setIsGridOpen] = useState(false);
  const [gridInitialTab, setGridInitialTab] = useState<any>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickJumpOpen, setIsQuickJumpOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNiKiOpen, setIsNiKiOpen] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [externalNiKiPrompt, setExternalNiKiPrompt] = useState<string | null>(null);
  const [blockedToastMessage, setBlockedToastMessage] = useState<string | null>(null);

  const handleOpenEunchae = () => {
    setIsModelSelectorOpen(true);
  };

  const handleSelectGoogleAI = () => {
    setIsModelSelectorOpen(false);
    setIsNiKiOpen(true);
  };

  const handleSelectChatGPT = () => {
    setIsModelSelectorOpen(false);
    window.open(CHATGPT_EUNCHAE_URL, '_blank', 'noopener,noreferrer');
  };

  const triggerBlockedMessage = () => {
    setBlockedToastMessage('Please check all items before continuing.');
  };

  useEffect(() => {
    if (blockedToastMessage) {
      const timer = setTimeout(() => setBlockedToastMessage(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [blockedToastMessage]);

  // Bookmarked slide IDs with localStorage persistence
  const [bookmarkedSlideIds, setBookmarkedSlideIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tcs_ignite_bookmarks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    }
    return [];
  });

  // Save bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tcs_ignite_bookmarks', JSON.stringify(bookmarkedSlideIds));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
    }
  }, [bookmarkedSlideIds]);

  const handleToggleBookmark = (slideId: string) => {
    setBookmarkedSlideIds(prev =>
      prev.includes(slideId) ? prev.filter(id => id !== slideId) : [...prev, slideId]
    );
  };

  const handleOpenGrid = () => {
    setGridInitialTab('all');
    setIsGridOpen(true);
  };

  const handleOpenBookmarks = () => {
    setGridInitialTab('bookmarks');
    setIsGridOpen(true);
  };

  // Sync hash and automatically scroll to top when slide changes
  useEffect(() => {
    window.location.hash = `slide-${currentSlideIndex + 1}`;
    // Scroll window back to top cleanly when changing slides so new slide starts at the top
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [currentSlideIndex]);

  const [footerClearance, setFooterClearance] = useState(120);

  useEffect(() => {
    const footer = document.querySelector<HTMLElement>('[data-app-footer]');
    if (!footer) return;

    const measure = () => {
      const rect = footer.getBoundingClientRect();
      const fromBottom = window.innerHeight - rect.top;
      setFooterClearance(Math.max(96, Math.ceil(fromBottom + 12)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(footer);
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('orientationchange', measure, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, []);

  // Guaranteed cleanup for modal overflow lock
  useEffect(() => {
    const isAnyModalOpen =
      isGridOpen || isSearchOpen || isQuickJumpOpen || isExportOpen || isModelSelectorOpen || isNiKiOpen;
    const html = document.documentElement;
    if (isAnyModalOpen) {
      const prevBody = document.body.style.overflow;
      const prevHtml = html.style.overflow;
      document.body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevBody;
        html.style.overflow = prevHtml;
      };
    }
    document.body.style.overflow = '';
    html.style.overflow = '';
  }, [isGridOpen, isSearchOpen, isQuickJumpOpen, isExportOpen, isModelSelectorOpen, isNiKiOpen]);

  const handleNext = () => {
    if (!isDocsCompleted && currentSlideIndex >= 1) {
      triggerBlockedMessage();
      return;
    }
    setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlideIndex(prev => Math.max(0, prev - 1));
  };

  const handleSelectSlide = (index: number) => {
    if (!isDocsCompleted && index > 1) {
      triggerBlockedMessage();
      return;
    }
    if (index >= 0 && index < slides.length) {
      setCurrentSlideIndex(index);
    }
  };

  const handleCompleteDocuments = () => {
    try {
      localStorage.setItem('tcs_documents_slide_completed', 'true');
      localStorage.setItem('tcs_ignite_gatekeeper_completed', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsDocsCompleted(true);
    // Upon verifying all documents on Slide 2, smoothly advance to Slide 3 (Agenda Divider)
    setCurrentSlideIndex(2);
    setBlockedToastMessage(null);
  };

  const handleAskNiKiAboutSlide = (targetSlide: Slide) => {
    setExternalNiKiPrompt(
      `Hey! 👋 I want to understand Slide #${targetSlide.slideNumber}: "${targetSlide.slideTitle}". Could you explain this topic, provide an example, and share interview tips?`
    );
    setIsModelSelectorOpen(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#070a12] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] antialiased relative">
      {/* Toast Notification for Gatekeeper Action */}
      {blockedToastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none px-4">
          <div className="bg-amber-950/95 text-amber-200 border border-amber-500/70 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{blockedToastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header & Presentation Controls */}
      <PresentationControls
        slides={slides}
        currentIndex={currentSlideIndex}
        onSelectSlide={handleSelectSlide}
        onNext={handleNext}
        onPrev={handlePrev}
        onOpenGrid={handleOpenGrid}
        onOpenBookmarks={handleOpenBookmarks}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        bookmarkedSlideIds={bookmarkedSlideIds}
        onToggleBookmark={handleToggleBookmark}
        onOpenQuickJump={() => setIsQuickJumpOpen(true)}
        onOpenNiKi={handleOpenEunchae}
      />

      {/* Main Presentation Stage */}
      <main
        className="flex-1 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-6 lg:p-8 w-full max-w-full min-w-0"
        style={{ paddingBottom: `calc(${footerClearance}px + env(safe-area-inset-bottom, 0px))` }}
      >
        <SlideViewer
          slide={currentSlide}
          totalSlides={slides.length}
          onNext={handleNext}
          onPrev={handlePrev}
          isBookmarked={bookmarkedSlideIds.includes(currentSlide.id)}
          onToggleBookmark={handleToggleBookmark}
          onCompleteDocuments={handleCompleteDocuments}
          onAttemptBlockedNext={triggerBlockedMessage}
          onAskNiKi={handleAskNiKiAboutSlide}
        />
      </main>

      {/* Sorter / Grid View Modal */}
      {isGridOpen && (
        <SlideThumbnailGrid
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onSelectSlide={handleSelectSlide}
          onClose={() => setIsGridOpen(false)}
          bookmarkedSlideIds={bookmarkedSlideIds}
          onToggleBookmark={handleToggleBookmark}
          initialTab={gridInitialTab}
          isDocsCompleted={isDocsCompleted}
          onAttemptBlockedSlide={triggerBlockedMessage}
        />
      )}

      {/* Quick Search Modal */}
      <QuickSearchModal
        slides={slides}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSlide={handleSelectSlide}
        isDocsCompleted={isDocsCompleted}
        onAttemptBlockedSlide={triggerBlockedMessage}
      />

      {/* Quick Jump Modal */}
      <QuickJumpModal
        slides={slides}
        currentIndex={currentSlideIndex}
        isOpen={isQuickJumpOpen}
        onClose={() => setIsQuickJumpOpen(false)}
        onSelectSlide={handleSelectSlide}
        bookmarkedSlideIds={bookmarkedSlideIds}
        isDocsCompleted={isDocsCompleted}
        onAttemptBlockedSlide={triggerBlockedMessage}
      />

      {/* Export & Download Modal */}
      <ExportModal
        slides={slides}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Eunchae AI Assistant Chat Panel */}
      <EunchaeChat
        isOpen={isNiKiOpen}
        onClose={() => setIsNiKiOpen(false)}
        currentSlide={currentSlide}
        allSlides={slides}
        currentSlideIndex={currentSlideIndex}
        onOpenSlide={handleSelectSlide}
        externalTriggerPrompt={externalNiKiPrompt}
        onClearExternalPrompt={() => setExternalNiKiPrompt(null)}
        onOpenModelModal={handleOpenEunchae}
      />

      {/* Eunchae AI Model Selector Modal */}
      <EunchaeModelModal
        isOpen={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
        onSelectGoogleAI={handleSelectGoogleAI}
        onSelectChatGPT={handleSelectChatGPT}
      />
    </div>
  );
}
