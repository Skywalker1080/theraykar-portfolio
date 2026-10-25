"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "./hooks";
import { withArrows } from "./arrow";

/* The shared shell for every blog visualization: a borderless, faintly tinted panel,
   a mono pink label, and a muted caption. */
export function Viz({ label, caption, children }: { label?: string; caption?: string; children: ReactNode }) {
  return (
    <figure className="viz my-8 rounded-xl bg-[#FCFCFD] px-4 pb-4 pt-3 sm:px-5">
      {label && (
        <p className="mb-3 font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#C026D3]">{withArrows(label)}</p>
      )}
      {children}
      {caption && <figcaption className="mt-3 text-[12.5px] leading-snug text-[#9CA3AF]">{caption}</figcaption>}
    </figure>
  );
}

/* Marks its children with data-inview once they scroll into view; CSS keys one-shot
   transitions (bars filling, dots fading) off that attribute. */
export function InView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  return (
    <div ref={ref} className={className} data-inview={seen ? "" : undefined}>
      {children}
    </div>
  );
}
