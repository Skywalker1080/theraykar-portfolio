import Image from "next/image";
import type { GlyphKind } from "@/components/project-glyph";
import { ArchDiagram, type Stage } from "@/components/arch-diagram";

export type Story = { what: string; why: string; how: string };

export type SubProject = Story & {
  name: string;
  area: GlyphKind;
  image?: string;
  stack?: string[];
  repo?: string;
  nerds?: { stages: Stage[]; notes: string[] }; // technical deep-dive, collapsed by default
};

/* What / Why / How, laid out like the homepage intro: a narrow label column and the text. */
export function StoryBlock({ story }: { story: Story }) {
  const rows = [
    { label: "What", text: story.what },
    { label: "Why", text: story.why },
    { label: "How", text: story.how },
  ];
  return (
    <dl className="space-y-4 text-[16px] leading-[1.65] text-[#4a4948]">
      {rows.map((row) => (
        <div key={row.label} className="grid gap-1 sm:grid-cols-[64px_1fr] sm:gap-4">
          <dt className="pt-[4px] font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-[#C026D3]">
            {row.label}
          </dt>
          <dd>{row.text}</dd>
        </div>
      ))}
    </dl>
  );
}

/* One project inside a larger platform, written up for its detail page in plain language:
   What / Why / How, a screenshot if there is one, and a quiet footer with the tools and repo. */
export function ProjectSection({ project: p, index }: { project: SubProject; index: number }) {
  return (
    <section id={p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="scroll-mt-10 border-t border-[#ECECED] pt-8">
      <div className="mb-5">
        <p className="font-mono text-[12px] text-[#C026D3]">
          {String(index + 1).padStart(2, "0")} · <span className="uppercase tracking-[0.08em]">{p.area}</span>
        </p>
        <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-[#111827]">{p.name}</h2>
      </div>
      <StoryBlock story={p} />
      {p.image && (
        <span className="relative mt-6 block aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#ECECED] bg-[#F7F7F8]">
          <Image src={p.image} alt={`${p.name} screenshot`} fill sizes="(max-width: 768px) 100vw, 760px" className="object-cover" />
        </span>
      )}
      {p.nerds && (
        // Kept out of the main read: plain language first, internals for whoever wants them.
        <details className="nerds group mt-6 rounded-xl border border-[#ECECED] bg-[#FCFCFD]">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 [&::-webkit-details-marker]:hidden">
            <span className="font-mono text-[12.5px] font-semibold text-[#C026D3]">
              For the nerds <span className="font-normal text-[#9CA3AF]">· how it&apos;s built</span>
            </span>
            <span className="font-mono text-[16px] leading-none text-[#9CA3AF] transition-transform duration-200 group-open:rotate-45">+</span>
          </summary>
          <div className="exp-panel border-t border-[#ECECED] px-4 pb-5">
            <ArchDiagram stages={p.nerds.stages} />
            <ul className="space-y-2.5">
              {p.nerds.notes.map((n) => (
                <li key={n} className="relative pl-4 text-[14px] leading-[1.6] text-[#4a4948]">
                  <span aria-hidden="true" className="absolute left-0 top-[9px] h-[5px] w-[5px] rounded-full bg-[#EA00FF]" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}
      {(p.stack || p.repo) && (
        <p className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[13.5px] text-[#9CA3AF]">
          {p.stack && <span>Built with {p.stack.join(", ")}</span>}
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noopener noreferrer" className="editorial-link text-[14px]">
              See the code <span className="arrow">→</span>
            </a>
          )}
        </p>
      )}
    </section>
  );
}
