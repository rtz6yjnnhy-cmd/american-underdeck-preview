"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { company, photos } from "@/lib/content";
import { duration, ease } from "@/lib/motion";

const slides = [
  { photo: photos.lakeside, position: "50% 40%" },
  { photo: photos.entertainer, position: "50% 60%" },
  { photo: photos.timberLodge, position: "50% 55%" },
];

const SLIDE_MS = 7000;

const lines = ["Reimagine the space", "beneath your deck."];

export function Hero() {
  const reduce = useReducedMotionSafe();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const autoplay = !paused && !reduce;

  useEffect(() => {
    if (!autoplay) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [index, autoplay]);

  const current = slides[index];

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="theme-abyss relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Photography */}
      <motion.div style={{ y: imageY }} className="absolute inset-0 -z-10">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: ease.inOut }}
          >
            <motion.div
              className="absolute inset-0"
              initial={reduce ? false : { scale: 1.12 }}
              animate={{ scale: 1.02 }}
              transition={{ duration: SLIDE_MS / 1000 + 1.6, ease: "linear" }}
            >
              <Image
                src={current.photo.src}
                alt={current.photo.alt}
                fill
                priority={index === 0}
                quality={85}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: current.position }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Dusk overlay: deep blue from the lower left, keeps the ceiling readable */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgb(11 30 51 / 0.6) 0%, rgb(11 30 51 / 0.08) 26%, rgb(11 30 51 / 0.45) 52%, rgb(11 30 51 / 0.94) 100%), linear-gradient(90deg, rgb(11 30 51 / 0.6) 0%, rgb(11 30 51 / 0.1) 70%)",
        }}
      />

      <motion.div
        style={{ y: copyY, opacity: fade }}
        className="container-page relative mt-auto pb-12 pt-32 md:pb-16"
      >
        <h1 className="type-campaign text-[clamp(2.5rem,0.6rem+4.6vw,5.75rem)]">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: duration.hero + 0.2, ease: ease.out, delay: 0.25 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end">
          {/* Same entrance as the approved version (fade + 12px rise, 0.6s, 0.8s
              delay) from 768px up; on phones it only rises, so it paints on the
              first frame — it is the mobile LCP element. See .hero-sub in globals.css. */}
          <p className="hero-sub max-w-[30ch] text-lg text-fg/85 md:col-span-5">
            Transform unused space into extraordinary outdoor living.
          </p>

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.out, delay: 0.95 }}
            className="flex flex-col gap-4 sm:flex-row md:col-span-7 md:justify-end"
          >
            <ButtonLink href="#work" className="!bg-[rgb(241,243,242)] !text-[rgb(11,30,51)] hover:!bg-white">
              Explore our work
            </ButtonLink>
            <ButtonLink href="#estimate" variant="ghost" className="!border-white/40 hover:!bg-white/10">
              Get a free estimate
            </ButtonLink>
          </motion.div>
        </div>

        {/* Slide meta + controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.slow, delay: 1.2 }}
          className="mt-12 flex items-center gap-6 border-t border-fg/15 pt-4 text-xs text-fg/70 md:mt-16"
        >
          <span className="tabular w-12">
            {String(index + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
          </span>
          <span className="hidden min-w-0 flex-1 truncate sm:block" aria-live="polite">
            {current.photo.caption} — a completed American Underdeck project
          </span>
          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            {slides.map((s, i) => (
              <button
                key={s.photo.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}: ${s.photo.caption}`}
                aria-current={i === index}
                className="group grid h-11 w-10 place-items-center"
              >
                <span className="relative block h-px w-8 overflow-hidden bg-fg/25">
                  {i === index && (
                    <motion.span
                      key={`${index}-${autoplay}`}
                      className="absolute inset-y-0 left-0 w-full origin-left bg-fg"
                      initial={{ scaleX: autoplay ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: autoplay ? SLIDE_MS / 1000 : 0, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            ))}
            {!reduce && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="ml-2 grid h-11 w-11 place-items-center rounded-lg hover:bg-white/10"
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              >
                {paused ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                    <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                    <path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" />
                  </svg>
                )}
              </button>
            )}
          </div>
          <span className="hidden lg:block">Serving homeowners from {company.location}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
