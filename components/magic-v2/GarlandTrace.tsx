'use client';

import React, { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface GarlandTraceProps {
  onComplete: () => void;
}

interface Point { x: number; y: number }

const ANCHOR_PCT = [8, 36, 64, 92];
const SAG = 70;
const SNAP_RADIUS = 42;
const FLAG_COLORS = ['#ff8fb1', '#f7d774', '#c9a6ff', '#7ce0c6'];

function bezierPoint(p0: Point, p1: Point, p2: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

function segmentPath(a: Point, b: Point, sag: number) {
  const ctrl = { x: (a.x + b.x) / 2, y: Math.max(a.y, b.y) + sag };
  const d = `M ${a.x} ${a.y} Q ${ctrl.x} ${ctrl.y} ${b.x} ${b.y}`;
  const flags: Point[] = [];
  const lights: Point[] = [];
  for (let i = 1; i <= 4; i++) flags.push(bezierPoint(a, b, ctrl, i / 5));
  for (let i = 1; i <= 3; i++) lights.push(bezierPoint(a, b, ctrl, i / 4));
  return { d, flags, lights };
}

export function GarlandTrace({ onComplete }: GarlandTraceProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 220 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState<Point | null>(null);
  const [snapPulse, setSnapPulse] = useState(false);

  const anchors: Point[] = ANCHOR_PCT.map((pct) => ({ x: (pct / 100) * size.w, y: size.h * 0.42 }));
  const totalSegments = anchors.length - 1;
  const done = activeIndex >= totalSegments;

  const measure = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    }
  }, []);

  React.useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const toLocal = (clientX: number, clientY: number): Point => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const finishSegment = () => {
    setDragging(false);
    setDragPos(null);
    setSnapPulse(true);
    setTimeout(() => setSnapPulse(false), 500);
    setActiveIndex((prev) => {
      const next = prev + 1;
      if (next >= totalSegments) setTimeout(onComplete, 500);
      return next;
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (done) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
    setDragPos(toLocal(e.clientX, e.clientY));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || done) return;
    const pos = toLocal(e.clientX, e.clientY);
    setDragPos(pos);
    const target = anchors[activeIndex + 1];
    const dist = Math.hypot(pos.x - target.x, pos.y - target.y);
    if (dist < SNAP_RADIUS) finishSegment();
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    setDragPos(null);
  };

  const start = anchors[activeIndex];
  const target = anchors[Math.min(activeIndex + 1, anchors.length - 1)];

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="mv2-no-select relative w-full h-[180px] sm:h-[220px] touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <svg className="absolute inset-0 w-full h-full" width={size.w} height={size.h}>
          {/* faint guide for the whole route */}
          <path
            d={`M ${anchors[0].x} ${anchors[0].y} ${anchors.slice(1).map((a) => `L ${a.x} ${a.y}`).join(' ')}`}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={2}
            strokeDasharray="4 8"
            fill="none"
          />

          {/* hung (completed) segments */}
          {anchors.slice(0, -1).map((a, i) => {
            if (i >= activeIndex) return null;
            const b = anchors[i + 1];
            const { d, flags, lights } = segmentPath(a, b, SAG);
            return (
              <g key={`hung-${i}`}>
                <path d={d} stroke="#5c3d1f" strokeWidth={5} fill="none" strokeLinecap="round" />
                <path d={d} stroke="#8a5a2b" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.8} />
                {flags.map((p, fi) => (
                  <polygon
                    key={fi}
                    points={`${p.x - 9},${p.y} ${p.x + 9},${p.y} ${p.x},${p.y + 20}`}
                    fill={FLAG_COLORS[(i + fi) % FLAG_COLORS.length]}
                    opacity={0.95}
                  />
                ))}
                {lights.map((p, li) => (
                  <circle
                    key={li}
                    cx={p.x}
                    cy={p.y}
                    r={4}
                    fill="#fff3c4"
                    className="mv2-star"
                    style={{ '--mv2-dur': `${2 + li}s`, '--mv2-delay': `${li * 0.3}s`, filter: 'drop-shadow(0 0 4px #f7d774)' } as React.CSSProperties}
                  />
                ))}
              </g>
            );
          })}

          {/* live segment being dragged */}
          {!done && dragging && dragPos && (
            <g>
              {(() => {
                const { d, flags } = segmentPath(start, dragPos, SAG * 0.6);
                return (
                  <>
                    <path d={d} stroke="#8a5a2b" strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.85} />
                    {flags.map((p, fi) => (
                      <polygon
                        key={fi}
                        points={`${p.x - 7},${p.y} ${p.x + 7},${p.y} ${p.x},${p.y + 15}`}
                        fill={FLAG_COLORS[fi % FLAG_COLORS.length]}
                        opacity={0.85}
                      />
                    ))}
                  </>
                );
              })()}
            </g>
          )}

          {/* start handle */}
          {!done && (
            <circle
              cx={start.x}
              cy={start.y}
              r={dragging ? 16 : 14}
              fill="#f7d774"
              stroke="#fff"
              strokeWidth={2}
              className={dragging ? '' : 'mv2-glow-ring'}
              style={{ cursor: 'grab', filter: 'drop-shadow(0 0 10px #f7d774)' }}
              onPointerDown={handlePointerDown}
            />
          )}

          {/* target hint ring */}
          {!done && (
            <circle
              cx={target.x}
              cy={target.y}
              r={snapPulse ? 26 : 18}
              fill="none"
              stroke="#c9a6ff"
              strokeWidth={2.5}
              opacity={snapPulse ? 0 : 0.7}
              style={{ transition: 'r 400ms ease, opacity 400ms ease' }}
            />
          )}
        </svg>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-[#e6d9ff]/70 text-xs sm:text-sm mt-1"
      >
        {done ? t('magicV2.garlandTrace.done') : t('magicV2.garlandTrace.instruction')}
      </motion.p>
    </div>
  );
}
