import { useState, useRef, useEffect, useCallback } from 'react';

interface UseSlideSwipeOptions {
  enabled?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  canSwipePrev?: boolean;
  canSwipeNext?: boolean;
  threshold?: number;
}

export interface UseSlideSwipeReturn {
  containerRef: (node: HTMLDivElement | null) => void;
  swipeFeedback: 'left' | 'right' | null;
}

const AXIS_LOCK_PX = 12;
const NO_SLIDE_SWIPE_SELECTOR =
  '[data-no-slide-swipe], button, a, input, textarea, select, pre, table, [role="button"], [role="slider"]';

/**
 * Horizontal slide swipe only. Vertical panning is left entirely to the browser.
 * No touchmove listeners, no preventDefault, no pointer capture, no mid-gesture setState.
 */
export function useSlideSwipe({
  enabled = true,
  onNext,
  onPrev,
  canSwipePrev = true,
  canSwipeNext = true,
  threshold = 64,
}: UseSlideSwipeOptions): UseSlideSwipeReturn {
  const [swipeFeedback, setSwipeFeedback] = useState<'left' | 'right' | null>(null);
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const onNextRef = useRef(onNext);
  const onPrevRef = useRef(onPrev);
  const canSwipePrevRef = useRef(canSwipePrev);
  const canSwipeNextRef = useRef(canSwipeNext);
  const thresholdRef = useRef(threshold);

  onNextRef.current = onNext;
  onPrevRef.current = onPrev;
  canSwipePrevRef.current = canSwipePrev;
  canSwipeNextRef.current = canSwipeNext;
  thresholdRef.current = threshold;

  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);
  const ignored = useRef(false);
  const consumed = useRef(false);
  const feedbackTimer = useRef<number | null>(null);

  const containerRef = useCallback((el: HTMLDivElement | null) => {
    setNode(prev => (prev === el ? prev : el));
  }, []);

  useEffect(() => {
    if (!node || !enabled) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        tracking.current = false;
        ignored.current = true;
        return;
      }

      const target = e.target as HTMLElement | null;
      if (target?.closest(NO_SLIDE_SWIPE_SELECTOR)) {
        tracking.current = false;
        ignored.current = true;
        consumed.current = false;
        return;
      }

      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      tracking.current = true;
      ignored.current = false;
      consumed.current = false;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking.current || ignored.current || consumed.current) {
        tracking.current = false;
        ignored.current = false;
        return;
      }

      const touch = e.changedTouches[0];
      tracking.current = false;
      if (!touch) return;

      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Vertical (or tiny / diagonal-vertical) gestures never change slides.
      if (absY >= absX) return;
      if (absX < AXIS_LOCK_PX) return;
      if (absX < thresholdRef.current) return;

      if (deltaX < 0 && canSwipeNextRef.current && onNextRef.current) {
        consumed.current = true;
        setSwipeFeedback('left');
        onNextRef.current();
        if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
        feedbackTimer.current = window.setTimeout(() => setSwipeFeedback(null), 300);
      } else if (deltaX > 0 && canSwipePrevRef.current && onPrevRef.current) {
        consumed.current = true;
        setSwipeFeedback('right');
        onPrevRef.current();
        if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
        feedbackTimer.current = window.setTimeout(() => setSwipeFeedback(null), 300);
      }
    };

    const onTouchCancel = () => {
      tracking.current = false;
      ignored.current = false;
      consumed.current = false;
    };

    const opts: AddEventListenerOptions = { passive: true };
    node.addEventListener('touchstart', onTouchStart, opts);
    node.addEventListener('touchend', onTouchEnd, opts);
    node.addEventListener('touchcancel', onTouchCancel, opts);

    return () => {
      node.removeEventListener('touchstart', onTouchStart);
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
