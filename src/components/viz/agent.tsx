"use client";

import { Fragment, useRef } from "react";
import { StageGlyph, type StageKind } from "@/components/arch-diagram";
import { Block } from "./diagrams";
import { PinkArrow } from "./arrow";
import { useLoopStep, useReducedMotion } from "./hooks";

/* Visualizations for agent-harness posts: the loop as a ring, a replayed transcript, the
   provider fan-out, a model's event stream, the append-only log and its rebuilt context, and a
   context-window meter that compacts. Same parts as the rest of components/viz. */

function Turned({ deg }: { deg: number }) {
  return (
    <span className="inline-flex" style={{ transform: `rotate(${deg}deg)` }} aria-hidden="true">
      <PinkArrow />
    </span>
  );
}

type CycleNode = { kind: StageKind; title: string; detail?: string; branch?: string };

function CycleBlock({ node, active }: { node: CycleNode; active: boolean }) {
  return (
    <div className={`cyc-node h-full rounded-lg border bg-white px-3 py-2.5 ${active ? "is-active" : ""}`}>
      <div className="flex items-center gap-1.5">
        <StageGlyph kind={node.kind} />
        <span className="text-[13px] font-semibold leading-tight text-[#111827]">{node.title}</span>
      </div>
      {node.detail && <p className="mt-1 text-[12px] leading-snug text-[#6B7280]">{node.detail}</p>}
      {node.branch && <p className="mt-1.5 font-mono text-[11px] text-[#C026D3]">{node.branch}</p>}
    </div>
  );
}

/* A loop drawn as a ring: the first half of the nodes left to right on top, the rest right to
   left underneath, so the last node hands back to the first. A highlight walks `path` (default:
   every node once); with `done`, the walk ends on that exit message before starting over.
   Phones get the same nodes as a column with a loop-back note. Use an even number of nodes. */
export function CycleDiagram({ nodes, path, done }: { nodes: CycleNode[]; path?: number[]; done?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const seq = path ?? nodes.map((_, i) => i);
  const tick = useLoopStep(ref, seq.length + (done ? 4 : 1), 1000);
  const pos = Math.min(tick, seq.length - 1);
  const active = reduced ? -1 : seq[pos];
  const finished = Boolean(done) && tick >= seq.length;
  const turn = seq.slice(0, pos + 1).filter((n) => n === seq[0]).length;

  const half = Math.ceil(nodes.length / 2);
  const top = nodes.slice(0, half).map((n, i) => ({ n, i }));
  const bottom = nodes.slice(half).map((n, k) => ({ n, i: half + k })).reverse();

  return (
    <div ref={ref}>
      {/* ring, from sm up */}
      <div className="hidden sm:block">
        <div className="grid gap-x-7" style={{ gridTemplateColumns: `repeat(${half}, minmax(0, 1fr))` }}>
          {top.map(({ n, i }, col) => (
            <div key={i} className="relative">
              <CycleBlock node={n} active={i === active} />
              {col < half - 1 && (
                <span className="absolute right-[-24px] top-1/2 -translate-y-1/2">
                  <Turned deg={0} />
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="grid h-7 items-center gap-x-7" style={{ gridTemplateColumns: `repeat(${half}, minmax(0, 1fr))` }}>
          <span className="flex justify-center"><Turned deg={-90} /></span>
          {half > 1 && <span className="flex justify-center" style={{ gridColumnStart: half }}><Turned deg={90} /></span>}
        </div>
        <div className="grid gap-x-7" style={{ gridTemplateColumns: `repeat(${half}, minmax(0, 1fr))` }}>
          {bottom.map(({ n, i }, col) => (
            <div key={i} className="relative" style={{ gridColumnStart: half - bottom.length + col + 1 }}>
              <CycleBlock node={n} active={i === active} />
              {col > 0 && (
                <span className="absolute left-[-24px] top-1/2 -translate-y-1/2">
                  <Turned deg={180} />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* column, on phones */}
      <ol className="space-y-1 sm:hidden">
        {nodes.map((n, i) => (
          <li key={i}>
            {i > 0 && (
              <span className="flex justify-center py-0.5"><Turned deg={90} /></span>
            )}
            <CycleBlock node={n} active={i === active} />
          </li>
        ))}
        <li className="pt-1 text-center font-mono text-[11px] text-[#C026D3]">↺ back to {nodes[0].title}</li>
      </ol>
      {/* Turns only mean something for a loop that can exit. */}
      {!reduced && done && (
        <p className={`mt-3 font-mono text-[12px] ${finished ? "text-[#C026D3]" : "text-[#6B7280]"}`}>
          {finished ? `✓ ${done}` : `turn ${turn} · ${nodes[seq[pos]].title}`}
        </p>
      )}
    </div>
  );
}

type Msg = { role: "user" | "assistant" | "tool"; text: string; error?: boolean };

/* A conversation replayed one message at a time: tool calls in mono, tool results as their own
   messages, failures in red. Shows the model reading an error and recovering. */
export function Transcript({ messages }: { messages: Msg[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const tick = useLoopStep(ref, messages.length + 4, 1100);
  const shown = reduced ? messages.length : Math.min(tick + 1, messages.length);

  return (
    <div ref={ref}>
      <ol className="space-y-1.5">
        {messages.map((m, i) => (
          <li key={i} className={`race-row grid grid-cols-[72px_1fr] items-start gap-2 ${i < shown ? "is-on" : ""}`}>
            <span className="pt-[5px] font-mono text-[11px] uppercase tracking-[0.06em] text-[#9CA3AF]">
              {m.role === "tool" ? "result" : m.role}
            </span>
            <span className={`tr-msg tr-${m.role} min-w-0 ${m.error ? "is-error" : ""}`}>{m.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

type EvRun = { label: string; events: string[]; end: "ok" | "error" };

/* What an adapter hands the loop: a stream of small typed events. Every run ends in exactly one
   terminal event, done or error, so the loop never needs a try/catch. */
export function EventStream({ runs }: { runs: EvRun[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const longest = Math.max(...runs.map((r) => r.events.length));
  const tick = useLoopStep(ref, longest + 5, 550);
  const shown = reduced ? longest : Math.min(tick, longest);

  return (
    <div ref={ref} className="space-y-3">
      {runs.map((r) => (
        <div key={r.label}>
          <p className="mb-1.5 text-[13px] font-medium text-[#111827]">{r.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {r.events.slice(0, shown).map((e, i) => {
              const last = i === r.events.length - 1;
              return (
                <span key={i} className={`ev-chip ${last ? (r.end === "ok" ? "is-done" : "is-error") : ""}`}>
                  {e}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

type Node = { kind: StageKind; title: string; detail: string };

/* One source talking to one canonical interface, which fans out to several targets through
   thin adapters. A dashed target is a stand-in (like a fake provider for tests). */
export function FanOut({ source, hub, targets }: { source: Node; hub: Node; targets: (Node & { dashed?: boolean })[] }) {
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-[0.8fr_auto_0.9fr_1.6fr] sm:items-center">
      <Block kind={source.kind} title={source.title}>
        <p className="text-[12px] leading-snug text-[#6B7280]">{source.detail}</p>
      </Block>
      <span className="flex justify-center py-1 sm:px-2 sm:py-0" aria-hidden="true">
        <span className="cb-wire"><i /><i style={{ animationDelay: "1.3s" }} /></span>
      </span>
      <Block kind={hub.kind} title={hub.title}>
        <p className="text-[12px] leading-snug text-[#6B7280]">{hub.detail}</p>
      </Block>
      <span className="flex justify-center py-1 sm:hidden" aria-hidden="true">
        <span className="cb-wire"><i /><i style={{ animationDelay: "1.3s" }} /></span>
      </span>
      {/* the last column holds one wire + target per row */}
      <div className="grid gap-1.5 sm:grid-cols-[auto_1fr] sm:items-center">
        {targets.map((t, i) => (
          <Fragment key={t.title}>
            <span className="hub-wire mx-2 hidden w-8 sm:block" aria-hidden="true">
              <i style={{ animationDelay: `${i * 0.4}s` }} />
              <i style={{ animationDelay: `${i * 0.4 + 1.3}s` }} />
            </span>
            <Block kind={t.kind} title={t.title} dashed={t.dashed}>
              <p className="text-[11.5px] leading-snug text-[#6B7280]">{t.detail}</p>
            </Block>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

type Entry =
  | { type: "model"; model: string }
  | { type: "message"; role: string; text: string }
  | { type: "compaction"; summary: string; keep: number };

/* The append-only log on the left grows one entry at a time; the context on the right is rebuilt
   from scratch from the log after every entry, exactly like the harness does before a request. */
export function LogRebuild({ entries }: { entries: Entry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const tick = useLoopStep(ref, entries.length + 5, 1100);
  const shown = reduced ? entries.length : Math.min(tick + 1, entries.length);

  // The rebuild, as in the post: replay the log, oldest entry first.
  let model = "none";
  let summary: string | null = null;
  let messages: Extract<Entry, { type: "message" }>[] = [];
  for (const e of entries.slice(0, shown)) {
    if (e.type === "model") model = e.model;
    else if (e.type === "message") messages = [...messages, e];
    else {
      summary = e.summary;
      messages = messages.slice(-e.keep);
    }
  }

  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.06em] text-[#9CA3AF]">log · append-only</p>
        <ol className="space-y-1">
          {entries.map((e, i) => (
            <li key={i} className={`race-row font-mono text-[11.5px] leading-snug ${i < shown ? "is-on" : ""}`}>
              <span className="text-[#C026D3]">+ </span>
              {e.type === "model" && <span className="text-[#111827]">model_change → {e.model}</span>}
              {e.type === "message" && (
                <span className="text-[#4B5563]">
                  {e.role}: {e.text}
                </span>
              )}
              {e.type === "compaction" && <span className="font-semibold text-[#111827]">compaction · keep last {e.keep}</span>}
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded-lg border border-[#ECECED] bg-white p-3">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.06em] text-[#9CA3AF]">context · rebuilt</p>
        <p className="text-[12.5px] text-[#111827]">
          <span className="text-[#6B7280]">model</span> <span className="font-mono text-[#C026D3]">{model}</span>
        </p>
        {summary && <p className="lr-summary mt-2 rounded-md px-2 py-1.5 text-[12px] leading-snug">Summary so far: {summary}</p>}
        <ol className="mt-2 space-y-1">
          {messages.map((m) => (
            <li key={`${m.role}-${m.text}`} className="viz-rule font-mono text-[11.5px] text-[#4B5563]">
              {m.role}: {m.text}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const K = 1000;
// A session that crosses the threshold on a tool result: a prompt, then file reads and command runs.
const SESSION: { kind: "user" | "assistant" | "tool"; tokens: number }[] = [
  { kind: "user", tokens: 4 * K },
  ...Array.from({ length: 9 }, () => [
    { kind: "assistant" as const, tokens: 2 * K },
    { kind: "tool" as const, tokens: 18 * K },
  ]).flat(),
  { kind: "assistant", tokens: 2 * K },
  { kind: "tool", tokens: 6 * K },
];

/* The context window as a bar. Messages fill it until they cross window − reserve; then the cut
   is found (walking back to a ~20k budget, never on a tool result) and everything before it
   collapses into a summary. */
export function ContextMeter({ window: win = 200 * K, reserve = 16 * K, keep = 20 * K, summary = 3 * K }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Walk back from the newest message to the keep budget, then move off any tool result.
  let kept = 0;
  let naive = SESSION.length;
  while (naive > 0 && kept < keep) kept += SESSION[--naive].tokens;
  let cut = naive;
  while (cut > 0 && SESSION[cut].kind === "tool") cut--;

  const fillTicks = Math.ceil(SESSION.length / 2);
  const phases = ["over", "bad", "good", "done", "done", "done", "done"] as const;
  const tick = useLoopStep(ref, fillTicks + phases.length, 750);
  const phase = reduced ? "done" : tick < fillTicks ? "fill" : phases[tick - fillTicks];
  const visible = phase === "fill" ? Math.min(SESSION.length, (tick + 1) * 2) : SESSION.length;

  const segs = SESSION.slice(0, visible).map((s, i) => ({ ...s, i }));
  const shown = phase === "done" ? [{ kind: "summary" as const, tokens: summary, i: -1 }, ...segs.slice(cut)] : segs;
  const used = shown.reduce((n, s) => n + s.tokens, 0);
  const pct = (n: number) => `${(n / win) * 100}%`;
  const before = (idx: number) => SESSION.slice(0, idx).reduce((n, s) => n + s.tokens, 0);
  const marker = phase === "bad" ? naive : phase === "good" ? cut : null;

  const status =
    phase === "fill" ? `${Math.round(used / K)}k / ${win / K}k tokens`
      : phase === "over" ? `${Math.round(used / K)}k: past window − reserve, compact`
        : phase === "bad" ? "cut lands on a tool result: not allowed"
          : phase === "good" ? "cut moved to the call that produced it"
            : `${Math.round(used / K)}k: summary + the last ${Math.round((used - summary) / K)}k kept word for word`;

  return (
    <div ref={ref}>
      <div className="relative h-7 overflow-hidden rounded-md bg-[#F3F4F6]">
        <div className="flex h-full">
          {shown.map((s) => (
            <span key={s.i} className={`cm-seg cm-${s.kind}`} style={{ width: pct(s.tokens) }} />
          ))}
        </div>
        <span className="absolute inset-y-0 w-px bg-[#111827]" style={{ left: pct(win - reserve) }} />
        <span className="absolute inset-y-0 right-0 bg-[repeating-linear-gradient(135deg,transparent_0_4px,#E5E7EB_4px_6px)]" style={{ width: pct(reserve) }} />
        {marker !== null && (
          <span className={`absolute inset-y-[-2px] w-[3px] rounded-full ${phase === "bad" ? "bg-[#E11D48]" : "bg-[#EA00FF]"}`} style={{ left: pct(before(marker)) }} />
        )}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10.5px] text-[#9CA3AF]">
        <span>0</span>
        <span>reserve {reserve / K}k · window {win / K}k</span>
      </div>
      <p className={`mt-2 font-mono text-[12px] ${phase === "bad" ? "text-[#E11D48]" : "text-[#C026D3]"}`}>{status}</p>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#9CA3AF]">
        {(["user", "assistant", "tool", "summary"] as const).map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span className={`cm-seg cm-${k} inline-block h-2.5 w-3.5 rounded-sm`} /> {k === "tool" ? "tool result" : k}
          </span>
        ))}
      </p>
    </div>
  );
}
