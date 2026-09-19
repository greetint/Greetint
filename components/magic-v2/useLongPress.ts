'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UseLongPressOptions {
  durationMs: number;
  onProgress?: (progress: number) => void;
  onComplete: () => void;
  onCancel?: (progress: number) => void;
}

/**
 * Drives a press-and-hold gesture with a 0..1 progress callback on every
 * animation frame, so callers can animate glow/fill/scale in lockstep with
 * the actual hold duration instead of guessing from a CSS transition.
 */
export function useLongPress({ durationMs, onProgress, onComplete, onCancel }: UseLongPressOptions) {
  const startedAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const doneRef = useRef(false);

  // Latest callback/duration values, read from inside the rAF loop so the
  // loop function itself never needs to close over a value that changes
  // between renders.
  const optsRef = useRef({ durationMs, onProgress, onComplete, onCancel });
  useEffect(() => {
    optsRef.current = { durationMs, onProgress, onComplete, onCancel };
  });

  const stopLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // The loop calls itself through the ref rather than its own binding name,
  // so there is no self-referencing closure to set up during render.
  const tickFnRef = useRef<(() => void) | null>(null);
  if (tickFnRef.current === null) {
    tickFnRef.current = () => {
      if (startedAtRef.current === null) return;
      const { durationMs, onProgress, onComplete } = optsRef.current;
      const elapsed = performance.now() - startedAtRef.current;
      const progress = Math.min(1, elapsed / durationMs);
      progressRef.current = progress;
      onProgress?.(progress);

      if (progress >= 1) {
        doneRef.current = true;
        stopLoop();
        startedAtRef.current = null;
        onComplete();
        return;
      }
      rafRef.current = requestAnimationFrame(() => tickFnRef.current?.());
    };
  }

  const start = useCallback(() => {
    if (doneRef.current) return;
    startedAtRef.current = performance.now();
    stopLoop();
    rafRef.current = requestAnimationFrame(() => tickFnRef.current?.());
  }, []);

  const cancel = useCallback(() => {
    if (doneRef.current) return;
    if (startedAtRef.current === null) return;
    startedAtRef.current = null;
    stopLoop();
    const last = progressRef.current;
    progressRef.current = 0;
    optsRef.current.onProgress?.(0);
    optsRef.current.onCancel?.(last);
  }, []);

  const reset = useCallback(() => {
    doneRef.current = false;
    progressRef.current = 0;
    startedAtRef.current = null;
    stopLoop();
  }, []);

  return {
    handlers: {
      onPointerDown: (e: React.PointerEvent) => {
        e.preventDefault();
        (e.target as Element).setPointerCapture?.(e.pointerId);
        start();
      },
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,
    },
    reset,
  };
}
