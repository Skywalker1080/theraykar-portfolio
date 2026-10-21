import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RECENT_WORK, getWork } from "@/lib/work";
import { ProjectSection, StoryBlock } from "@/components/sub-projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return RECENT_WORK.filter((w) => w.slug).map((w) => ({ slug: w.slug! }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};
  return {
    title: work.title,
    description: work.description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { title: work.title, description: work.description, images: [{ url: work.image }] },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();
  const projects = work.projects ?? [];

  return (
    <div className="bg-white">
      <main className="mx-auto min-h-screen w-full max-w-[760px] px-8 pb-[120px] pt-10 md:pt-16">
        <Link
          href="/"
          className="text-[14px] font-medium text-[#6B7280] transition-colors duration-150 hover:text-[#111827]"
        >
          ← back home
        </Link>

        <h1 className="page-heading mt-8">{work.title}</h1>
        <p className="mt-3 text-[17px] leading-[1.65] text-[#4a4948]">{work.description}</p>
        <a href={work.href} target="_blank" rel="noopener noreferrer" className="editorial-link mt-3 inline-block text-[15px]">
          Visit the live product <span className="arrow">→</span>
        </a>

        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#ECECED] bg-[#F7F7F8]">
          <Image src={work.image} alt={work.title} fill priority sizes="(max-width: 768px) 100vw, 760px" className="object-cover" />
        </div>

        {work.story && (
          <div className="mt-10">
            <StoryBlock story={work.story} />
          </div>
        )}

        {projects.length > 0 && (
          <>
            {/* Index: jump straight to any project */}
            <nav aria-label="Projects" className="mt-10">
              <p className="section-label">What I built inside it</p>
              <ol className="space-y-1.5">
                {projects.map((p, i) => (
                  <li key={p.name}>
                    <a
                      href={`#${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="group flex items-baseline gap-4 text-[15px]"
                    >
                      <span className="tabular w-6 font-mono text-[12px] text-[#C026D3]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-semibold text-[#111827] decoration-[#EA00FF] underline-offset-4 group-hover:underline">
                        {p.name}
                      </span>
                      <span className="text-[13px] text-[#9CA3AF]">{p.area}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-12 space-y-14">
              {projects.map((p, i) => (
                <ProjectSection key={p.name} project={p} index={i} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
