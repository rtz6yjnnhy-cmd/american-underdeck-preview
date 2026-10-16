"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { useState } from "react";
import { LineReveal } from "@/components/motion/Reveal";
import { finishes } from "@/lib/content";
import { duration, ease } from "@/lib/motion";

const available = finishes.filter((f) => !f.suspended);
const suspended = finishes.filter((f) => f.suspended);

function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function Finishes() {
  const [selected, setSelected] = useState(available[0]);
  const reduce = useReducedMotionSafe();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rz = useSpring(useTransform(mx, [-1, 1], [-14, -2]), { stiffness: 120, damping: 20 });
  const rx = useSpring(useTransform(my, [-1, 1], [62, 52]), { stiffness: 120, damping: 20 });
  const light = luminance(selected.hex) > 0.35;

  return (
    <section id="finishes" aria-labelledby="finishes-title" className="relative overflow-hidden bg-surface py-24 md:py-40">
      <div className="container-page grid gap-16 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-5">
          <LineReveal
            id="finishes-title"
            lines={["Colors &", "finishes."]}
            className="type-campaign text-3xl"
          />
          <p className="mt-8 max-w-[44ch] text-base text-muted">
            Traditional painted aluminum, in the colors offered on the American Underdeck color
            chart. Choose one to see it on the ceiling.
          </p>

          <fieldset className="mt-12">
            <legend className="text-sm text-fg">Available now</legend>
            <div className="mt-4 grid grid-cols-6 gap-2 sm:gap-3">
              {available.map((f) => {
                const isOn = f.name === selected.name;
                return (
                  <label key={f.name} className="relative block cursor-pointer">
                    <input
                      type="radio"
                      name="finish"
                      value={f.name}
                      checked={isOn}
                      onChange={() => setSelected(f)}
                      className="peer sr-only"
                    />
                    <span
                      className="block aspect-square rounded-lg shadow-[inset_0_0_0_1px_rgb(22_30_38/0.12)] transition-shadow duration-200 ease-out hover:shadow-[inset_0_0_0_1px_rgb(22_30_38/0.12),0_0_0_2px_rgb(22_30_38/0.25)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
                      style={{ backgroundColor: f.hex }}
                    />
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute -bottom-2 left-1/2 h-[2px] w-1/2 -translate-x-1/2 bg-fg transition-transform duration-300 ease-out ${
                        isOn ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                    <span className="sr-only">{f.name}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <details className="group mt-12 border-t border-line/15 pt-6">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between text-sm text-fg">
              Temporarily suspended colors ({suspended.length})
              <span aria-hidden className="text-muted transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 max-w-[48ch] text-sm text-muted">
              Due to industry-wide supply shortages, these colors are temporarily suspended until
              further notice.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-muted sm:grid-cols-3">
              {suspended.map((f) => (
                <li key={f.name} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-4 w-4 shrink-0 rounded-[4px] opacity-60 shadow-[inset_0_0_0_1px_rgb(22_30_38/0.12)]"
                    style={{ backgroundColor: f.hex }}
                  />
                  {f.name}
                </li>
              ))}
            </ul>
          </details>
        </div>

        {/* The panel */}
        <div className="lg:col-span-7">
          <div
            className="relative aspect-[5/4] overflow-hidden rounded-[24px] bg-[rgb(11,30,51)] [perspective:1100px]"
            onPointerMove={(e) => {
              if (reduce || e.pointerType !== "mouse") return;
              const r = e.currentTarget.getBoundingClientRect();
              mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
              my.set(((e.clientY - r.top) / r.height) * 2 - 1);
            }}
            onPointerLeave={() => {
              mx.set(0);
              my.set(0);
            }}
          >
            <motion.div
              aria-hidden
              className="absolute left-1/2 top-[42%] h-[60%] w-[70%] [transform-style:preserve-3d]"
              style={{ x: "-50%", y: "-50%", rotateX: rx, rotateZ: rz }}
            >
              {/* Ceiling panel */}
              <div
                className="absolute inset-0 rounded-[6px] transition-[background-color] duration-500 ease-out"
                style={{
                  backgroundColor: selected.hex,
                  backgroundImage: `repeating-linear-gradient(90deg, rgb(0 0 0 / ${light ? 0.12 : 0.28}) 0 2px, rgb(255 255 255 / ${light ? 0.5 : 0.1}) 2px 3px, transparent 3px 40px), linear-gradient(180deg, rgb(255 255 255 / 0.18), rgb(0 0 0 / 0.25))`,
                  boxShadow: "0 40px 80px rgb(0 0 0 / 0.45)",
                }}
              />
              {/* Gutter along the front edge */}
              <div
                className="absolute -bottom-[4%] left-0 h-[7%] w-full rounded-[4px] transition-[background-color] duration-500 ease-out [transform:rotateX(-90deg)] [transform-origin:top]"
                style={{
                  backgroundColor: selected.hex,
                  backgroundImage: "linear-gradient(180deg, rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.35))",
                }}
              />
            </motion.div>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-gradient-to-t from-[rgb(11_30_51/0.85)] to-transparent p-6 pt-16 text-[rgb(236,240,242)] md:p-8 md:pt-24">
              <div aria-live="polite">
                <p className="text-xs text-white/70">Selected finish</p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={selected.name}
                    className="type-campaign-strong mt-2 text-2xl"
                    initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -6, transition: { duration: duration.fast } }}
                    transition={{ duration: duration.base, ease: ease.out }}
                  >
                    {selected.name}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="max-w-[22ch] text-right text-xs text-white/60">
                On-screen colors are approximate. Illustrative panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
