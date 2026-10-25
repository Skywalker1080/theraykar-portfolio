"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { StageGlyph } from "@/components/arch-diagram";
import { toolLogo } from "@/lib/tools";
import { InView } from "./frame";
import { useInView, useLoopStep, useReducedMotion } from "./hooks";

/* Visualizations for distributed-systems posts: ID streams, a partitioned ID space, a
   check-then-act race, a central authority, a live Snowflake ID, per-ID vs per-boot
   coordination, and a clock jumping backwards. Same parts as the rest of components/viz. */

type Stream = { name: string; tag?: string; ids: number[] };

/* Servers handing out IDs side by side, one per tick. Any ID that appears on more than one
   server is marked as a collision the moment its second copy lands. */
export function IdStreams({ servers }: { servers: Stream[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const longest = Math.max(...servers.map((s) => s.ids.length));
  const tick = useLoopStep(ref, longest + 5, 700);
  const shown = reduced ? longest : Math.min(tick, longest);

  const counts = new Map<number, number>();
  servers.forEach((s) => s.ids.slice(0, shown).forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1)));
  const issued = servers.reduce((n, s) => n + Math.min(s.ids.length, shown), 0);
  const clashes = [...counts.values()].filter((c) => c > 1).length;

  return (
    <div ref={ref}>
      <ul className="space-y-2">
        {servers.map((s) => (
          <li key={s.name} className="grid grid-cols-[96px_1fr] items-center gap-3 sm:grid-cols-[150px_1fr]">
            <span className="flex flex-col leading-tight">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#111827]">
                <StageGlyph kind="process" />
                {s.name}
              </span>
              {s.tag && <span className="pl-[24px] font-mono text-[11px] text-[#9CA3AF]">{s.tag}</span>}
            </span>
            <span className="flex flex-wrap gap-1.5">
              {s.ids.slice(0, shown).map((id, i) => (
                <span key={i} className={`id-chip ${(counts.get(id) ?? 0) > 1 ? "is-clash" : ""}`}>
                  {id}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <p className={`mt-3 font-mono text-[12px] ${clashes ? "text-[#E11D48]" : "text-[#C026D3]"}`}>
        {clashes ? `✕ ${clashes} ${clashes === 1 ? "ID" : "IDs"} issued twice` : `✓ ${issued} IDs, 0 collisions`}
      </p>
    </div>
  );
}

type Owner = { name: string; rule: string; remainder: number; every: number };

/* A strip of the ID space where every cell is owned by exactly one server (id mod n). Each
   server fills only its own cells, at its own pace, so the reader sees independence and
   zero overlap at once. `every` is how many ticks a server waits between IDs. */
export function IdSpace({ size, start = 0, modulo, owners }: { size: number; start?: number; modulo: number; owners: Owner[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const cells = Array.from({ length: size }, (_, i) => start + i);
  const ownerOf = (id: number) => owners.findIndex((o) => ((id % modulo) + modulo) % modulo === o.remainder);
  // Ticks a server needs to fill all of its cells; the loop holds once the slowest is done.
  const finish = Math.max(...owners.map((o, k) => cells.filter((id) => ownerOf(id) === k).length * o.every));
  const tick = useLoopStep(ref, finish + 6, 380);
  const t = reduced ? finish : tick;

  const filled = new Set<number>();
  owners.forEach((o, k) => {
    const mine = cells.filter((id) => ownerOf(id) === k);
    mine.slice(0, Math.floor(t / o.every)).forEach((id) => filled.add(id));
  });

  return (
    <div ref={ref}>
      <ol className="grid grid-cols-[repeat(auto-fill,minmax(30px,1fr))] gap-1.5">
        {cells.map((id) => {
          const k = ownerOf(id);
          return (
            <li key={id} className={`id-cell id-owner-${k} ${filled.has(id) ? "is-filled" : ""}`}>
              {id}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-[#6B7280]">
        {owners.map((o, k) => (
          <span key={o.name} className="inline-flex items-center gap-1.5">
            <span className={`id-key id-owner-${k} is-filled`} />
            <span className="font-medium text-[#111827]">{o.name}</span> {o.rule}
          </span>
        ))}
      </p>
    </div>
  );
}

type RaceStep = { from: 0 | 1 | "both"; text: string; kind: "msg" | "act" | "clash" };

function Arrow({ reverse }: { reverse?: boolean }) {
  return (
    <span className={`flex flex-1 items-center ${reverse ? "flex-row-reverse" : ""}`} aria-hidden="true">
      <span className={`h-px flex-1 ${reverse ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-[#F4ADFF] to-[#EA00FF]`} />
      <svg width="7" height="10" viewBox="0 0 7 10" fill="none" className={reverse ? "rotate-180" : ""}>
        <path d="M1 1l5 4-5 4" stroke="#EA00FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* A two-actor sequence diagram that plays one row at a time: messages cross between the
   lifelines, actions sit on the actor's own side, and a clash row closes the loop. */
export function RaceDiagram({ actors, steps }: { actors: [string, string]; steps: RaceStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const tick = useLoopStep(ref, steps.length + 4, 1000);
  const shown = reduced ? steps.length : Math.min(tick + 1, steps.length);

  return (
    <div ref={ref} className="relative">
      <div className="grid grid-cols-2 pb-2 text-center text-[13px] font-semibold text-[#111827]">
        {actors.map((a) => (
          <span key={a} className="inline-flex items-center justify-center gap-1.5">
            <StageGlyph kind="process" /> {a}
          </span>
        ))}
      </div>
      {/* lifelines */}
      <span aria-hidden="true" className="absolute bottom-0 left-1/4 top-7 w-px border-l border-dashed border-[#E5E7EB]" />
      <span aria-hidden="true" className="absolute bottom-0 left-3/4 top-7 w-px border-l border-dashed border-[#E5E7EB]" />
      <ol className="relative space-y-1.5">
        {steps.map((s, i) => (
          <li
            key={i}
            // Messages span lifeline to lifeline (the middle half); actions sit on a lifeline.
            className={`race-row grid h-8 items-center ${s.kind === "msg" ? "grid-cols-[1fr_2fr_1fr]" : "grid-cols-2"} ${i < shown ? "is-on" : ""}`}
          >
            {s.kind === "msg" && (
              <>
                <span />
                <span className="flex flex-col items-stretch">
                  <span className="text-center font-mono text-[11px] leading-none text-[#4B5563]">{s.text}</span>
                  <span className="mt-1 flex"><Arrow reverse={s.from === 1} /></span>
                </span>
                <span />
              </>
            )}
            {s.kind === "act" && (
              <>
                {[0, 1].map((side) => (
                  <span key={side} className="relative z-10 flex justify-center">
                    {(s.from === "both" || s.from === side) && <span className="race-act">{s.text}</span>}
                  </span>
                ))}
              </>
            )}
            {s.kind === "clash" && (
              <span className="relative z-10 col-span-2 flex justify-center">
                <span className="race-clash">✕ {s.text}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* Every server makes a round trip to one authority for each ID. Every so often the
   authority goes down and every server stops with it. */
export function AuthorityHub({ clients, hub, tool }: { clients: string[]; hub: string; tool?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const tick = useLoopStep(ref, 10, 800);
  const down = !reduced && tick >= 7;
  const logo = tool ? toolLogo(tool) : undefined;

  return (
    <div ref={ref} className={`hub grid grid-cols-[auto_1fr_auto] items-center gap-y-2 ${down ? "is-down" : ""}`}>
      {clients.map((c, i) => (
        <Fragment key={c}>
          <span className="col-start-1 rounded-lg border border-[#ECECED] bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-[#111827]" style={{ gridRow: i + 1 }}>
            <span className="inline-flex items-center gap-1.5">
              <StageGlyph kind="process" /> {c}
            </span>
          </span>
          <span className="hub-wire col-start-2 mx-2" style={{ gridRow: i + 1 }} aria-hidden="true">
            <i style={{ animationDelay: `${i * 0.35}s` }} />
            <i style={{ animationDelay: `${i * 0.35 + 1.3}s` }} />
          </span>
        </Fragment>
      ))}
      <div
        className="hub-node col-start-3 row-start-1 self-stretch rounded-lg border bg-white px-3 py-2"
        style={{ gridRowEnd: clients.length + 1 }}
      >
        <div className="flex items-center gap-1.5">
          <StageGlyph kind="store" />
          <span className="text-[13px] font-semibold text-[#111827]">{hub}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {logo && <img src={logo} alt={tool} title={tool} className="arch-tool ml-auto h-4 w-4 object-contain" />}
        </div>
        <p className="mt-1 font-mono text-[11px] text-[#6B7280]">next = {down ? "—" : 41 + tick * 3}</p>
        <p className="hub-down mt-1 font-mono text-[11px] text-[#E11D48]">✕ down: nobody gets an ID</p>
      </div>
    </div>
  );
}

const FIELDS = [
  { key: "unused", label: "unused", bits: 1, note: "sign bit" },
  { key: "time", label: "timestamp", bits: 41, note: "≈ 69 years of ms" },
  { key: "worker", label: "worker", bits: 10, note: "1,024 generators" },
  { key: "seq", label: "sequence", bits: 12, note: "4,096 per ms" },
] as const;

// Bit offset where each field starts in the 64-bit string (high bit first).
const FIELD_START = FIELDS.map((_, i) => FIELDS.slice(0, i).reduce((n, f) => n + f.bits, 0));

type Minted = { ms: number; seq: number; id: bigint };

/* A Snowflake generator running in the reader's browser: the 64-bit layout, the fields of
   the ID it just minted, and the last few IDs (which come out in time order). It mints in
   small bursts so the sequence field visibly counts up within a millisecond. */
export function LiveSnowflake({ worker, epoch }: { worker: number; epoch: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const [minted, setMinted] = useState<Minted[]>([]);

  useEffect(() => {
    if (!seen) return;
    let last = -1;
    let seq = 0;
    const mint = () => {
      const ms = Date.now();
      const burst = 1 + (ms % 3); // 1–3 IDs in the same millisecond
      const out: Minted[] = [];
      for (let b = 0; b < burst; b++) {
        seq = ms === last ? (seq + 1) & 4095 : 0;
        last = ms;
        const id = (BigInt(ms - epoch) << BigInt(22)) | (BigInt(worker) << BigInt(12)) | BigInt(seq);
        out.push({ ms, seq, id });
      }
      const newestFirst = [...out].reverse();
      setMinted((prev) => [...newestFirst, ...prev].slice(0, 4));
    };
    const first = setTimeout(mint, 0);
    const id = setInterval(mint, 1400);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [seen, worker, epoch]);

  const cur = minted[0];
  const bin = cur ? cur.id.toString(2).padStart(64, "0") : "0".repeat(64);
  const values: Record<string, string> = cur
    ? { unused: "0", time: `${cur.ms - epoch} ms`, worker: String(worker), seq: String(cur.seq) }
    : { unused: "0", time: "…", worker: String(worker), seq: "…" };

  return (
    <div ref={ref}>
      <div className="flex h-[30px] overflow-hidden rounded-md border border-[#ECECED] bg-white">
        {FIELDS.map((f) => (
          <span
            key={f.key}
            className={`sf-field sf-${f.key} flex items-center justify-center font-mono text-[10.5px]`}
            style={{ flexGrow: f.bits, flexBasis: 0, minWidth: f.bits === 1 ? 10 : 0 }}
            title={`${f.label}: ${f.bits} bits`}
          >
            {f.bits > 1 ? `${f.bits}` : ""}
          </span>
        ))}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-3">
        {FIELDS.filter((f) => f.key !== "unused").map((f) => (
          <div key={f.key}>
            <dt className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#111827]">
              <span className={`sf-key sf-${f.key}`} /> {f.label}
            </dt>
            <dd className="tabular font-mono text-[12px] text-[#C026D3]">{values[f.key]}</dd>
            <dd className="text-[11.5px] leading-snug text-[#9CA3AF]">{f.note}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 break-all font-mono text-[10.5px] leading-[1.6] tracking-[0.02em]">
        {FIELDS.map((f, i) => (
          <span key={f.key} className={`sf-bits-${f.key}`}>
            {bin.slice(FIELD_START[i], FIELD_START[i] + f.bits)}
          </span>
        ))}
      </p>
      <ol className="mt-3 space-y-0.5 border-t border-[#ECECED] pt-2 font-mono text-[12px]">
        {minted.map((m, i) => (
          <li key={m.id.toString()} className={`flex justify-between gap-3 ${i === 0 ? "text-[#111827]" : "text-[#9CA3AF]"}`}>
            <span className="tabular">{m.id.toString()}</span>
            <span>seq {m.seq}</span>
          </li>
        ))}
        {minted.length === 0 && <li className="text-[#9CA3AF]">minting…</li>}
      </ol>
    </div>
  );
}

type TickRow = { label: string; ticks: ("net" | "local")[]; note: string };

/* Each ID (or lease) as a dot: pink dots are network round trips, grey dots stay local. */
export function TickRows({ rows }: { rows: TickRow[] }) {
  let order = 0;
  return (
    <InView className="space-y-4">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px]">
            <span className="font-medium text-[#111827]">{r.label}</span>
            <span className="font-mono text-[12px] text-[#6B7280]">{r.note}</span>
          </div>
          <div className="flex flex-wrap gap-[6px]">
            {r.ticks.map((t, i) => (
              <span key={i} className={`tick tick-${t}`} style={{ transitionDelay: `${order++ * 60}ms` }} />
            ))}
          </div>
        </div>
      ))}
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#9CA3AF]">
        <span className="inline-flex items-center gap-1.5"><span className="tick tick-net is-key" /> network round trip</span>
        <span className="inline-flex items-center gap-1.5"><span className="tick tick-local is-key" /> local, no network</span>
      </p>
    </InView>
  );
}

/* Wall-clock time (grey) against the timestamps the generator issues (pink). When NTP pulls
   the clock back, the generator holds at its last timestamp until the clock passes it. */
export function ClockJump() {
  return (
    <div>
      <svg viewBox="0 0 320 150" className="mx-auto block w-full max-w-[480px]" role="img" aria-label="The clock jumps back; issued timestamps hold flat until the clock catches up">
        <line x1="20" y1="130" x2="310" y2="130" stroke="#E5E7EB" />
        <line x1="20" y1="10" x2="20" y2="130" stroke="#E5E7EB" />
        <text x="310" y="144" textAnchor="end" className="cj-label">real time</text>
        <text x="24" y="16" className="cj-label">timestamp</text>
        {/* the window where issuing would duplicate */}
        <rect x="175" y="10" width="75" height="120" fill="#FDF4FF" />
        <text x="212" y="124" textAnchor="middle" className="cj-label" fill="#C026D3">wait / refuse</text>
        {/* wall clock */}
        <path d="M20 120 L175 62 M175 92 L310 41" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <path d="M175 62 L175 92" stroke="#E11D48" strokeWidth="1.2" />
        <text x="180" y="108" className="cj-label" fill="#E11D48">NTP: −50 ms</text>
        {/* issued timestamps */}
        <path className="cj-issued" d="M20 120 L175 62 L250 62 L310 41" stroke="url(#cj-g)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
        <circle cx="175" cy="62" r="3" fill="#EA00FF" />
        <text x="150" y="54" textAnchor="end" className="cj-label">last_ms</text>
        <defs>
          <linearGradient id="cj-g" x1="0" x2="1" y1="0" y2="0">
            <stop stopColor="#F4ADFF" />
            <stop offset="1" stopColor="#EA00FF" />
          </linearGradient>
        </defs>
      </svg>
      <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#9CA3AF]">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 border-t border-dashed border-[#9CA3AF]" /> wall clock</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-[2px] w-4 bg-[#EA00FF]" /> timestamps issued</span>
      </p>
    </div>
  );
}
