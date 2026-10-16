"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Like framer-motion's useReducedMotion, but returns false until after
 * hydration so server and first client render produce identical markup.
 * Transform animations are additionally neutralised by <MotionConfig
 * reducedMotion="user"> in the root providers.
 */
export function useReducedMotionSafe(): boolean {
  const prefers = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? !!prefers : false;
}
