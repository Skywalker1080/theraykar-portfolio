"use client";

import { useEffect, useState } from "react";

const STAGES = [
  { label: "Data Engineering", note: "Pipelines & context for agents", op: "data", status: "ingesting rows" },
  { label: "Backends", note: "APIs & agent runtimes", op: "build", status: "POST /agent 200" },
  { label: "Evals", note: "Quality checks & guardrails", op: "eval", status: "12/12 passed" },
  { label: "Cloud Deploys", note: "Shipping & scaling to prod", op: "deploy", status: "live" },
] as const;

const STEP_MS = 2400; // time each stage spends "working" before handing off

/* The four areas of the AI engineering work as one pipeline. One stage is active at a
   time and plays a tiny operation (rows streaming, blocks building, checks ticking,
   a deploy bar filling), then hands off to the next. */
export function FocusPipeline() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % STAGES.length), STEP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <ol aria-label="What I work on" className="relative mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
      {STAGES.map((s, i) => {
        const state = i === active ? "is-active" : i < active ? "is-done" : "";
        return (
          <li key={s.label} className={`op-stage ${state}`}>
            {/* Remount the active stage's visual so its animation replays on each pass */}
            <span key={i === active ? `on-${active}` : "off"} className={`op-viz op-${s.op}`} aria-hidden="true">
              {s.op === "data" && [0, 1, 2].map((r) => <i key={r} style={{ animationDelay: `${r * 0.25}s` }} />)}
              {s.op === "build" && [0, 1, 2].map((r) => <i key={r} style={{ animationDelay: `${r * 0.3}s` }} />)}
              {s.op === "eval" && [0, 1, 2].map((r) => <i key={r} style={{ animationDelay: `${r * 0.35}s` }}>✓</i>)}
              {s.op === "deploy" && <i />}
            </span>
            <span className="mt-3 block text-[15px] font-semibold tracking-[-0.01em] text-[#111827]">
              {s.label}
            </span>
            <span className="block text-[13px] leading-snug text-[#9CA3AF]">{s.note}</span>
            <span className="op-status mt-1 block font-mono text-[11px] text-[#C026D3]">
              {s.op === "deploy" ? "● " : "› "}
              {s.status}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
