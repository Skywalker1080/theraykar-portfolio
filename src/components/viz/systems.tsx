"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { InView } from "./frame";
import { useInView, useLoopStep, useReducedMotion } from "./hooks";

/* Visualizations for system-design posts: the read and write paths drawn as one system, a
   burst of requests hitting a server directly vs. through a queue, and a bottleneck that moves
   every time you add a component. Same parts as the rest of components/viz. */

type Pt = [number, number];
type NodeId = "client" | "lb" | "server" | "cache" | "replicas" | "queue" | "worker" | "primary";
type Kind = "read" | "write" | "repl";
type Mode = "read" | "write" | "both";
type Badge = { text: string; where: "cache" | "client"; tone: "hit" | "miss" | "ok" };
type PathStep = { text: string; edges: string[]; nodes: NodeId[]; badge?: Badge };

const READ_C = "#EA00FF";
const WRITE_C = "#6366F1";

const EDGE_KIND: Record<string, { kind: Kind; dashed?: boolean }> = {
  "cl-r": { kind: "read" },
  "ls-r": { kind: "read" },
  sk: { kind: "read" },
  kr: { kind: "read" },
  "cl-w": { kind: "write" },
  "ls-w": { kind: "write" },
  sq: { kind: "write" },
  qw: { kind: "write" },
  wp: { kind: "write" },
  wk: { kind: "write", dashed: true },
  pr: { kind: "repl", dashed: true },
};

const STEPS: Record<"read" | "write", PathStep[]> = {
  read: [
    { text: "The client asks for something, say a product page.", edges: ["cl-r"], nodes: ["client", "lb"] },
    { text: "The load balancer hands it to any server. They're stateless, so any copy will do.", edges: ["ls-r"], nodes: ["lb", "server"] },
    { text: "The server checks the cache first. This time it's a miss.", edges: ["sk"], nodes: ["server", "cache"], badge: { text: "✕ miss", where: "cache", tone: "miss" } },
    { text: "So it reads from a read replica instead.", edges: ["kr"], nodes: ["cache", "replicas"] },
    { text: "On the way back, it keeps a copy in the cache.", edges: ["kr"], nodes: ["replicas", "cache"], badge: { text: "stored", where: "cache", tone: "ok" } },
    { text: "Then the answer goes back to the client.", edges: ["sk", "ls-r", "cl-r"], nodes: ["cache", "server", "lb", "client"] },
    { text: "The next request for the same thing is a hit. The cache answers, and the database never sees it.", edges: ["cl-r", "ls-r", "sk"], nodes: ["client", "lb", "server", "cache"], badge: { text: "✓ hit", where: "cache", tone: "hit" } },
  ],
  write: [
    { text: "The client sends a change, say uploading a video.", edges: ["cl-w"], nodes: ["client", "lb"] },
    { text: "Any server picks it up.", edges: ["ls-w"], nodes: ["lb", "server"] },
    { text: "The server puts a job on the queue instead of doing the heavy work itself.", edges: ["sq"], nodes: ["server", "queue"] },
    { text: "And it answers 202 Accepted straight away, so the client can move on.", edges: ["ls-w", "cl-w"], nodes: ["server", "lb", "client"], badge: { text: "202 Accepted", where: "client", tone: "ok" } },
    { text: "A worker pulls the job off the queue when it's free.", edges: ["qw"], nodes: ["queue", "worker"] },
    { text: "It does the heavy work and writes the result to the primary database.", edges: ["wp"], nodes: ["worker", "primary"] },
    { text: "Then it updates or clears the cache entry, so reads don't get stale data.", edges: ["wk"], nodes: ["worker", "cache"] },
    { text: "Replication copies the change to the read replicas a moment later.", edges: ["pr"], nodes: ["primary", "replicas"] },
  ],
};

/* Where everything sits on one canvas. Edges end at a node's outline so the arrowhead shows;
   packet routes run center to center underneath the nodes. Shared hops (client → load
   balancer → server) get one lane per path. `routes` line up with STEPS by index. */
type Layout = {
  viewBox: string;
  nodes: Record<NodeId, { at: Pt; label: "below" | "right"; off?: number }>;
  edges: Record<string, string>;
  labels: { text: string; at: Pt; kind: Kind; anchor?: "start" | "middle"; rotate?: boolean }[];
  routes: Record<"read" | "write", Pt[][]>;
  loops: [Pt[], Pt[]];
  badges: Record<Badge["where"], Pt>;
};

// Wide screens: entry on the left, reads branch up, writes branch down.
const WIDE: Layout = {
  viewBox: "0 48 720 304",
  nodes: {
    client: { at: [55, 190], label: "below" },
    lb: { at: [170, 190], label: "below" },
    server: { at: [295, 190], label: "below" },
    cache: { at: [450, 95], label: "below" },
    replicas: { at: [630, 95], label: "below" },
    queue: { at: [430, 285], label: "below" },
    worker: { at: [535, 285], label: "below" },
    primary: { at: [630, 285], label: "below" },
  },
  edges: {
    "cl-r": "M 81 184 H 147",
    "ls-r": "M 193 184 H 270",
    sk: "M 314 146 V 95 H 421",
    kr: "M 478 90 H 599",
    "cl-w": "M 81 196 H 147",
    "ls-w": "M 193 196 H 270",
    sq: "M 314 214 V 285 H 395",
    qw: "M 464 285 H 512",
    wp: "M 557 285 H 605",
    wk: "M 535 263 V 106 H 479",
    pr: "M 654 285 H 682 V 95 H 663",
  },
  labels: [
    { text: "check first", at: [368, 88], kind: "read" },
    { text: "miss →", at: [539, 82], kind: "read" },
    { text: "enqueue", at: [356, 278], kind: "write" },
    { text: "update / clear", at: [541, 190], kind: "write", anchor: "start" },
    { text: "replication", at: [696, 190], kind: "repl", rotate: true },
  ],
  routes: {
    read: [
      [[55, 184], [170, 184]],
      [[170, 184], [295, 184]],
      [[295, 184], [314, 184], [314, 95], [450, 95]],
      [[450, 90], [630, 90]],
      [[630, 90], [450, 90]],
      [[450, 95], [314, 95], [314, 184], [55, 184]],
      [[55, 184], [314, 184], [314, 95], [450, 95], [314, 95], [314, 184], [55, 184]],
    ],
    write: [
      [[55, 196], [170, 196]],
      [[170, 196], [295, 196]],
      [[295, 196], [314, 196], [314, 285], [430, 285]],
      [[295, 196], [55, 196]],
      [[430, 285], [535, 285]],
      [[535, 285], [630, 285]],
      [[535, 285], [535, 106], [450, 106]],
      [[630, 285], [682, 285], [682, 95], [630, 95]],
    ],
  },
  loops: [
    [[55, 184], [314, 184], [314, 95], [450, 95], [450, 90], [630, 90]],
    [[55, 196], [314, 196], [314, 285], [630, 285]],
  ],
  badges: { cache: [450, 52], client: [110, 157] },
};

// Phones: entry at the top, reads branch down the left column, writes down the right.
const TALL: Layout = {
  viewBox: "0 10 340 560",
  nodes: {
    client: { at: [140, 40], label: "right", off: 32 },
    lb: { at: [140, 135], label: "right", off: 30 },
    server: { at: [140, 235], label: "right", off: 42 },
    cache: { at: [55, 365], label: "right", off: 34 },
    replicas: { at: [55, 490], label: "right", off: 36 },
    queue: { at: [235, 350], label: "right", off: 40 },
    worker: { at: [235, 440], label: "right", off: 26 },
    primary: { at: [235, 520], label: "right", off: 28 },
  },
  edges: {
    "cl-r": "M 134 61 V 112",
    "ls-r": "M 134 158 V 199",
    sk: "M 130 259 V 300 H 55 V 335",
    kr: "M 55 394 V 456",
    "cl-w": "M 146 61 V 112",
    "ls-w": "M 146 158 V 199",
    sq: "M 150 259 V 300 H 235 V 334",
    qw: "M 235 365 V 418",
    wp: "M 235 461 V 490",
    wk: "M 215 440 H 110 V 379 H 81",
    pr: "M 211 530 H 55 V 520",
  },
  labels: [
    { text: "check first", at: [92, 294], kind: "read" },
    { text: "miss ↓", at: [63, 428], kind: "read", anchor: "start" },
    { text: "enqueue", at: [196, 294], kind: "write" },
    { text: "update / clear", at: [118, 433], kind: "write", anchor: "start" },
    { text: "replication", at: [150, 546], kind: "repl" },
  ],
  routes: {
    read: [
      [[134, 40], [134, 135]],
      [[134, 135], [134, 235]],
      [[130, 235], [130, 300], [55, 300], [55, 365]],
      [[55, 365], [55, 490]],
      [[55, 490], [55, 365]],
      [[55, 365], [55, 300], [134, 300], [134, 40]],
      [[134, 40], [134, 300], [55, 300], [55, 365], [55, 300], [134, 300], [134, 40]],
    ],
    write: [
      [[146, 40], [146, 135]],
      [[146, 135], [146, 235]],
      [[146, 235], [146, 300], [235, 300], [235, 350]],
      [[146, 235], [146, 40]],
      [[235, 350], [235, 440]],
      [[235, 440], [235, 520]],
      [[235, 440], [110, 440], [110, 379], [55, 379]],
      [[235, 530], [55, 530], [55, 490]],
    ],
  },
  loops: [
    [[134, 40], [134, 300], [55, 300], [55, 490]],
    [[146, 40], [146, 300], [235, 300], [235, 520]],
  ],
  badges: { cache: [118, 338], client: [70, 92] },
};

function routeLength(r: Pt[]) {
  let n = 0;
  for (let i = 1; i < r.length; i++) n += Math.hypot(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]);
  return n;
}

function pointAlong(r: Pt[], t: number): Pt {
  let left = routeLength(r) * t;
  for (let i = 1; i < r.length; i++) {
    const seg = Math.hypot(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]);
    if (left <= seg && seg > 0) {
      const k = left / seg;
      return [r[i - 1][0] + (r[i][0] - r[i - 1][0]) * k, r[i - 1][1] + (r[i][1] - r[i - 1][1]) * k];
    }
    left -= seg;
  }
  return r[r.length - 1];
}

/* ---- Glyphs, drawn around (0, 0) in currentColor so a node lights up by changing color ---- */

function Laptop() {
  return (
    <>
      <rect x={-20} y={-17} width={40} height={27} rx={3} fill="#fff" stroke="currentColor" strokeWidth={1.6} />
      <rect x={-16} y={-13} width={32} height={19} rx={1.5} fill="currentColor" opacity={0.12} />
      <path d="M -25 12 H 25 L 22 17 H -22 Z" fill="#fff" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
    </>
  );
}

function Balancer() {
  return (
    <>
      <circle r={20} fill="#fff" stroke="currentColor" strokeWidth={1.6} />
      <path d="M -12 0 H -3 M -3 0 L 9 -9 M -3 0 H 11 M -3 0 L 9 9" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <circle cx={10} cy={-9} r={2.2} fill="currentColor" />
      <circle cx={12} cy={0} r={2.2} fill="currentColor" />
      <circle cx={10} cy={9} r={2.2} fill="currentColor" />
    </>
  );
}

function Rack({ dx = 0, dy = 0, ghost = false }: { dx?: number; dy?: number; ghost?: boolean }) {
  return (
    <g transform={`translate(${dx} ${dy})`} opacity={ghost ? 0.45 : 1}>
      <rect x={-20} y={-22} width={40} height={44} rx={4} fill="#fff" stroke="currentColor" strokeWidth={1.6} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={-15} y={-17 + i * 13} width={30} height={9} rx={2} fill="currentColor" opacity={0.1} />
          <line x1={-11} x2={2} y1={-12.5 + i * 13} y2={-12.5 + i * 13} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" opacity={0.55} />
          <circle className="tp-led" cx={10} cy={-12.5 + i * 13} r={1.8} fill="currentColor" style={{ animationDelay: `${i * 0.3}s` }} />
        </g>
      ))}
    </g>
  );
}

function Chip() {
  const pins = [-12, -4, 4, 12];
  return (
    <>
      {pins.map((p) => (
        <path key={p} d={`M ${p} -27 V -22 M ${p} 22 V 27 M -27 ${p} H -22 M 22 ${p} H 27`} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      ))}
      <rect x={-22} y={-22} width={44} height={44} rx={5} fill="#fff" stroke="currentColor" strokeWidth={1.6} />
      <path d="M 3 -13 L -8 2 H 0 L -3 13 L 8 -2 H 0 Z" fill="currentColor" />
    </>
  );
}

function Cylinder({ w = 44, h = 40, dx = 0, dy = 0, ghost = false }: { w?: number; h?: number; dx?: number; dy?: number; ghost?: boolean }) {
  const rx = w / 2;
  const top = -h / 2;
  return (
    <g transform={`translate(${dx} ${dy})`} opacity={ghost ? 0.45 : 1}>
      <path d={`M ${-rx} ${top} V ${h / 2} A ${rx} 6 0 0 0 ${rx} ${h / 2} V ${top}`} fill="#fff" stroke="currentColor" strokeWidth={1.6} />
      <path d={`M ${-rx} 0 A ${rx} 6 0 0 0 ${rx} 0`} fill="none" stroke="currentColor" strokeWidth={1.4} opacity={0.5} />
      <ellipse cy={top} rx={rx} ry={6} fill="#fff" stroke="currentColor" strokeWidth={1.6} />
    </g>
  );
}

function Queue() {
  return (
    <>
      <rect x={-32} y={-13} width={64} height={26} rx={13} fill="#fff" stroke="currentColor" strokeWidth={1.6} />
      <g className="tp-jobs">
        {[-20, -8, 4, 16].map((x, i) => (
          <rect key={x} x={x} y={-6} width={8} height={12} rx={2} fill="currentColor" opacity={0.35 + i * 0.2} />
        ))}
      </g>
    </>
  );
}

function Gear() {
  return (
    <g className="tp-gear">
      <circle r={16} fill="none" stroke="currentColor" strokeWidth={6} strokeDasharray="5.3 7.27" />
      <circle r={13} fill="#fff" stroke="currentColor" strokeWidth={1.6} />
      <circle r={4.5} fill="none" stroke="currentColor" strokeWidth={1.6} />
    </g>
  );
}

const NODES: { id: NodeId; name: string; sub: string; glyph: ReactNode }[] = [
  { id: "client", name: "Client", sub: "browser or app", glyph: <Laptop /> },
  { id: "lb", name: "Load balancer", sub: "", glyph: <Balancer /> },
  {
    id: "server",
    name: "Servers",
    sub: "stateless copies",
    glyph: (
      <>
        <Rack dx={12} dy={-12} ghost />
        <Rack dx={6} dy={-6} ghost />
        <Rack />
      </>
    ),
  },
  { id: "cache", name: "Cache", sub: "Redis, in memory", glyph: <Chip /> },
  {
    id: "replicas",
    name: "Read replicas",
    sub: "copies, for reads",
    glyph: (
      <>
        <Cylinder w={40} h={34} dx={9} dy={-8} ghost />
        <Cylinder w={40} h={34} dx={-3} dy={3} />
      </>
    ),
  },
  { id: "queue", name: "Queue", sub: "jobs wait in line", glyph: <Queue /> },
  { id: "worker", name: "Workers", sub: "do the heavy work", glyph: <Gear /> },
  { id: "primary", name: "Primary DB", sub: "all writes", glyph: <Cylinder /> },
];

const ARIA =
  "Read path: client, load balancer, servers, cache, and a read replica on a miss. Write path: client, load balancer, servers, queue, workers, primary database, then the cache is updated and the replicas catch up.";

/* One drawing of the system in a given layout. It runs its own packets, so the wide and tall
   versions can both be mounted and CSS shows whichever fits the screen. */
function PathCanvas({ layout, mode, cur, run, className }: { layout: Layout; mode: Mode; cur: number; run: boolean; className: string }) {
  const uid = useId().replace(/:/g, "");
  const p0 = useRef<SVGCircleElement>(null);
  const p1 = useRef<SVGCircleElement>(null);
  const step = mode === "both" ? undefined : STEPS[mode][cur];
  const color = mode === "write" ? WRITE_C : READ_C;

  useEffect(() => {
    const els = [p0.current, p1.current];
    const routes = mode === "both" ? layout.loops : [layout.routes[mode][cur]];
    els.forEach((el, i) => el?.setAttribute("opacity", run && routes[i] ? "1" : "0"));
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      routes.forEach((r, i) => {
        const el = els[i];
        if (!el) return;
        const dur = Math.max(700, routeLength(r) * (mode === "both" ? 7 : 3.2));
        const raw = (now - start) / dur;
        // "both" loops with a short rest at the end; a single step plays once and stays put.
        const t = mode === "both" ? Math.min(raw % 1.25, 1) : Math.min(raw, 1);
        const [x, y] = pointAlong(r, t);
        el.setAttribute("cx", String(x));
        el.setAttribute("cy", String(y));
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [layout, mode, cur, run]);

  const inMode = (kind: Kind) => mode === "both" || kind === mode || (kind === "repl" && mode === "write");
  const edgeOpacity = (id: string, kind: Kind) => {
    if (mode === "both") return 0.9;
    if (!inMode(kind)) return 0.1;
    return step?.edges.includes(id) ? 1 : 0.3;
  };
  const marker = (kind: Kind) => `url(#${uid}-${kind})`;
  const stroke = (kind: Kind) => (kind === "read" ? READ_C : kind === "write" ? WRITE_C : "#9CA3AF");

  return (
    <svg viewBox={layout.viewBox} className={className} role="img" aria-label={ARIA} style={{ ["--tp-c" as string]: color }}>
      <defs>
        {(["read", "write", "repl"] as const).map((k) => (
          <marker key={k} id={`${uid}-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 Z" fill={stroke(k)} />
          </marker>
        ))}
      </defs>

      {Object.entries(layout.edges).map(([id, d]) => {
        const { kind, dashed } = EDGE_KIND[id];
        return (
          <path
            key={id}
            d={d}
            fill="none"
            className="tp-edge"
            stroke={stroke(kind)}
            strokeWidth={step?.edges.includes(id) ? 2.6 : 1.8}
            strokeDasharray={dashed ? "5 4" : undefined}
            strokeLinejoin="round"
            opacity={edgeOpacity(id, kind)}
            markerEnd={marker(kind)}
          />
        );
      })}
      {layout.labels.map((l) => (
        <text
          key={l.text}
          x={l.at[0]}
          y={l.at[1]}
          textAnchor={l.anchor ?? "middle"}
          transform={l.rotate ? `rotate(-90 ${l.at[0]} ${l.at[1]})` : undefined}
          className="tp-elabel"
          fill={l.kind === "read" ? "#C026D3" : l.kind === "write" ? "#4F46E5" : "#9CA3AF"}
          opacity={inMode(l.kind) ? 1 : 0.2}
        >
          {l.text}
        </text>
      ))}

      {/* packets travel underneath the nodes, so they disappear into a node and come out the other side */}
      <circle ref={p0} r={5.5} fill={mode === "write" ? WRITE_C : READ_C} stroke="#fff" strokeWidth={2} opacity={0} />
      <circle ref={p1} r={5.5} fill={WRITE_C} stroke="#fff" strokeWidth={2} opacity={0} />

      {NODES.map((n) => {
        const pos = layout.nodes[n.id];
        const on = !!step?.nodes.includes(n.id);
        return (
          <g key={n.id} transform={`translate(${pos.at[0]} ${pos.at[1]})`} className={`tp-node ${on ? "is-on" : ""} ${mode === "both" ? "is-all" : ""}`}>
            <g className="tp-body">{n.glyph}</g>
            {pos.label === "below" ? (
              <>
                <text y={n.id === "server" ? 42 : 44} textAnchor="middle" className="tp-name">{n.name}</text>
                {n.sub && <text y={n.id === "server" ? 55 : 57} textAnchor="middle" className="tp-sub">{n.sub}</text>}
              </>
            ) : (
              <text x={pos.off} y={4} className="tp-name">{n.name}</text>
            )}
          </g>
        );
      })}

      {step?.badge && (
        <g key={`${mode}-${cur}`} className="tp-badge" transform={`translate(${layout.badges[step.badge.where][0]} ${layout.badges[step.badge.where][1]})`}>
          <rect x={-38} y={-11} width={76} height={20} rx={10} className={`tp-badge-${step.badge.tone}`} />
          <text y={3.5} textAnchor="middle" className={`tp-badge-text tp-badge-${step.badge.tone}`}>{step.badge.text}</text>
        </g>
      )}
    </svg>
  );
}

/* The whole system on one canvas: the read path in pink and the write path in indigo. Pick a
   path and a packet walks it one hop at a time, with the step spelled out underneath; "Both"
   loops one packet down each path. Click a step to pin it. Wide screens get the left-to-right
   layout, phones get a top-to-bottom one. */
export function TwoPaths({ initial = "both" }: { initial?: Mode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const seen = useInView(ref);
  const [mode, setMode] = useState<Mode>(initial);
  const [picked, setPicked] = useState<number | null>(null);
  const steps = mode === "both" ? [] : STEPS[mode];
  const auto = useLoopStep(ref, 56, 2600); // 56 is a multiple of both step counts (7 and 8)
  const cur = mode === "both" ? -1 : (picked ?? (reduced ? 0 : auto % steps.length));
  const color = mode === "write" ? WRITE_C : READ_C;
  const run = seen && !reduced;

  return (
    <div ref={ref}>
      <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Path">
        {(["read", "write", "both"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setPicked(null);
            }}
            className={`tp-tab tp-tab-${m} inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] ${mode === m ? "is-on" : ""}`}
          >
            <span className="tp-swatch" />
            {m === "read" ? "Read path" : m === "write" ? "Write path" : "Both paths"}
          </button>
        ))}
      </div>

      <PathCanvas layout={WIDE} mode={mode} cur={cur} run={run} className="hidden w-full sm:block" />
      <PathCanvas layout={TALL} mode={mode} cur={cur} run={run} className="mx-auto block w-full max-w-[400px] sm:hidden" />

      {mode === "both" ? (
        <ul className="mt-3 space-y-1.5 text-[13px] leading-snug text-[#4B5563]">
          <li className="flex gap-2"><span className="tp-key mt-[7px]" style={{ background: READ_C }} /> <span><b className="font-semibold text-[#111827]">Read:</b> client → load balancer → server → cache, and a read replica only on a miss.</span></li>
          <li className="flex gap-2"><span className="tp-key mt-[7px]" style={{ background: WRITE_C }} /> <span><b className="font-semibold text-[#111827]">Write:</b> client → load balancer → server → queue → worker → primary database, then the cache is updated and the replicas catch up.</span></li>
        </ul>
      ) : (
        <ol className="mt-3 space-y-0.5 text-[13px] leading-snug">
          {steps.map((s, i) => (
            <li key={s.text}>
              <button
                type="button"
                onClick={() => setPicked(i)}
                className={`tp-step flex w-full gap-2 rounded-md px-2 py-1 text-left ${i === cur ? "is-on" : ""}`}
                style={{ ["--tp-c" as string]: color }}
              >
                <span className="tp-num font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                <span>{s.text}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

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
