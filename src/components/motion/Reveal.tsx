"use client";

import { motion, useInView } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { useRef, type ReactNode } from "react";
import { duration, ease } from "@/lib/motion";

/** Masked line reveal for headlines: each line rises out of its own clip. */
export function LineReveal({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
  id,
}: {
  id?: string;
  lines: string[];
  as?: "h2" | "h3" | "p";
  className?: string;
  delay?: number;
}) {
  // Reduced motion: MotionConfig (reducedMotion="user") makes the rise instant.
  // Observe the heading itself: the line spans start clipped by their mask,
  // so an observer on them would never report them as visible.
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{ duration: duration.hero, ease: ease.out, delay: delay + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Quiet fade for supporting content. Used sparingly. */
export function Fade({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: duration.slow, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
