import React, { useState, useRef, useCallback } from 'react';

interface UseSlideSwipeOptions {
  onNext?: () => void;
  onPrev?: () => void;
  canSwipePrev?: boolean;
  canSwipeNext?: boolean;
  threshold?: number;       // Minimum px distance to trigger (default 40px)
  velocityThreshold?: number; // Minimum flick px distance when fast (default 20px)
  maxDragOffset?: number;   // Maximum visual drag translate in px (default 75px)
}

export interface UseSlideSwipeReturn {
  dragOffset: number;
  isSwiping: boolean;
  swipeFeedback: 'left' | 'right' | null;
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onTouchCancel: (e: React.TouchEvent) => void;
    onPointerDown?: (e: React.PointerEvent) => void;
    onPointerMove?: (e: React.PointerEvent) => void;
    onPointerUp?: (e: React.PointerEvent) => void;
    onPointerCancel?: (e: React.PointerEvent) => void;
  };
}

/**
 * Custom touch & pointer gesture hook for mobile swipe navigation between presentation slides.
 * Features real-time visual drag tracking, velocity detection for quick flicks, boundary damping,
 * and smart conflict resolution for embedded horizontally scrollable code blocks and tables.
 */
export function useSlideSwipe({
  onNext,
  onPrev,
  canSwipePrev = true,
  canSwipeNext = true,
  threshold = 44,
  velocityThreshold = 22,
  maxDragOffset = 70,
}: UseSlideSwipeOptions): UseSlideSwipeReturn {
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [swipeFeedback, setSwipeFeedback] = useState<'left' | 'right' | null>(null);

  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const isInsideScrollable = useRef<boolean>(false);
  const isTracking = useRef<boolean>(false);

  const handleStart = useCallback((clientX: number, clientY: number, target: EventTarget | null) => {
    const el = target as HTMLElement | null;
    // Check if user touched an internal horizontally scrollable block or interactive element
    isInsideScrollable.current = Boolean(el?.closest('pre, table, .touch-pan-x, input, select, textarea, button, a, [role="button"]'));
    startX.current = clientX;
    startY.current = clientY;
    startTime.current = Date.now();
    isTracking.current = true;
    setDragOffset(0);
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isTracking.current || startX.current === null || startY.current === null) return;

    const diffX = clientX - startX.current;
    const diffY = clientY - startY.current;

    // Detect vertical page scrolling immediately: cancel swipe tracking so native vertical scroll proceeds unhindered
    if (Math.abs(diffY) > 8 && Math.abs(diffY) >= Math.abs(diffX) * 0.9) {
      isTracking.current = false;
      setIsSwiping(false);
      setDragOffset(0);
      return;
    }

    // Only engage horizontal slide swipe if gesture is strictly horizontal and not vertical
    if (Math.abs(diffX) > Math.abs(diffY) * 1.5 && Math.abs(diffX) > 12 && Math.abs(diffY) < 35) {
      // If inside horizontally scrollable element and gentle drag, let user scroll code/table
      if (isInsideScrollable.current && Math.abs(diffX) < 55) {
        return;
      }

      setIsSwiping(true);

      // Boundary resistance damping
      const isDraggingPastPrev = diffX > 0 && !canSwipePrev;
      const isDraggingPastNext = diffX < 0 && !canSwipeNext;
      const damping = isDraggingPastPrev || isDraggingPastNext ? 0.1 : 0.35;

      const clamped = Math.max(Math.min(diffX * damping, maxDragOffset), -maxDragOffset);
      setDragOffset(clamped);
    }
  }, [canSwipePrev, canSwipeNext, maxDragOffset]);

  const handleEnd = useCallback((clientX: number, clientY: number) => {
    if (!isTracking.current || startX.current === null || startY.current === null) {
      setDragOffset(0);
      setIsSwiping(false);
      return;
    }

    const diffX = clientX - startX.current;
    const diffY = clientY - startY.current;
    const duration = Date.now() - startTime.current;

    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY) * 1.4 && Math.abs(diffY) < 45;
    // Decisive swipe: either distance exceeds threshold, or fast flick (< 280ms) exceeds velocity threshold
    const isDecisive = Math.abs(diffX) >= threshold || (Math.abs(diffX) >= velocityThreshold && duration < 280);

    if (isHorizontalSwipe && isDecisive) {
      if (diffX < 0 && onNext && canSwipeNext) {
        // Swiped Left -> Go to Next Slide
        setSwipeFeedback('left');
        onNext();
        setTimeout(() => setSwipeFeedback(null), 300);
      } else if (diffX > 0 && onPrev && canSwipePrev) {
        // Swiped Right -> Go to Previous Slide
        setSwipeFeedback('right');
        onPrev();
        setTimeout(() => setSwipeFeedback(null), 300);
      }
    }

    setDragOffset(0);
    setIsSwiping(false);
    startX.current = null;
    startY.current = null;
    isTracking.current = false;
    isInsideScrollable.current = false;
  }, [onNext, onPrev, canSwipeNext, canSwipePrev, threshold, velocityThreshold]);

  const handleCancel = useCallback(() => {
    setDragOffset(0);
    setIsSwiping(false);
    startX.current = null;
    startY.current = null;
    isTracking.current = false;
    isInsideScrollable.current = false;
  }, []);

  // React Touch Handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
    }
  }, [handleStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleMove]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.changedTouches.length === 1) {
      handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    } else {
      handleCancel();
    }
  }, [handleEnd, handleCancel]);

  return {
    dragOffset,
    isSwiping,
    swipeFeedback,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel: handleCancel,
    },
  };
}
