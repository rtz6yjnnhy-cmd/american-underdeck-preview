"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import Image from "next/image";
import { useRef, useState } from "react";
import { LineReveal } from "@/components/motion/Reveal";
import { company, videos } from "@/lib/content";
import { duration, ease } from "@/lib/motion";

type Tab = "beforeAfter" | "reviews";

const tabs: { id: Tab; label: string; note: string }[] = [
  {
    id: "beforeAfter",
    label: "Before & after",
    note: "Short walk-throughs of finished projects, filmed on site.",
  },
  {
    id: "reviews",
    label: "Homeowner reviews",
    note: "Customers on camera, published on the company’s YouTube channel.",
  },
];

/** Thumbnail first; the YouTube player (privacy-enhanced) loads only on request. */
function Reel({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-[9/16] w-[64vw] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-[16px] bg-[rgb(17,40,64)] sm:w-[240px]">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
          title={`${title} — American Underdeck Systems`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0"
          aria-label={`Play video: ${title}`}
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            fill
            unoptimized
            sizes="280px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[rgb(11_30_51/0.75)] via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-sm text-white">
            <span>{title}</span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-[rgb(11,30,51)] transition-transform duration-150 ease-out group-active:scale-95">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M3.5 1.8v10.4L12 7z" fill="currentColor" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

export function Films() {
  const [tab, setTab] = useState<Tab>("beforeAfter");
  const reduce = useReducedMotionSafe();
  const rail = useRef<HTMLDivElement>(null);
  const list = videos[tab];

  const scrollBy = (dir: number) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="films" aria-labelledby="films-title" className="theme-abyss py-24 md:py-40">
      <div className="container-page">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <LineReveal
            id="films-title"
            lines={["Seen on", "site."]}
            className="type-campaign text-3xl md:col-span-6"
          />
          <div className="md:col-span-6 md:justify-self-end">
            <div role="tablist" aria-label="Video collections" className="inline-flex rounded-lg border border-fg/20 p-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  aria-controls="films-panel"
                  onClick={() => {
                    setTab(t.id);
                    rail.current?.scrollTo({ left: 0 });
                  }}
                  className={`relative min-h-[44px] rounded-md px-4 text-sm transition-colors duration-200 ${
                    tab === t.id ? "text-[rgb(11,30,51)]" : "text-fg/75 hover:text-fg"
                  }`}
                >
                  {tab === t.id && (
                    <motion.span
                      layoutId="films-tab"
                      className="absolute inset-0 rounded-md bg-[rgb(241,243,242)]"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">
                    {t.label} <span className="tabular opacity-60">{videos[t.id].length}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-[52ch] text-base text-muted">{tabs.find((t) => t.id === tab)?.note}</p>
      </div>

      <div id="films-panel" role="tabpanel" className="mt-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            ref={rail}
            initial={{ opacity: 0, x: reduce ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, transition: { duration: duration.fast } }}
            transition={{ duration: duration.slow, ease: ease.out }}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-4 [scrollbar-width:none] md:scroll-px-16 md:gap-6 md:px-16 xl:px-[max(4rem,calc((100vw-1360px)/2+4rem))] xl:scroll-px-[max(4rem,calc((100vw-1360px)/2+4rem))]"
          >
            {list.map((v) => (
              <Reel key={v.id} id={v.id} title={v.title} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container-page mt-6 flex items-center justify-between gap-6">
        <a
          href={company.social.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center text-sm text-fg/80 underline decoration-fg/30 underline-offset-[6px] hover:text-fg hover:decoration-fg"
        >
          All videos on YouTube
        </a>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="grid h-11 w-11 place-items-center rounded-lg border border-fg/25 hover:bg-white/10"
            aria-label="Scroll videos left"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="grid h-11 w-11 place-items-center rounded-lg border border-fg/25 hover:bg-white/10"
            aria-label="Scroll videos right"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
