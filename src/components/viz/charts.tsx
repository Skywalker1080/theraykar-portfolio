import { InView } from "./frame";

/* Small, quiet charts for blog posts. Each one animates once when it scrolls into view
   (via InView + CSS in globals.css) and renders its final state with reduced motion. */

type Bar = { label: string; value: number; max: number; display?: string; note?: string; highlight?: boolean };

/* Horizontal bars, each scaled to its own max: scores out of N, or seconds against the slowest stage. */
export function Bars({ items }: { items: Bar[] }) {
  return (
    <InView className="space-y-3">
      {items.map((b, i) => (
        <div key={b.label}>
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="font-medium text-[#111827]">{b.label}</span>
            <span className="tabular font-mono text-[12px] text-[#6B7280]">{b.display ?? `${b.value}/${b.max}`}</span>
          </div>
          <div className="mt-1.5 h-[6px] overflow-hidden rounded-full bg-[#F3F4F6]">
            <div
              className={`viz-bar h-full rounded-full ${b.highlight ? "is-hi" : ""}`}
              style={{ width: `${(b.value / b.max) * 100}%`, transitionDelay: `${i * 160}ms` }}
            />
          </div>
          {b.note && <p className="mt-1 text-[12px] leading-snug text-[#9CA3AF]">{b.note}</p>}
        </div>
      ))}
    </InView>
  );
}

/* One dot per item; `total - kept` of them fade out, spread evenly through the grid. */
export function DotGrid({
  total,
  kept,
  keptLabel,
  cutLabel,
}: {
  total: number;
  kept: number;
  keptLabel: string;
  cutLabel: string;
}) {
  const cut = total - kept;
  const isCut = (i: number) => Math.floor(((i + 1) * cut) / total) > Math.floor((i * cut) / total);
  return (
    <InView>
      <ul aria-hidden="true" className="grid max-w-[360px] grid-cols-[repeat(14,minmax(0,1fr))] gap-[7px]">
        {Array.from({ length: total }, (_, i) => (
          <li key={i} className={`viz-dot ${isCut(i) ? "is-cut" : ""}`} style={{ transitionDelay: `${300 + i * 22}ms` }} />
        ))}
      </ul>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-[#6B7280]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#EA00FF]" />
          {keptLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border border-[#D1D5DB]" />
          {cutLabel}
        </span>
      </p>
    </InView>
  );
}

type Mismatch = { wrote: string; actual: string; result: string };

/* What the model wrote next to what the data layer actually held. A highlight walks the rows. */
export function MismatchTable({ rows }: { rows: Mismatch[] }) {
  const cycle = `${rows.length * 1.8}s`;
  return (
    <div className="text-[13px]">
      <div className="hidden grid-cols-[1fr_1fr_1.2fr] gap-3 px-2.5 pb-2 font-mono text-[11px] uppercase tracking-[0.06em] text-[#9CA3AF] sm:grid">
        <span>Model wrote</span>
        <span>Data layer had</span>
        <span>What happened</span>
      </div>
      <ul className="space-y-1.5">
        {rows.map((r, i) => (
          <li
            key={r.wrote}
            className="viz-row grid gap-1 rounded-lg border border-[#ECECED] bg-white px-2.5 py-2 sm:grid-cols-[1fr_1fr_1.2fr] sm:gap-3"
            style={{ animationDuration: cycle, animationDelay: `${i * 1.8}s` }}
          >
            <span className="font-mono text-[12px] text-[#111827] line-through decoration-[#F0ABFC] decoration-2">{r.wrote}</span>
            <span className="font-mono text-[12px] text-[#C026D3]">{r.actual}</span>
            <span className="text-[12.5px] leading-snug text-[#6B7280]">{r.result}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Run = { label: string; steps: ("gen" | "query" | "fail")[]; note: string };

const UNITS = { gen: 3, query: 1, fail: 1 } as const;

/* Each LLM call and query as a segment on a shared scale, so a run that retries is visibly longer. */
export function RetryTimeline({ runs }: { runs: Run[] }) {
  const longest = Math.max(...runs.map((r) => r.steps.reduce((n, s) => n + UNITS[s], 0)));
  let order = 0;
  return (
    <InView className="space-y-4">
      {runs.map((run) => (
        <div key={run.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px]">
            <span className="font-medium text-[#111827]">{run.label}</span>
            <span className="font-mono text-[12px] text-[#6B7280]">{run.note}</span>
          </div>
          <div className="flex h-[22px] gap-[3px]">
            {run.steps.map((s, i) => (
              <span
                key={i}
                className={`viz-seg viz-seg-${s}`}
                style={{ width: `${(UNITS[s] / longest) * 100}%`, transitionDelay: `${order++ * 220}ms` }}
              >
                {s === "fail" ? "✕" : s === "query" ? "" : "LLM"}
              </span>
            ))}
          </div>
        </div>
      ))}
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#9CA3AF]">
        <span className="inline-flex items-center gap-1.5"><span className="viz-key viz-seg-gen" /> LLM call</span>
        <span className="inline-flex items-center gap-1.5"><span className="viz-key viz-seg-query" /> query</span>
        <span className="inline-flex items-center gap-1.5"><span className="viz-key viz-seg-fail" /> query error, back to the model</span>
      </p>
    </InView>
  );
}

type Mark = { at: number; label: string };

const MARK_ROW = 18; // px per label row above the axis

/* A time axis with the budgets marked on it and a sweep that fills toward the hard cap.
   Each mark gets its own label row with a leader line down to the axis, so close marks
   never collide on narrow screens. */
export function Deadlines({ total, marks }: { total: number; marks: Mark[] }) {
  return (
    <div className="pb-1 pt-1">
      <div className="relative" style={{ paddingTop: marks.length * MARK_ROW + 4 }}>
        <div className="h-[6px] overflow-hidden rounded-full bg-[#F3F4F6]">
          <div className="viz-sweep h-full rounded-full" />
        </div>
        {/* Latest mark on the top row, so no leader line crosses another mark's label. */}
        {[...marks].sort((a, b) => b.at - a.at).map((m, i) => {
          const pct = (m.at / total) * 100;
          const right = pct > 60;
          return (
            <div
              key={m.label}
              className="absolute bottom-[-4px] w-px bg-[#D1D5DB]"
              style={{ left: `${pct}%`, height: (marks.length - i) * MARK_ROW + 10 }}
            >
              <span
                className={`absolute top-[-3px] whitespace-nowrap font-mono text-[11px] leading-[14px] ${right ? "right-[6px] text-right" : "left-[6px]"}`}
              >
                <span className="font-semibold text-[#111827]">{m.at}s</span>{" "}
                <span className="text-[#6B7280]">{m.label}</span>
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between font-mono text-[11px] text-[#9CA3AF]">
        <span>0s</span>
        <span>{total}s</span>
      </div>
    </div>
  );
}
