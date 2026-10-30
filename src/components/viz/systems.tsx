"use client";

import { useRef, useState } from "react";
import { InView } from "./frame";
import { useLoopStep, useReducedMotion } from "./hooks";

/* Visualizations for system-design posts: a burst of requests hitting a server directly vs.
   through a queue, and a bottleneck that moves every time you add a component. Same parts as
   the rest of components/viz. */

type Tick = { served: number; extra: number };

/* Replays one burst of arrivals twice. Straight to the server, anything over capacity in a
   tick is dropped. Through a queue, the overflow waits and the worker drains it at its own
   pace, so nothing is lost and the work just finishes later. */
export function BurstQueue({ arrivals, capacity }: { arrivals: number[]; capacity: number }) {
  const direct: Tick[] = arrivals.map((a) => ({ served: Math.min(a, capacity), extra: Math.max(a - capacity, 0) }));

  const queued: Tick[] = [];
  let backlog = 0;
  for (let t = 0; t < arrivals.length || backlog > 0; t++) {
    backlog += arrivals[t] ?? 0;
    const served = Math.min(backlog, capacity);
    backlog -= served;
    queued.push({ served, extra: backlog });
  }

  const ticks = Math.max(direct.length, queued.length);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const step = useLoopStep(ref, ticks + 4, 650);
  const shown = reduced ? ticks : Math.min(step + 1, ticks);
  const tallest = Math.max(...direct.map((d) => d.served + d.extra), ...queued.map((q) => q.served + q.extra));

  const dropped = direct.slice(0, shown).reduce((n, d) => n + d.extra, 0);
  const done = queued.slice(0, shown).reduce((n, q) => n + q.served, 0);
  const total = arrivals.reduce((n, a) => n + a, 0);

  const panels = [
    { title: "Straight to the server", rows: direct, mode: "drop" as const },
    { title: "Through a queue", rows: queued, mode: "wait" as const },
  ];

  return (
    <div ref={ref} className="grid gap-5 sm:grid-cols-2">
      {panels.map((p) => (
        <div key={p.title}>
          <p className="mb-2 text-[13px] font-semibold text-[#111827]">{p.title}</p>
          <div className="relative flex items-end gap-[3px] border-b border-[#E5E7EB]" style={{ height: tallest * 9 + 4 }}>
            {/* capacity line: what the server or worker can handle per tick */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 border-t border-dashed border-[#C026D3]"
              style={{ bottom: capacity * 9 }}
            />
            {Array.from({ length: ticks }, (_, t) => {
              const r = p.rows[t] ?? { served: 0, extra: 0 };
              return (
                <span key={t} className={`bq-col flex flex-1 flex-col-reverse gap-[2px] ${t < shown ? "is-on" : ""}`}>
                  {Array.from({ length: r.served }, (_, i) => (
                    <i key={`s${i}`} className={`bq-unit ${p.mode === "drop" ? "bq-served" : "bq-done"}`} />
                  ))}
                  {Array.from({ length: r.extra }, (_, i) => (
                    <i key={`e${i}`} className={`bq-unit ${p.mode === "drop" ? "bq-dropped" : "bq-waiting"}`} />
                  ))}
                </span>
              );
            })}
          </div>
          <p className={`mt-2 font-mono text-[12px] ${p.mode === "drop" && dropped ? "text-[#E11D48]" : "text-[#C026D3]"}`}>
            {p.mode === "drop"
              ? dropped
                ? `✕ ${dropped} of ${total} requests dropped`
                : "✓ nothing dropped yet"
              : done === total
                ? `✓ ${total} of ${total} done, 0 dropped`
                : `${done} of ${total} done, the rest wait in line`}
          </p>
        </div>
      ))}
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#9CA3AF] sm:col-span-2">
        <span className="inline-flex items-center gap-1.5"><i className="bq-unit bq-done is-key" /> handled</span>
        <span className="inline-flex items-center gap-1.5"><i className="bq-unit bq-waiting is-key" /> waiting in the queue</span>
        <span className="inline-flex items-center gap-1.5"><i className="bq-unit bq-dropped is-key" /> dropped</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 border-t border-dashed border-[#C026D3]" /> capacity per tick</span>
      </p>
    </div>
  );
}

type Load = { name: string; value: number };
type Stage = { title: string; note: string; load: Load[] };

const SCALE = 150; // bars are drawn against 150% so an overloaded component visibly runs past the limit

/* One system, a few stages of growth. Each stage shows how loaded every component is; the one
   past its limit is the bottleneck. Adding the fix for it moves the bottleneck somewhere else.
   Plays on its own, and a click pins a stage. */
export function BottleneckWalk({ stages }: { stages: Stage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const auto = useLoopStep(ref, stages.length, 3200);
  const [picked, setPicked] = useState<number | null>(null);
  const cur = picked ?? (reduced ? 0 : auto);
  const stage = stages[cur];
  const hottest = stage.load.reduce((a, b) => (b.value > a.value ? b : a));

  // Every component that appears in any stage keeps its row, so bars don't jump around. Rows
  // follow the last (fullest) stage's order, which is the order a request travels.
  const names = [...new Set([...stages].reverse().flatMap((s) => s.load.map((l) => l.name)))];

  return (
    <div ref={ref}>
      <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Stages">
        {stages.map((s, i) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            aria-selected={i === cur}
            onClick={() => setPicked(i)}
            className={`bw-step rounded-md border px-2 py-1 font-mono text-[11px] ${i === cur ? "is-on" : ""}`}
          >
            {String(i + 1).padStart(2, "0")} · {s.title}
          </button>
        ))}
      </div>
      <InView className="space-y-2.5">
        {names.map((name) => {
          const l = stage.load.find((x) => x.name === name);
          const v = l?.value ?? 0;
          const over = v > 100;
          return (
            <div key={name} className={l ? "" : "opacity-35"}>
              <div className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className={`font-medium ${l === hottest ? "text-[#111827]" : "text-[#4B5563]"}`}>{name}</span>
                <span className={`tabular font-mono text-[12px] ${over ? "text-[#E11D48]" : "text-[#6B7280]"}`}>
                  {l ? `${v}%${over ? " · over its limit" : ""}` : "not added yet"}
                </span>
              </div>
              <div className="relative mt-1.5 h-[6px] rounded-full bg-[#F3F4F6]">
                <span
                  className={`bw-bar absolute inset-y-0 left-0 rounded-full ${over ? "is-over" : l === hottest ? "is-hi" : ""}`}
                  style={{ width: `${(Math.min(v, SCALE) / SCALE) * 100}%` }}
                />
                {/* the component's physical limit */}
                <span aria-hidden="true" className="absolute -top-1 h-[14px] w-px bg-[#9CA3AF]" style={{ left: `${(100 / SCALE) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </InView>
      <p key={cur} className="bw-note mt-4 text-[13px] leading-snug text-[#4B5563]">{stage.note}</p>
    </div>
  );
}
