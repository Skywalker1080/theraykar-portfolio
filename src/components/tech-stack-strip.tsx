"use client";

import { useEffect, useState } from "react";

type Tool = { name: string; logo: string; note: string };

const FIRST_POP_MS = 2500;
const GAP_MS = 8000; // quiet time between pops
const SHOW_MS = 3500; // how long a popped icon keeps its bubble

/* Tech stack icons in a two-row zig-zag (even columns top, odd columns bottom).
   Every so often one random icon pops and says what it does in the stack. */
export function TechStackStrip({ tools }: { tools: Tool[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    let last = -1;
    let timer: ReturnType<typeof setTimeout>;

    const pop = () => {
      let next = Math.floor(Math.random() * tools.length);
      if (next === last) next = (next + 1) % tools.length;
      last = next;
      setActive(next);
      timer = setTimeout(() => {
        setActive(null);
        timer = setTimeout(pop, GAP_MS);
      }, SHOW_MS);
    };

    timer = setTimeout(pop, FIRST_POP_MS);
    return () => clearTimeout(timer);
  }, [tools.length]);

  return (
    <ul
      aria-label="Tech stack"
      className="relative h-[84px] shrink-0 [--step:12px] sm:[--step:30px]"
      style={{ width: `calc(var(--step) * ${tools.length - 1} + 40px)` }}
    >
      {tools.map((t, i) => {
        const popped = active === i;
        // Bubbles for icons on the right half open leftwards so they stay on screen.
        const alignRight = i >= tools.length / 2;
        return (
          <li
            key={t.name}
            title={t.name}
            className={`absolute flex h-10 w-10 items-center justify-center ${popped ? "z-10" : ""}`}
            style={{ left: `calc(var(--step) * ${i})`, top: i % 2 === 0 ? 0 : 44 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.logo}
              alt={`${t.name} logo`}
              className={`stack-icon h-[22px] w-[22px] object-contain sm:h-8 sm:w-8 ${popped ? "is-popped" : ""}`}
            />
            <span
              role="status"
              aria-hidden={!popped}
              className={`stack-bubble ${alignRight ? "right-0" : "left-0"} ${popped ? "is-open" : ""}`}
            >
              {t.note}
              <span className={`stack-bubble-tail ${alignRight ? "right-[14px]" : "left-[14px]"}`} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
