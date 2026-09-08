import { useState, useRef, useEffect, useCallback } from 'react';

interface UseSlideSwipeOptions {
  enabled?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  canSwipePrev?: boolean;
  canSwipeNext?: boolean;
  onAttemptBlockedNext?: () => void;
  threshold?: number;
}

export interface UseSlideSwipeReturn {
  containerRef: (node: HTMLDivElement | null) => void;
  swipeFeedback: 'left' | 'right' | null;
}

/**
 * Robust, fluid horizontal slide swipe detection.
 * Ensures vertical page scrolling is 100% free, natural, and never blocked or frozen.
 */
export function useSlideSwipe({
  enabled = true,
  onNext,
  onPrev,
  canSwipePrev = true,
  canSwipeNext = true,
  onAttemptBlockedNext,
  threshold = 45,
}: UseSlideSwipeOptions): UseSlideSwipeReturn {
  const [swipeFeedback, setSwipeFeedback] = useState<'left' | 'right' | null>(null);
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const onNextRef = useRef(onNext);
  const onPrevRef = useRef(onPrev);
  const canSwipePrevRef = useRef(canSwipePrev);
  const canSwipeNextRef = useRef(canSwipeNext);
  const onAttemptBlockedNextRef = useRef(onAttemptBlockedNext);
  const thresholdRef = useRef(threshold);

  onNextRef.current = onNext;
  onPrevRef.current = onPrev;
  canSwipePrevRef.current = canSwipePrev;
  canSwipeNextRef.current = canSwipeNext;
  onAttemptBlockedNextRef.current = onAttemptBlockedNext;
  thresholdRef.current = threshold;

  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const isTracking = useRef(false);
  const isScrollingVertical = useRef(false);
  const feedbackTimer = useRef<number | null>(null);

  const containerRef = useCallback((el: HTMLDivElement | null) => {
    setNode(prev => (prev === el ? prev : el));
  }, []);

  useEffect(() => {
    if (!node || !enabled) return;

    const onTouchStart = (e: TouchEvent) => {
      // Only track single-finger touches
      if (e.touches.length !== 1) {
        isTracking.current = false;
        return;
      }

      const target = e.target as HTMLElement | null;
      // Skip swipe if touching form inputs, textarea, select or sliders
      if (target?.closest('input, textarea, select, [role="slider"], [role="button"]')) {
        isTracking.current = false;
        return;
      }

      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      startTime.current = Date.now();
      isTracking.current = true;
      isScrollingVertical.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isTracking.current || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // If user starts moving vertically more than horizontally, mark as vertical scroll
      if (absY > 10 && absY > absX * 1.1) {
        isScrollingVertical.current = true;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isTracking.current) return;
      isTracking.current = false;

      // If this gesture was a vertical scroll, do not trigger slide changes
      if (isScrollingVertical.current) {
        return;
      }

      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const duration = Date.now() - startTime.current;

      // Must be a deliberate, reasonably quick horizontal gesture
      if (duration > 800) return;
      if (absX < thresholdRef.current) return;
      if (absX <= absY * 1.25) return;

      if (deltaX < 0) {
        // Swiped Left -> Navigate to NEXT slide
        if (canSwipeNextRef.current && onNextRef.current) {
          setSwipeFeedback('left');
          onNextRef.current();
          if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
          feedbackTimer.current = window.setTimeout(() => setSwipeFeedback(null), 300);
        } else if (!canSwipeNextRef.current && onAttemptBlockedNextRef.current) {
          // Provide immediate feedback if next slide is locked
          onAttemptBlockedNextRef.current();
        }
      } else if (deltaX > 0) {
        // Swiped Right -> Navigate to PREV slide
        if (canSwipePrevRef.current && onPrevRef.current) {
          setSwipeFeedback('right');
          onPrevRef.current();
          if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
          feedbackTimer.current = window.setTimeout(() => setSwipeFeedback(null), 300);
        }
      }
    };

    const onTouchCancel = () => {
      isTracking.current = false;
      isScrollingVertical.current = false;
    };

    // Passive listeners ensure zero blocking or lag for browser scrolling
    const opts: AddEventListenerOptions = { passive: true };
    node.addEventListener('touchstart', onTouchStart, opts);
    node.addEventListener('touchmove', onTouchMove, opts);
    node.addEventListener('touchend', onTouchEnd, opts);
    node.addEventListener('touchcancel', onTouchCancel, opts);

    return () => {
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchmove', onTouchMove);
      node.removeEventListener('touchend', onTouchEnd);
      node.removeEventListener('touchcancel', onTouchCancel);
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    };
  }, [node, enabled]);

  return {
    containerRef,
    swipeFeedback,
  };
}

