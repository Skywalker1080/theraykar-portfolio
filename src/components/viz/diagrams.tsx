import { StageGlyph, type StageKind } from "@/components/arch-diagram";
import { toolLogo } from "@/lib/tools";

/* Post-level diagrams built from the same parts as ArchDiagram: white blocks on hairline
   borders, the animated stage glyphs, tech-stack logos, and pink packets on the connectors. */

export function Block({
  kind,
  title,
  tool,
  dashed,
  children,
}: {
  kind: StageKind;
  title: string;
  tool?: string;
  dashed?: boolean;
  children: React.ReactNode;
}) {
  const logo = tool ? toolLogo(tool) : undefined;
  return (
    <div className={`flex-1 rounded-lg border bg-white px-3 py-2.5 ${dashed ? "border-dashed border-[#F0ABFC]" : "border-[#ECECED]"}`}>
      <div className="flex items-center gap-1.5">
        <StageGlyph kind={kind} />
        <span className="text-[13px] font-semibold leading-tight text-[#111827]">{title}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {logo && <img src={logo} alt={tool} title={tool} className="arch-tool ml-auto h-4 w-4 object-contain" />}
      </div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

/* A connector with a packet going forward and, offset by half a cycle, a reply coming back. */
function Wire({ label, delay = 0 }: { label: string; delay?: number }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 sm:flex-col sm:py-0" aria-hidden="true">
      <span className="cb-wire">
        <i style={{ animationDelay: `${delay}s` }} />
        <i style={{ animationDelay: `${delay + 1.3}s` }} />
      </span>
      <span className="font-mono text-[10.5px] text-[#9CA3AF] sm:max-w-[64px] sm:text-center sm:leading-tight">{label}</span>
    </div>
  );
}

/* Version 2's contract: the model names datasets, a registry checks the names and runs
   tested SQL, and only DataFrames cross back. The model never sees a table. */
export function ContractBoundary() {
  const datasets = ["fundamental", "technicals", "indicators", "ml_signals", "price_history"];
  const declared = new Set(["fundamental", "indicators"]);
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-[1.25fr_auto_1fr_auto_0.9fr] sm:items-stretch sm:gap-2">
      <Block kind="agent" title="Model writes" tool="Python" dashed>
        <pre className="overflow-hidden whitespace-pre-wrap font-mono text-[11px] leading-[1.55] text-[#4B5563]">
          <span className="text-[#C026D3]"># AGENT-META</span>
          {"\nneeds: "}
          <span className="text-[#111827]">fundamental, indicators</span>
          {"\ncandles: 90 · interval: 1d\n\ndef main(data): ..."}
        </pre>
      </Block>
      <Wire label="names only" />
      <Block kind="check" title="Registry">
        <ul className="space-y-[3px] font-mono text-[11px]">
          {datasets.map((d, i) => (
            <li key={d} className={declared.has(d) ? "cb-hit text-[#111827]" : "text-[#C4C7CC]"} style={{ animationDelay: `${0.4 + i * 0.15}s` }}>
              {declared.has(d) ? "✓ " : "· "}
              {d}
            </li>
          ))}
        </ul>
      </Block>
      <Wire label="tested SQL" delay={0.6} />
      <Block kind="store" title="Postgres" tool="PostgreSQL">
        <p className="text-[12px] leading-snug text-[#6B7280]">34 tables. The model never sees a name.</p>
      </Block>
    </div>
  );
}

/* Two sandboxes side by side. In both, the generated code tries to reach out; an AST check is a
   dashed filter it can slip through, the OS boundary is a solid wall it bounces off. */
export function FilterVsBoundary() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[
        { key: "before", title: "Before: a filter", note: "An AST check in Python. Honest mistakes stop; a clever getattr walks out." },
        { key: "after", title: "After: a boundary", note: "Own runtime: no network, no credentials, unprivileged user. AST check kept inside." },
      ].map((p) => (
        <div key={p.key}>
          <div className={`fvb fvb-${p.key} relative h-[128px] overflow-hidden rounded-lg border border-[#ECECED] bg-white`}>
            {p.key === "after" && <span className="fvb-wall absolute inset-[10px] rounded-md border-2 border-[#111827]" />}
            <span className="absolute inset-x-[22%] inset-y-[24%] rounded-md border border-dashed border-[#F0ABFC]" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-[#6B7280]">
              generated code
            </span>
            <span className="fvb-dot absolute top-[calc(50%+14px)] h-[7px] w-[7px] rounded-full bg-[#EA00FF]" />
            <span className="absolute left-[calc(22%+6px)] top-[calc(24%+4px)] font-mono text-[10px] text-[#C026D3]">AST</span>
            {p.key === "after" && (
              <span className="absolute bottom-[14px] right-[16px] font-mono text-[10px] text-[#111827]">OS</span>
            )}
          </div>
          <p className="mt-2 text-[13px] font-semibold text-[#111827]">{p.title}</p>
          <p className="text-[12.5px] leading-snug text-[#6B7280]">{p.note}</p>
        </div>
      ))}
    </div>
  );
}
