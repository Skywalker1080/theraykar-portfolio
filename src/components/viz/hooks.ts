"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

/* True once the element has scrolled into view (and stays true), so one-shot animations
   play when the reader reaches them instead of on page load. */
export function useInView(ref: RefObject<Element | null>, threshold = 0.35) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, threshold]);
  return seen;
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/* A step counter that ticks every `ms` while the element is visible and wraps after `length`. */
export function useLoopStep(ref: RefObject<Element | null>, length: number, ms: number) {
  const seen = useInView(ref);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const id = setInterval(() => setStep((s) => (s + 1) % length), ms);
    return () => clearInterval(id);
  }, [seen, length, ms]);
  return step;
}
