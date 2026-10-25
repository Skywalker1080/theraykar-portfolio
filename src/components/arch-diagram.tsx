/* Minimal block diagram for the "For the nerds" sections and blog posts: stages left to right
   (stacked on phones, or always with `vertical`), joined by connectors a small packet travels
   along, and a highlight that steps through the stages in order. Each block carries a tiny
   animated glyph for its kind, plus an optional tech-stack logo and a side branch
   (a retry loop, an early exit) shown as a chip. */

import { toolLogo } from "@/lib/tools";
import { withArrows } from "@/components/viz/arrow";

export type StageKind = "source" | "process" | "model" | "store" | "check" | "ui" | "agent" | "api";

export type Stage = { kind: StageKind; title: string; detail: string; tool?: string; branch?: string };

const STEP_S = 1.4; // seconds the highlight spends on each stage

export function StageGlyph({ kind }: { kind: StageKind }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className={`sg sg-${kind}`}>
      {kind === "source" && (
        <>
          <circle cx="9" cy="9" r="2.5" fill="#EA00FF" />
          <circle className="sg-ring" cx="9" cy="9" r="6" stroke="#EA00FF" strokeWidth="1.5" />
        </>
      )}
      {kind === "process" && (
        <circle className="sg-spin" cx="9" cy="9" r="6" stroke="#EA00FF" strokeWidth="2" strokeDasharray="4 3" />
      )}
      {kind === "model" && (
        <>
          <circle className="sg-node" cx="4" cy="5" r="2" fill="#EA00FF" />
          <circle className="sg-node" cx="14" cy="5" r="2" fill="#EA00FF" />
          <circle className="sg-node" cx="9" cy="14" r="2" fill="#EA00FF" />
          <path d="M4 5L9 14L14 5" stroke="#F4ADFF" strokeWidth="1.2" />
        </>
      )}
      {kind === "store" && (
        <>
          <ellipse cx="9" cy="4.5" rx="6" ry="2.2" stroke="#EA00FF" strokeWidth="1.5" />
          <path d="M3 4.5v9c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2v-9" stroke="#EA00FF" strokeWidth="1.5" />
          <path className="sg-fill" d="M3 9.5c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2" stroke="#EA00FF" strokeWidth="1.5" />
        </>
      )}
      {kind === "check" && (
        <path className="sg-tick" d="M3.5 9.5l3.5 3.5 7.5-8" stroke="#EA00FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
      )}
      {kind === "ui" && (
        <>
          <rect x="2" y="3" width="14" height="12" rx="2" stroke="#EA00FF" strokeWidth="1.5" />
          <rect className="sg-blink" x="5" y="8" width="5" height="2" rx="1" fill="#EA00FF" />
        </>
      )}
      {kind === "agent" && (
        <path className="sg-twinkle" d="M9 2l1.8 5.2L16 9l-5.2 1.8L9 16l-1.8-5.2L2 9l5.2-1.8z" fill="#EA00FF" />
      )}
      {kind === "api" && (
        <>
          <path className="sg-right" d="M2 6h11m-3-3l3 3-3 3" stroke="#EA00FF" strokeWidth="1.5" strokeLinecap="round" />
          <path className="sg-left" d="M16 12H5m3-3l-3 3 3 3" stroke="#F4ADFF" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function ArchDiagram({
  stages,
  caption,
  vertical = false,
  className = "my-6",
}: {
  stages: Stage[];
  caption?: string;
  vertical?: boolean;
  className?: string;
}) {
  const cycle = `${stages.length * STEP_S}s`;
  // On wider screens the flow reads in rows of three; a row starts without a connector.
  const perRow = 3;
  const layout = vertical ? "arch-v flex flex-col gap-2" : "flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-x-0 sm:gap-y-3";
  return (
    <figure className={className}>
      <ol className={`arch ${layout}`}>
        {stages.map((s, i) => (
          <li key={s.title} className={vertical ? "flex flex-col" : "flex flex-col sm:flex-row sm:items-stretch"}>
            {/* Every cell gets a connector slot so columns line up; it's hidden where a row starts. */}
            <span
              aria-hidden="true"
              className={`arch-link ${i === 0 ? (vertical ? "hidden" : "hidden sm:block") : ""} ${!vertical && i % perRow === 0 ? "sm:invisible" : ""}`}
              style={{ animationDuration: cycle, animationDelay: `${(i - 0.5) * STEP_S}s` }}
            />
            <div
              className="arch-block flex-1 rounded-lg border border-[#ECECED] bg-white px-3 py-2.5"
              style={{ animationDuration: cycle, animationDelay: `${i * STEP_S}s` }}
            >
              <div className="flex items-center gap-1.5">
                <StageGlyph kind={s.kind} />
                <span className="text-[13px] font-semibold leading-tight text-[#111827]">{withArrows(s.title)}</span>
                {s.tool && toolLogo(s.tool) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={toolLogo(s.tool)} alt={s.tool} title={s.tool} className="arch-tool ml-auto h-4 w-4 object-contain" />
                )}
              </div>
              <p className="mt-1 text-[12px] leading-snug text-[#6B7280]">{withArrows(s.detail)}</p>
              {s.branch && <p className="arch-branch mt-1.5 font-mono text-[11px] text-[#C026D3]">{withArrows(s.branch)}</p>}
            </div>
          </li>
        ))}
      </ol>
      {caption && <figcaption className="mt-2 text-[12.5px] text-[#9CA3AF]">{caption}</figcaption>}
    </figure>
  );
}
