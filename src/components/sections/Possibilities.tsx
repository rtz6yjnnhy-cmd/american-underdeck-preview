"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import Image from "next/image";
import { useState } from "react";
import { LineReveal } from "@/components/motion/Reveal";
import { possibilities } from "@/lib/content";
import { duration, ease } from "@/lib/motion";

export function Possibilities() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotionSafe();
  const current = possibilities[active];

  return (
    <section aria-labelledby="living-title" className="py-24 md:py-40">
      <div className="container-page">
        <LineReveal
          id="living-title"
          lines={["An extension", "of your home."]}
          className="type-campaign text-3xl"
        />
        <p className="mt-8 max-w-[52ch] text-base text-muted">
          The space under your deck spans the same footprint as the deck above. Here is what
          homeowners do with it.
        </p>

        {/* Desktop: index on the left, one large frame on the right */}
        <div className="mt-16 hidden gap-6 lg:grid lg:grid-cols-12">
          <ul className="flex flex-col justify-center lg:col-span-5" role="tablist" aria-label="Ways to use the space">
            {possibilities.map((p, i) => (
              <li key={p.title} className="border-b border-line/15 first:border-t">
                <button
                  type="button"
                  role="tab"
                  id={`living-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="living-panel"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-baseline justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={`type-wide text-xl transition-[color,transform] duration-300 ease-out ${
                      i === active ? "translate-x-2 text-fg" : "text-fg/45 group-hover:text-fg/80"
                    }`}
                  >
                    {p.title}
                  </span>
                  <span
                    className={`max-w-[24ch] text-right text-sm text-muted transition-opacity duration-300 ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {p.body}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div
            id="living-panel"
            role="tabpanel"
            aria-labelledby={`living-tab-${active}`}
            className="relative aspect-[5/4] overflow-hidden rounded-[24px] lg:col-span-7"
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={current.photo.src}
                className="absolute inset-0"
                initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
                animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0.999, transition: { duration: duration.slow } }}
                transition={{ duration: duration.hero, ease: ease.out }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={reduce ? false : { scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.4, ease: ease.out }}
                >
                  <Image
                    src={current.photo.src}
                    alt={current.photo.alt}
                    fill
                    sizes="58vw"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile and tablet: a vertical sequence of large cards */}
        <ul className="mt-12 flex flex-col gap-12 lg:hidden">
          {possibilities.map((p) => (
            <li key={p.title}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[16px]">
                <Image src={p.photo.src} alt={p.photo.alt} fill sizes="100vw" className="object-cover" />
              </div>
              <h3 className="type-wide mt-4 text-xl">{p.title}</h3>
              <p className="mt-2 text-base text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
