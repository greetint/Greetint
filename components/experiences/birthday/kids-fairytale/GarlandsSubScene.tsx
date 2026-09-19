'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GarlandsProps { deviceType: 'desktop' | 'phone'; isMuted: boolean; onComplete: () => void; }

interface GarlandDef {
  x1: number;
  x2: number;
  y: number;
  sag: number;
}

interface Lamp {
  id: string;
  x: number;
  y: number;
  color: string;
  garlandIdx: number;
  order: number;
}

const VIEW_W = 1000;
const VIEW_H = 400;
const LAMP_COUNT = 9;
const LAMP_COLORS = ['#fde68a', '#f9a8d4', '#fbbf24', '#c4b5fd'];

// Solves the catenary constant `a` for a symmetric span/sag pair via bisection
// (cosh has no closed-form inverse here), then samples the curve into points.
function catenaryPoints(x1: number, x2: number, y: number, sag: number, samples: number) {
  const halfSpan = (x2 - x1) / 2;
  let lo = 0.001;
  let hi = halfSpan * 50;
  for (let i = 0; i < 40; i++) {
    const a = (lo + hi) / 2;
    const dip = a * (Math.cosh(halfSpan / a) - 1);
    if (dip > sag) lo = a; else hi = a;
  }
  const a = (lo + hi) / 2;
  const midX = (x1 + x2) / 2;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = x1 + (x2 - x1) * (i / samples);
    const dip = a * (Math.cosh((x - midX) / a) - 1);
    pts.push({ x, y: y + dip });
  }
  return pts;
}

// Smooths a point list into a quadratic-bezier SVG path (through midpoints)
// so the catenary reads as a soft rope instead of a faceted polyline.
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} `;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const midX = (prev.x + cur.x) / 2;
    const midY = (prev.y + cur.y) / 2;
    d += `Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)} `;
  }
  const last = pts[pts.length - 1];
  d += `L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return d;
}

export function GarlandsSubScene({ deviceType, isMuted, onComplete }: GarlandsProps) {
  const [prog, setProg] = useState(0);
  const [lit, setLit] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const traced = useRef<Set<string>>(new Set());
  const audio = useRef<HTMLAudioElement | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    audio.current = new Audio('/audio/kids-fairytale/stage2_voice_part1.mp3');
    audio.current.muted = isMuted; audio.current.play().catch(() => {});
    return () => { if (audio.current) audio.current.pause(); };
  }, []);

  useEffect(() => { if (audio.current) audio.current.muted = isMuted; }, [isMuted]);

  const garlands: GarlandDef[] = useMemo(() => ([
    { x1: 40, x2: VIEW_W * 0.46, y: VIEW_H * 0.28, sag: 70 },
    { x1: VIEW_W * 0.54, x2: VIEW_W - 40, y: VIEW_H * 0.28, sag: 70 },
  ]), []);

  const garlandCurves = useMemo(
    () => garlands.map((g) => catenaryPoints(g.x1, g.x2, g.y, g.sag, 40)),
    [garlands]
  );

  const lamps: Lamp[] = useMemo(() => {
    const all: Lamp[] = [];
    garlandCurves.forEach((curve, gi) => {
      for (let i = 1; i <= LAMP_COUNT; i++) {
        const t = i / (LAMP_COUNT + 1);
        const idx = Math.round(t * (curve.length - 1));
        const pt = curve[idx];
        all.push({ id: `${gi}-${i}`, x: pt.x, y: pt.y, color: LAMP_COLORS[i % LAMP_COLORS.length], garlandIdx: gi, order: i });
      }
    });
    return all;
  }, [garlandCurves]);

  // Lights the touched lamp plus its next couple of neighbors along the same
  // garland, each with a small extra delay, so the glow cascades outward
  // from the finger instead of every lamp snapping on at once.
  const igniteWave = (startId: string) => {
    const startLamp = lamps.find((l) => l.id === startId);
    if (!startLamp) return;
    const sameGarland = lamps.filter((l) => l.garlandIdx === startLamp.garlandIdx).sort((a, b) => a.order - b.order);
    const startIdx = sameGarland.findIndex((l) => l.id === startId);

    sameGarland.slice(startIdx, startIdx + 3).forEach((lamp, offset) => {
      if (traced.current.has(lamp.id)) return;
      traced.current.add(lamp.id);
      setTimeout(() => {
        setLit((prev) => new Set(prev).add(lamp.id));
        const cov = Math.min((traced.current.size / (lamps.length * 0.75)) * 100, 100);
        setProg(cov);

        if (cov >= 90 && !completedRef.current) {
          completedRef.current = true;
          if (audio.current) audio.current.pause();
          audio.current = new Audio('/audio/kids-fairytale/stage2_voice_part2.mp3');
          audio.current.muted = isMuted; audio.current.play().catch(() => {});
          setTimeout(onComplete, 1000);
        }
      }, offset * 90);
    });
  };

  const trace = (clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * VIEW_W;
    const y = ((clientY - rect.top) / rect.height) * VIEW_H;
    let closest: string | null = null;
    let minDist = 40;
    lamps.forEach((l) => {
      const d = Math.hypot(l.x - x, l.y - y);
      if (d < minDist) { minDist = d; closest = l.id; }
    });
    if (closest && !traced.current.has(closest)) {
      igniteWave(closest);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={(e) => trace(e.clientX, e.clientY)}
        onTouchMove={(e) => e.touches.length > 0 && trace(e.touches[0].clientX, e.touches[0].clientY)}
        className="absolute inset-0 z-20 cursor-crosshair touch-none"
      >
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" className="w-full h-full">
          {garlands.map((g, gi) => (
            <motion.g
              key={gi}
              style={{ originX: gi === 0 ? 0 : 1, originY: 0 }}
              animate={{ rotate: gi === 0 ? [-1.5, 1.5, -1.5] : [1.5, -1.5, 1.5] }}
              transition={{ duration: 4.5 + gi * 0.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                d={smoothPath(garlandCurves[gi])}
                fill="none"
                stroke="rgba(120,72,20,0.65)"
                strokeWidth={4}
                strokeLinecap="round"
              />
              {lamps.filter((l) => l.garlandIdx === gi).map((l) => (
                <circle
                  key={l.id}
                  cx={l.x}
                  cy={l.y}
                  r={lit.has(l.id) ? 12 : 7}
                  fill={lit.has(l.id) ? l.color : 'rgba(120,72,20,0.75)'}
                  style={{
                    filter: lit.has(l.id) ? `drop-shadow(0 0 8px ${l.color})` : 'none',
                    transition: 'r 0.25s ease, fill 0.25s ease, filter 0.25s ease',
                  }}
                />
              ))}
            </motion.g>
          ))}
        </svg>
      </div>
      <div className="absolute top-8 left-0 right-0 text-center z-30 pointer-events-none">
        <p className="font-serif italic text-xl md:text-3xl text-amber-200 drop-shadow">✨ Прокарай пръстче по гирляндите ({Math.round(prog)}%)</p>
      </div>
    </>
  );
}
