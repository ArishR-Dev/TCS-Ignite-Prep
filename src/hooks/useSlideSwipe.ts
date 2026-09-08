import { useState, useRef, useEffect, useCallback } from 'react';

interface UseSlideSwipeOptions {
  enabled?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  canSwipePrev?: boolean;
  canSwipeNext?: boolean;
  threshold?: number;
  maxDragOffset?: number;
}

export interface UseSlideSwipeReturn {
  containerRef: (node: HTMLDivElement | null) => void;
  dragOffset: number;
  isSwiping: boolean;
  swipeFeedback: 'left' | 'right' | null;
}

const AXIS_LOCK_PX = 12;
const NO_SLIDE_SWIPE_SELECTOR =
  '[data-no-slide-swipe], button, a, input, textarea, select, pre, table, [role="button"], [role="slider"]';

type AxisLock = 'undecided' | 'vertical' | 'horizontal' | 'ignored';

/**
 * Native, passive touch gesture handling for slide navigation.
 * Vertical movement is never prevented so the browser keeps native scrolling.
 * Horizontal movement (after axis lock) changes slides once per gesture.
 */
export function useSlideSwipe({
  enabled = true,
  onNext,
  onPrev,
  canSwipePrev = true,
  canSwipeNext = true,
  threshold = 64,
  maxDragOffset = 70,
}: UseSlideSwipeOptions): UseSlideSwipeReturn {
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeFeedback, setSwipeFeedback] = useState<'left' | 'right' | null>(null);

  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const onNextRef = useRef(onNext);
  const onPrevRef = useRef(onPrev);
  const canSwipePrevRef = useRef(canSwipePrev);
  const canSwipeNextRef = useRef(canSwipeNext);
  const thresholdRef = useRef(threshold);
  const maxDragOffsetRef = useRef(maxDragOffset);

  onNextRef.current = onNext;
  onPrevRef.current = onPrev;
  canSwipePrevRef.current = canSwipePrev;
  canSwipeNextRef.current = canSwipeNext;
  thresholdRef.current = threshold;
  maxDragOffsetRef.current = maxDragOffset;

  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<AxisLock>('undecided');
  const tracking = useRef(false);
  const consumed = useRef(false);
  const feedbackTimer = useRef<number | null>(null);

  const clearVisual = useCallback(() => {
    setDragOffset(0);
    setIsSwiping(false);
  }, []);

  const resetGesture = useCallback(() => {
    tracking.current = false;
    axis.current = 'undecided';
    consumed.current = false;
    clearVisual();
  }, [clearVisual]);

  const containerRef = useCallback((el: HTMLDivElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node || !enabled) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        resetGesture();
        return;
      }

      const target = e.target as HTMLElement | null;
      if (target?.closest(NO_SLIDE_SWIPE_SELECTOR)) {
        tracking.current = false;
        axis.current = 'ignored';
        consumed.current = false;
        clearVisual();
        return;
      }

      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      axis.current = 'undecided';
      tracking.current = true;
      consumed.current = false;
      clearVisual();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking.current || axis.current === 'ignored' || axis.current === 'vertical') {
        return;
      }
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (axis.current === 'undecided') {
        if (absX < AXIS_LOCK_PX && absY < AXIS_LOCK_PX) {
          return;
        }
        // Vertical wins on ties so native scrolling is never stolen.
        if (absY >= absX) {
          axis.current = 'vertical';
          clearVisual();
          return;
        }
        axis.current = 'horizontal';
      }

      if (axis.current !== 'horizontal') return;

      const pastPrev = deltaX > 0 && !canSwipePrevRef.current;
      const pastNext = deltaX < 0 && !canSwipeNextRef.current;
      const damping = pastPrev || pastNext ? 0.1 : 0.35;
      const max = maxDragOffsetRef.current;
      const clamped = Math.max(Math.min(deltaX * damping, max), -max);

      setIsSwiping(true);
      setDragOffset(clamped);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking.current || axis.current !== 'horizontal' || consumed.current) {
        resetGesture();
        return;
      }

      const touch = e.changedTouches[0];
      if (!touch) {
        resetGesture();
        return;
      }

      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY && absX >= thresholdRef.current) {
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
      }

      tracking.current = false;
      axis.current = 'undecided';
      clearVisual();
    };

    const onTouchCancel = () => {
      resetGesture();
    };

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
  }, [node, enabled, clearVisual, resetGesture]);

  return {
    containerRef,
    dragOffset,
    isSwiping,
    swipeFeedback,
  };
}
