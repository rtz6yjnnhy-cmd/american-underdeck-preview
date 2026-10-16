"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { LineReveal } from "@/components/motion/Reveal";
import { galleryOrder } from "@/lib/content";
import { duration, ease, spring } from "@/lib/motion";

// Editorial spans per position — large photographs get the room.
const spans = [
  "md:col-span-8 aspect-[16/10]",
  "md:col-span-4 aspect-[4/5] md:aspect-auto",
  "md:col-span-5 aspect-[4/3]",
  "md:col-span-7 aspect-[16/10] md:aspect-auto",
  "md:col-span-4 aspect-[4/5]",
  "md:col-span-8 aspect-[16/10] md:aspect-auto",
  "md:col-span-4 aspect-square",
  "md:col-span-4 aspect-square",
  "md:col-span-4 aspect-square",
];

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotionSafe();
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen((i) => {
      if (i !== null) requestAnimationFrame(() => triggerRefs.current[i]?.focus());
      return null;
    });
  }, []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + galleryOrder.length) % galleryOrder.length)),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const items = Array.from(
          document.querySelectorAll<HTMLElement>('[data-lightbox] button'),
        );
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  const photo = open !== null ? galleryOrder[open] : null;

  return (
    <section id="work" aria-labelledby="work-title" className="py-24 md:py-40">
      <div className="container-page">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <LineReveal
            id="work-title"
            lines={["Spaces", "redefined."]}
            className="type-campaign text-display md:col-span-8"
          />
          <p className="max-w-[40ch] text-base text-muted md:col-span-4">
            Completed American Underdeck projects, photographed as built. Select any image to view
            it larger.
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-4 md:mt-24 md:grid-cols-12 md:gap-6">
          {galleryOrder.map((p, i) => (
            <li key={p.src} className={`relative ${spans[i]}`}>
              <button
                ref={(el) => {
                  triggerRefs.current[i] = el;
                }}
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View larger: ${p.caption}`}
                className="group absolute inset-0 overflow-hidden rounded-[16px] bg-graphite/10"
              >
                <motion.div layoutId={reduce ? undefined : `photo-${p.src}`} className="absolute inset-0">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes={i < 6 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </motion.div>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[rgb(11_30_51/0.7)] to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <span className="absolute bottom-4 left-4 translate-y-2 text-sm text-white opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:bottom-6 md:left-6">
                  {p.caption}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {photo && open !== null && (
          <motion.div
            key="lightbox"
            data-lightbox
            role="dialog"
            aria-modal="true"
            aria-label={photo.caption}
            className="fixed inset-0 z-[60] flex flex-col bg-[rgb(11_30_51/0.96)] text-[rgb(236,240,242)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: duration.fast } }}
            transition={{ duration: duration.base, ease: ease.out }}
          >
            <div className="flex items-center justify-between px-6 py-4 md:px-12">
              <p className="tabular text-sm opacity-80">
                {String(open + 1).padStart(2, "0")} / {String(galleryOrder.length).padStart(2, "0")}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="grid h-11 w-11 place-items-center rounded-lg hover:bg-white/10"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                  <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>

            <div className="relative flex-1 px-4 md:px-24">
              <motion.div
                layoutId={reduce ? undefined : `photo-${photo.src}`}
                transition={spring}
                className="relative mx-auto h-full w-full max-w-[1400px]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="100vw"
                  quality={90}
                  className="object-contain"
                />
              </motion.div>
            </div>

            <div className="flex items-center justify-between gap-4 px-6 py-6 md:px-12">
              <p className="max-w-[60ch] text-sm opacity-80">
                <span className="text-white">{photo.caption}.</span> {photo.alt}.
              </p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="grid h-11 w-11 place-items-center rounded-lg border border-white/25 hover:bg-white/10"
                  aria-label="Previous photo"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="grid h-11 w-11 place-items-center rounded-lg border border-white/25 hover:bg-white/10"
                  aria-label="Next photo"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
