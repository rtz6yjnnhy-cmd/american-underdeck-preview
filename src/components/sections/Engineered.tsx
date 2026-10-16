"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { photos, systemSteps } from "@/lib/content";
import { duration, ease } from "@/lib/motion";

const DeckScene = dynamic(() => import("@/components/three/DeckScene"), {
  ssr: false,
  loading: () => null,
});

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Engineered() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const near = useInView(ref, { margin: "50% 0px 50% 0px" });
  const onStage = useInView(stageRef, { margin: "0px" });
  const [step, setStep] = useState(0);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.07, 0.15], [1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.15], [0, reduce ? 0 : -24]);
  const [gl, setGl] = useState<boolean | null>(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    setGl(hasWebGL());
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setStep(Math.min(systemSteps.length - 1, Math.floor(p * systemSteps.length * 0.9999)));
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + travel * ((i + 0.5) / systemSteps.length),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const current = systemSteps[step];

  return (
    <section
      ref={ref}
      id="system"
      aria-labelledby="system-title"
      className="theme-abyss relative h-[420svh] md:h-[520svh]"
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Stage */}
        <div className="absolute inset-0">
          {gl && near && (
            <DeckScene
              progress={scrollYProgress}
              active={onStage}
              narrow={narrow}
              reduceMotion={reduce}
            />
          )}
          {gl === false && (
            <Image
              src={photos.eveningLounge.src}
              alt={photos.eveningLounge.alt}
              fill
              sizes="100vw"
              className="object-cover opacity-60"
            />
          )}
        </div>

        {/* Legibility veils */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgb(11 30 51 / 0.85) 0%, rgb(11 30 51 / 0) 28%, rgb(11 30 51 / 0) 58%, rgb(11 30 51 / 0.9) 100%)",
          }}
        />

        <div className="container-page relative flex h-full flex-col pb-8 pt-24 md:pb-12 md:pt-32">
          <div className="flex items-start justify-between gap-6">
            <motion.h2
              id="system-title"
              style={{ opacity: titleOpacity, y: titleY }}
              className="type-campaign max-w-[12ch] text-3xl"
            >
              Engineered to transform.
            </motion.h2>
            <p className="hidden max-w-[28ch] pt-2 text-right text-xs text-muted md:block">
              Illustrative visualization. Not to scale and not an engineering drawing — every deck
              is assessed on site.
            </p>
          </div>

          <div className="mt-auto grid gap-6 md:grid-cols-12 md:items-end">
            {/* Visible step copy */}
            <div className="min-h-[176px] md:col-span-5 md:min-h-[200px]" aria-hidden>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -8, transition: { duration: duration.fast } }}
                  transition={{ duration: duration.base + 0.1, ease: ease.out }}
                >
                  <p className="tabular text-xs text-accent">
                    {String(step + 1).padStart(2, "0")} / {String(systemSteps.length).padStart(2, "0")}
                  </p>
                  <h3 className="type-wide mt-4 text-xl">{current.title}</h3>
                  <p className="mt-4 max-w-[44ch] text-base text-fg/80">{current.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Full sequence for assistive tech + step rail for everyone */}
            <ol className="sr-only">
              {systemSteps.map((s) => (
                <li key={s.title}>
                  {s.title}. {s.body}
                </li>
              ))}
            </ol>

            <nav aria-label="System steps" className="md:col-span-6 md:col-start-7">
              <ul className="flex gap-2">
                {systemSteps.map((s, i) => (
                  <li key={s.title} className="flex-1">
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === step ? "step" : undefined}
                      className="group flex w-full flex-col gap-2 py-3 text-left"
                    >
                      <span className="relative block h-[2px] w-full overflow-hidden bg-fg/15">
                        <span
                          className={`absolute inset-0 origin-left bg-accent transition-transform duration-500 ease-out ${
                            i <= step ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                      </span>
                      <span
                        className={`hidden text-xs transition-colors duration-200 lg:block ${
                          i === step ? "text-fg" : "text-muted group-hover:text-fg"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="sr-only lg:hidden">{s.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted md:hidden">
                Illustrative visualization — not to scale.
              </p>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
