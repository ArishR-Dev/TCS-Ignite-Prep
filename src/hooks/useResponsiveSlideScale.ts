import { useState, useEffect } from 'react';

export interface ResponsiveSlideScale {
  width: number;
  height: number;
  isTinyMobile: boolean; // < 360px
  isMobile: boolean;     // < 640px
  isTablet: boolean;     // 640px - 1023px
  isDesktop: boolean;    // >= 1024px
  scaleFactor: number;   // Normalized scale factor between 0.85 and 1.15
  typography: {
    title: string;       // Fluid title class/style
    subtitle: string;
    body: string;
    code: string;
    table: string;
    callout: string;
    badge: string;
    diagram: string;
  };
  spacing: {
    containerPadding: string;
    sectionGap: string;
    headerMargin: string;
    cardPadding: string;
    blockMargin: string;
  };
  inlineStyles?: {
    containerPadding?: string;
    titleFontSize?: string;
    bodyFontSize?: string;
  };
}

/**
 * Custom hook that continuously monitors viewport width and computes dynamic,
 * readable font scales, padding, and spacing for the SlideViewer.
 * Prevents text from being cut off or requiring manual pinch-to-zoom on mobile screens.
 */
export function useResponsiveSlideScale(forceDesktop: boolean = false): ResponsiveSlideScale {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (forceDesktop) return;
    let timeoutId: number;
    const handleResize = () => {
      // Fast debounced update
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 50);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [forceDesktop]);

  const width = forceDesktop ? 1920 : dimensions.width;
  const height = forceDesktop ? 1080 : dimensions.height;
  const isTinyMobile = forceDesktop ? false : width < 360;
  const isMobile = forceDesktop ? false : width < 640;
  const isTablet = forceDesktop ? false : (width >= 640 && width < 1024);
  const isDesktop = forceDesktop ? true : width >= 1024;

  // Normalized scale factor clamped safely to avoid illegibility or bloated sizes
  const rawRatio = width / 768;
  const scaleFactor = forceDesktop ? 1.0 : Math.min(Math.max(rawRatio, 0.85), 1.2);

  // Dynamic typography classes optimized for readability without manual zoom
  const typography = {
    title: isTinyMobile
      ? 'text-[1.125rem] leading-snug font-bold'
      : isMobile
      ? 'text-[1.35rem] sm:text-2xl leading-tight font-bold'
      : isTablet
      ? 'text-3xl leading-tight font-bold'
      : 'text-3xl lg:text-4xl leading-tight font-bold',
    
    subtitle: isTinyMobile
      ? 'text-[11px] leading-snug'
      : isMobile
      ? 'text-xs leading-normal'
      : 'text-sm lg:text-base leading-relaxed',

    body: isTinyMobile
      ? 'text-[12px] leading-relaxed'
      : isMobile
      ? 'text-[13px] leading-relaxed'
      : 'text-sm lg:text-base leading-relaxed',

    code: isTinyMobile
      ? 'text-[10px] leading-tight font-mono'
      : isMobile
      ? 'text-[11px] sm:text-xs leading-normal font-mono'
      : 'text-xs sm:text-sm leading-relaxed font-mono',

    table: isTinyMobile
      ? 'text-[10px] leading-tight'
      : isMobile
      ? 'text-[11px] sm:text-xs leading-normal'
      : 'text-xs sm:text-sm leading-normal',

    callout: isTinyMobile
      ? 'text-[11px] leading-relaxed'
      : isMobile
      ? 'text-xs leading-relaxed'
      : 'text-xs sm:text-sm leading-relaxed',

    badge: isTinyMobile
      ? 'text-[9px] px-1.5 py-0.5'
      : isMobile
      ? 'text-[10px] px-2 py-0.5'
      : 'text-xs px-2.5 py-1',

    diagram: isTinyMobile
      ? 'text-[8.5px] leading-tight font-mono'
      : isMobile
      ? 'text-[9.5px] sm:text-xs leading-normal font-mono'
      : 'text-xs sm:text-sm leading-relaxed font-mono',
  };

  // Dynamic spacing
  const spacing = {
    containerPadding: isTinyMobile
      ? 'p-2.5'
      : isMobile
      ? 'p-3.5 sm:p-5'
      : isTablet
      ? 'p-6 sm:p-7'
      : 'p-8 lg:p-10',

    sectionGap: isTinyMobile
      ? 'space-y-2.5'
      : isMobile
      ? 'space-y-3.5'
      : 'space-y-5 sm:space-y-6',

    headerMargin: isTinyMobile
      ? 'mb-2.5'
      : isMobile
      ? 'mb-3 sm:mb-4'
      : 'mb-4 sm:mb-6',

    cardPadding: isTinyMobile
      ? 'p-2'
      : isMobile
      ? 'p-2.5 sm:p-3'
      : 'p-3.5 sm:p-4',

    blockMargin: isTinyMobile
      ? 'mt-3 pt-2'
      : isMobile
      ? 'mt-4 pt-3'
      : 'mt-6 sm:mt-8 pt-4',
  };

  return {
    width,
    height,
    isTinyMobile,
    isMobile,
    isTablet,
    isDesktop,
    scaleFactor,
    typography,
    spacing,
  };
}
