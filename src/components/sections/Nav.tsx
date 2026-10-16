"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { company, nav } from "@/lib/content";
import { duration, ease } from "@/lib/motion";
import { Logo } from "@/components/ui/Logo";

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotionSafe();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 80));

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panel) {
        const items = Array.from(panel.querySelectorAll<HTMLElement>("a,button"));
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-300 ease-out ${
          solid && !open
            ? "bg-bg/90 text-fg shadow-[0_1px_0_rgb(var(--line)/0.08)] backdrop-blur-md"
            : "text-[rgb(241,243,242)]"
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between md:h-20">
          <Link href="#top" aria-label={`${company.name} — back to top`} className="rounded-lg">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative whitespace-nowrap py-2 text-sm opacity-80 transition-opacity duration-200 hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={company.phoneHref}
              className="tabular hidden min-h-[44px] items-center whitespace-nowrap text-sm opacity-80 transition-opacity hover:opacity-100 md:inline-flex"
            >
              {company.phone}
            </a>
            <Link
              href="#estimate"
              className={`type-wide hidden min-h-[44px] items-center whitespace-nowrap rounded-lg px-4 text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-200 sm:inline-flex ${
                solid && !open
                  ? "bg-brand text-brand-fg hover:bg-brand/90"
                  : "border border-white/40 hover:bg-white/10"
              }`}
            >
              Free estimate
            </Link>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="relative -mr-2 grid h-11 w-11 place-items-center rounded-lg xl:hidden"
            >
              <span
                className={`absolute h-px w-6 bg-current transition-transform duration-300 ease-out ${
                  open ? "rotate-45" : "-translate-y-1"
                }`}
              />
              <span
                className={`absolute h-px w-6 bg-current transition-transform duration-300 ease-out ${
                  open ? "-rotate-45" : "translate-y-1"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: duration.fast } }}
            transition={{ duration: duration.base, ease: ease.out }}
            className="theme-abyss fixed inset-0 z-40 flex flex-col px-6 pb-12 pt-24 xl:hidden"
          >
            <ul className="flex flex-col gap-2">
              {[...nav, { href: "#estimate", label: "Free estimate" }].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: duration.slow, ease: ease.out }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="type-campaign block py-2 text-[2.5rem] leading-none"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-2 text-sm text-muted">
              <a href={company.phoneHref} className="tabular text-lg text-fg">
                {company.phone}
              </a>
              <span>{company.location}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
