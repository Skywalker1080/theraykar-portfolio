import Image from "next/image";
import { ArchDiagram } from "@/components/arch-diagram";
import { ProjectGlyph } from "@/components/project-glyph";
import { Viz } from "@/components/viz/frame";
import { Bars, DotGrid, MismatchTable, RetryTimeline, Deadlines } from "@/components/viz/charts";
import { CheckStack, GrowingFile, Ratchet } from "@/components/viz/animated";
import { ContractBoundary, FilterVsBoundary } from "@/components/viz/diagrams";
import { BurstQueue, BottleneckWalk } from "@/components/viz/systems";
import { CycleDiagram, Transcript, EventStream, FanOut, LogRebuild, ContextMeter } from "@/components/viz/agent";
import { IdStreams, IdSpace, RaceDiagram, AuthorityHub, LiveSnowflake, TickRows, ClockJump } from "@/components/viz/distributed";

export const mdxComponents = {
  // Visualizations available to every post (see components/viz).
  Viz,
  ArchDiagram,
  ProjectGlyph,
  Bars,
  DotGrid,
  MismatchTable,
  RetryTimeline,
  Deadlines,
  CheckStack,
  GrowingFile,
  Ratchet,
  ContractBoundary,
  FilterVsBoundary,
  IdStreams,
  IdSpace,
  RaceDiagram,
  AuthorityHub,
  LiveSnowflake,
  TickRows,
  ClockJump,
  CycleDiagram,
  Transcript,
  EventStream,
  FanOut,
  LogRebuild,
  ContextMeter,
  BurstQueue,
  BottleneckWalk,
  h1: (props: React.ComponentProps<"h1">) => (
    <h1
      className="mt-10 mb-4 text-[28px] font-bold leading-[1.25] tracking-[-0.02em] text-[#111827]"
      {...props}
    />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-8 mb-3 text-[22px] font-semibold tracking-[-0.01em] text-[#111827]"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-6 mb-2 text-[18px] font-semibold text-[#111827]" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="my-4 leading-[24px] text-[#4a4948]" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="font-medium text-[#111827] underline decoration-[#E5E7EB] underline-offset-4 transition-colors duration-150 hover:decoration-[#111827]"
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="my-4 list-disc space-y-1 pl-6 text-[#4a4948]" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="my-4 list-decimal space-y-1 pl-6 text-[#4a4948]" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="leading-[1.75]" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="my-4 border-l-2 border-[#E5E7EB] pl-4 italic text-[#6B7280]"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-[#ECECED]" />,
  // Figure: an explicitly-sized image (true aspect ratio, no distortion) with
  // an optional caption; clicking opens the full-resolution file in a new tab.
  Figure: ({
    src,
    alt,
    width,
    height,
    caption,
  }: {
    src: string;
    alt: string;
    width: string | number;
    height: string | number;
    caption?: string;
  }) => (
    <figure className="my-8">
      <a href={src} target="_blank" rel="noopener noreferrer" className="block">
        <Image
          src={src}
          alt={alt}
          width={Number(width)}
          height={Number(height)}
          sizes="(max-width: 768px) 100vw, 768px"
          className="h-auto w-full rounded-xl border border-[#ECECED] transition-opacity hover:opacity-90"
        />
      </a>
      {caption ? (
        <figcaption className="mt-2 text-center text-[13px] text-[#9CA3AF]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  ),
  img: ({ src, alt }: React.ComponentProps<"img">) => (
    <Image
      src={typeof src === "string" ? src : ""}
      alt={alt ?? ""}
      width={1200}
      height={630}
      sizes="(max-width: 768px) 100vw, 768px"
      className="my-6 h-auto w-full rounded-xl border border-[#ECECED] object-contain"
    />
  ),
};
