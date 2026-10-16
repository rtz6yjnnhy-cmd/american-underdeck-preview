"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { LineReveal } from "@/components/motion/Reveal";
import { beforeAfterPairs } from "@/lib/content";
import { duration, ease } from "@/lib/motion";

// Each source image holds one project: "before" in the left half, "after" in
// the right half. We crop each half with an oversized inner frame.
function Half({ src, side, sizes }: { src: string; side: "before" | "after"; sizes: string }) {
  return (
    <div className={`absolute inset-y-0 w-[200.8%] ${side === "before" ? "left-0" : "right-0"}`}>
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" draggable={false} />
    </div>
  );
}

export function BeforeAfter() {
  const [active, setActive] = useState(8); // pair 10 — same vantage point before and after
  const [pos, setPos] = useState(50);
  const reduce = useReducedMotionSafe();
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const pair = beforeAfterPairs[active];

  const fromPointer = useCallback((clientX: number) => {
    const r = frame.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <section aria-labelledby="ba-title" className="theme-abyss relative overflow-hidden py-24 md:py-40">
      <div className="container-page">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <LineReveal
            id="ba-title"
            lines={["Before", "& after."]}
            className="type-campaign text-3xl md:col-span-7"
          />
          <p className="max-w-[44ch] text-base text-muted md:col-span-5">
            The same projects, photographed before and after the work. Drag the divider — or use
            the arrow keys — to compare.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 lg:grid-cols-12 lg:gap-6">
          <div
            ref={frame}
            className="relative aspect-[51/38] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[16px] bg-surface lg:col-span-8 lg:rounded-[24px]"
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              fromPointer(e.clientX);
            }}
            onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={pair.src}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : duration.slow, ease: ease.inOut }}
              >
                {/* After (base layer) */}
                <div className="absolute inset-0 overflow-hidden" role="img" aria-label="After the under deck system">
                  <Half src={pair.src} side="after" sizes="(min-width: 1024px) 110vw, 200vw" />
                </div>
                {/* Before (clipped) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                  role="img"
                  aria-label="Before the under deck system"
                >
                  <Half src={pair.src} side="before" sizes="(min-width: 1024px) 110vw, 200vw" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Divider */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-px bg-white/90"
              style={{ left: `${pos}%` }}
            >
              <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[rgb(241,243,242)] text-[rgb(11,30,51)] shadow-[0_8px_24px_rgb(11_30_51/0.35)]">
                <svg width="20" height="12" viewBox="0 0 20 12" aria-hidden>
                  <path d="M6 1L1 6l5 5M14 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </span>
            </div>

            <span className="pointer-events-none absolute bottom-4 left-4 rounded-lg bg-[rgb(11_30_51/0.7)] px-3 py-1 text-xs text-white backdrop-blur-sm">
              Before
            </span>
            <span className="pointer-events-none absolute bottom-4 right-4 rounded-lg bg-[rgb(241_243_242/0.9)] px-3 py-1 text-xs text-[rgb(11,30,51)]">
              After
            </span>

            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(pos)}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Compare before and after"
              aria-valuetext={`${Math.round(pos)}% before`}
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              onPointerDown={(e) => e.preventDefault()}
              tabIndex={0}
            />
          </div>

          {/* Project picker */}
          <div className="min-w-0 lg:col-span-4">
          <p className="tabular text-xs text-muted">
            Project {String(active + 1).padStart(2, "0")} of {beforeAfterPairs.length}
          </p>
          <ul
            className="-mx-6 mt-4 flex snap-x gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0"
            aria-label="Choose a project"
          >
            {beforeAfterPairs.map((p, i) => (
              <li key={p.id} className="snap-start">
                <button
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setPos(50);
                  }}
                  aria-label={`Project ${i + 1}`}
                  aria-pressed={i === active}
                  className={`relative block aspect-[51/38] w-24 overflow-hidden rounded-lg transition-[opacity,outline-color] duration-200 lg:w-full ${
                    i === active
                      ? "opacity-100 outline outline-2 outline-offset-2 outline-accent"
                      : "opacity-50 hover:opacity-90"
                  }`}
                >
                  <Half src={p.src} side="after" sizes="96px" />
                </button>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
