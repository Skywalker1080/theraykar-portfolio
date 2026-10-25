"use client";

import { useEffect, useRef, useState } from "react";
import { StageGlyph } from "@/components/arch-diagram";
import { useInView, useLoopStep, useReducedMotion } from "./hooks";

const TICK_MS = 650;

type Case = { query: string; failAt?: number; verdict: string };

/* A query walking down a stack of guardrail checks, ticking each one. Cases alternate, so
   readers see one pass every layer and another get stopped at the layer that catches it. */
export function CheckStack({ checks, cases }: { checks: string[]; cases: Case[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Per case: one tick per check reached, then three ticks holding the verdict.
  const lengths = cases.map((c) => (c.failAt ?? checks.length) + 4);
  const total = lengths.reduce((a, b) => a + b, 0);
  const tick = useLoopStep(ref, total, TICK_MS);

  let caseIdx = 0;
  let step = reduced ? lengths[0] - 1 : tick;
  while (step >= lengths[caseIdx]) step -= lengths[caseIdx++];
  const c = cases[caseIdx];
  const stopAt = c.failAt ?? checks.length;
  const done = step > stopAt;

  return (
    <div ref={ref}>
      <div className="flex items-center gap-2 rounded-lg border border-[#ECECED] bg-white px-3 py-2">
        <span className="font-mono text-[12px] text-[#C026D3]">›</span>
        <span key={caseIdx} className="viz-type truncate font-mono text-[12px] text-[#111827]">{c.query}</span>
      </div>
      <ol className="mt-2 space-y-1">
        {checks.map((label, i) => {
          const state =
            i === c.failAt && step >= i ? "fail" : i < Math.min(step, stopAt) ? "pass" : i === step && step < stopAt ? "now" : "idle";
          return (
            <li key={label} className={`viz-check is-${state} flex items-center gap-2.5 rounded-md px-2 py-1 text-[13px]`}>
              <span className="viz-check-mark" aria-hidden="true">
                {state === "pass" ? "✓" : state === "fail" ? "✕" : ""}
              </span>
              <span>{label}</span>
            </li>
          );
        })}
      </ol>
      <p className={`mt-2 font-mono text-[12px] transition-opacity duration-300 ${done ? "opacity-100" : "opacity-0"} ${c.failAt === undefined ? "text-[#C026D3]" : "text-[#E11D48]"}`}>
        {c.failAt === undefined ? "✓ " : "✕ "}
        {c.verdict}
      </p>
    </div>
  );
}

/* A prompt file filling up with patch rules while its line count climbs. */
export function GrowingFile({ name, lines, size, rules }: { name: string; lines: number; size: string; rules: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const reduced = useReducedMotion();
  const [added, setAdded] = useState(0);

  useEffect(() => {
    if (!seen || reduced) return;
    const id = setInterval(() => setAdded((n) => (n >= rules.length ? n : n + 1)), 900);
    return () => clearInterval(id);
  }, [seen, reduced, rules.length]);

  const shown = reduced ? rules.length : added;
  const count = Math.round((lines * shown) / rules.length);
  const full = shown === rules.length;

  return (
    <div ref={ref} className="overflow-hidden rounded-lg border border-[#ECECED] bg-white">
      <div className="flex items-center justify-between border-b border-[#ECECED] px-3 py-2">
        <span className="font-mono text-[12px] font-semibold text-[#111827]">{name}</span>
        <span className="tabular font-mono text-[12px] text-[#6B7280]">
          {count} lines{full && <span className="text-[#C026D3]"> · {size}</span>}
        </span>
      </div>
      <div className="relative max-h-[188px] space-y-[5px] overflow-hidden px-3 py-3">
        {rules.slice(0, shown).map((rule, i) => (
          <div key={rule} className="viz-rule">
            {/* a few lines of earlier instructions above each new patch */}
            {[0, 1].map((k) => (
              <span key={k} className="mb-[5px] block h-[5px] rounded-full bg-[#F3F4F6]" style={{ width: `${55 + ((i * 17 + k * 23) % 40)}%` }} />
            ))}
            <p className="font-mono text-[11.5px] leading-snug text-[#C026D3]">+ {rule}</p>
          </div>
        ))}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white" />
      </div>
    </div>
  );
}

/* Decisions sliding, one at a time, from the model's side to deterministic code. */
export function Ratchet({ items }: { items: { label: string; when: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // One tick per item, then hold the finished state for four ticks before starting over.
  const tick = useLoopStep(ref, items.length + 5, 1100);
  const moved = reduced ? items.length : Math.min(tick, items.length);

  return (
    <div ref={ref} className="text-[13px]">
      <div className="grid grid-cols-2 gap-4 pb-2">
        <span className="inline-flex items-center gap-1.5 font-semibold text-[#111827]">
          <StageGlyph kind="agent" /> LLM decides
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold text-[#111827]">
          <StageGlyph kind="check" /> Code decides
        </span>
      </div>
      <ul className="relative space-y-1.5">
        <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px bg-[#ECECED]" />
        {items.map((item, i) => {
          const isMoved = i < moved;
          return (
            <li key={item.label} className="relative h-11 sm:h-8">
              <span className={`viz-chip ${isMoved ? "is-moved" : ""}`}>
                <span className="line-clamp-2 text-[12px] leading-tight sm:truncate sm:text-[13px]">{item.label}</span>
                <span className="ml-auto hidden shrink-0 font-mono text-[10.5px] text-[#9CA3AF] sm:inline">{item.when}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
