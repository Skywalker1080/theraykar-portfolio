import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { RECENT_WORK } from "@/lib/work";
import { ProjectGlyph } from "@/components/project-glyph";
import { HobbyGlyph } from "@/components/hobby-glyph";
import { NowHud } from "@/components/now-hud";
import { TechStackStrip } from "@/components/tech-stack-strip";
import { FocusPipeline } from "@/components/focus-pipeline";
import { TOOLS } from "@/lib/tools";

/* ════════════════════════════════════════════════════════════════
   DATA — Pranav content mapped onto the reference structure
   ════════════════════════════════════════════════════════════════ */

const INTRO = [
  {
    label: "What",
    text: "I'm an AI engineer on the founding team at Crypto Prism. I build production AI agents end to end: the data pipelines that feed them, the backends they run on, the evals that keep them honest, and the cloud deploys that ship them.",
  },
  {
    label: "Why",
    text: "Most agents look great in a demo and break in production. The difference is the “boring” infra around the model, and that's the part I love building.",
  },
  {
    label: "How",
    text: "I own the full path from raw data to a live endpoint, with Python, FastAPI, LangGraph, Kafka and AWS. I care deeply about craft and polish, and ship something every day.",
  },
];

const EXPERIENCE = [
  {
    company: "Crypto Prism",
    logo: "/cp.svg",
    role: "Founding AI Engineer",
    about: "An AI crypto analytics platform: ask about any coin in plain English and get a quant-grade read.",
    period: "2024",
    href: "https://cryptoprism-io.web.app/",
    // Outcome first: the bold lead is what a recruiter should take away from each line.
    highlights: [
      { lead: "Shipped 3 AI agents to production", text: "taking each from prototype to a live product used by real users." },
      { lead: "Secured $10K in funding from AWS", text: "to run and scale the platform." },
      { lead: "Owned the AWS infrastructure", text: "designing and deploying the cloud stack the product runs on." },
      { lead: "Helped build the team", text: "interviewing and assessing interns and freelancers." },
      { lead: "Worked directly with stakeholders and beta users", text: "turning their feedback into product decisions, and reviewing code across the team." },
    ],
  },
  {
    company: "Times Internet",
    logo: "/times-internet.png",
    role: "Creative Engineer",
    about: "India's largest digital products company, behind Times of India, Cricbuzz and Gaana.",
    period: "2024",
    highlights: [
      { lead: "Built an AI-driven branching narrative game", text: "set in the world of the Mahabharata, where player choices shape the story." },
      { lead: "Designed the game dynamics", text: "owning the game plan, branching logic and player progression." },
      { lead: "Built RAG pipelines and custom GPTs", text: "that generate story episodes grounded in the source mythology." },
      { lead: "Worked directly with the CXOs", text: "brainstorming product direction and shaping the game with them." },
      { lead: "Shaped the creative side", text: "contributing to platform UI design, episode generation and the story narrative." },
    ],
  },
];

const EDUCATION = [
  {
    school: "Savitribai Phule Pune University",
    logo: "/sppu.png",
    degree: "B.E in Automation and Robotics",
    period: "2022–2026",
  },
];

// Each side project shows an image beside its card; swap the placeholder paths for real screenshots.
const SIDE_PROJECTS = [
  {
    title: "Crypto Quant Data Engine",
    description:
      "A production pipeline that ingests 1,000 coins daily, computes 100+ quant indicators in parallel, and has rebuilt 2.6M rows of history with health checks and safe, versioned backfills.",
    image: "/placeholder-project.svg",
    href: "https://github.com/CryptoPrism-io/CryptoPrism-DB-D",
  },
  {
    title: "Context Window",
    description:
      "A calmer way to save links — triage before you hoard, and search everything later.",
    image: "/context-window.png",
    href: "http://context-window.vercel.app/",
  },
  {
    title: "MANAS CORE",
    description:
      "A private AI journal that turns your daily notes into searchable insights.",
    image: "/placeholder-project.svg",
    href: "https://github.com/Skywalker1080/manasCore.git",
  },
  {
    title: "ALPHA STREAM",
    description:
      "Live crypto forecasts that update themselves as the market moves.",
    image: "/placeholder-project.svg",
    href: "#",
  },
  {
    title: "Gyanmarg",
    description:
      "A gamified learning app that turns 45+ books into bite-sized lessons, using spaced repetition and active recall so what you read actually sticks.",
    image: "/placeholder-project.svg",
    href: "https://ai-polymind.web.app",
  },
  {
    title: "Enterprise RAG",
    description:
      "Upload your documents and ask questions about them, with every answer cited back to the exact passage.",
    image: "/placeholder-project.svg",
    href: "https://github.com/Skywalker1080/production-rag",
  },
];

// Life outside work, shown as a row of slightly tilted "stickers" that straighten on hover.
const BEYOND = [
  { kind: "gaming" as const, title: "Gaming", line: "Story-driven worlds and the occasional all-nighter." },
  { kind: "training" as const, title: "Training", line: "Lifting most days. My body is a long-term project too." },
  { kind: "reading" as const, title: "Reading", line: "Self-help books that change how I think, one habit at a time." },
  { kind: "riding" as const, title: "Riding", line: "Long rides with no destination. Best way to clear my head." },
  { kind: "cooking" as const, title: "Cooking", line: "Exotic dishes from scratch. Results vary, fun doesn't." },
];

const PRINCIPLES = [
  "Always think from first principles.",
  "Everything in life is a project: body, mind, money, relationships.",
  "Derive your vision from your anti-vision.",
  "The fastest way to change your life is to reflect on it obsessively, and never lie to yourself.",
  "Keep life simple: What, Why and How. That's it.",
];

const EMAIL = "pranav.darekar1080@gmail.com";

const ELSEWHERE = [
  { name: "GitHub", handle: "@Skywalker1080", note: "Where I ship", href: "https://github.com/Skywalker1080" },
  { name: "X", handle: "@the_ray_kar", note: "Learnings from everyday building", href: "https://x.com/the_ray_kar" },
  { name: "LinkedIn", handle: "pranav-darekar", note: "Career updates and longer posts", href: "https://linkedin.com/in/pranav-darekar" },
  { name: "Email", handle: EMAIL, note: "The fastest way to reach me", href: `mailto:${EMAIL}` },
];

// "2026-06-28" -> "Jun 28, 2026"
function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ════════════════════════════════════════════════════════════════
   SMALL PIECES
   ════════════════════════════════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="section-label">{children}</h2>;
}

function LogoMark({ src, alt, letter }: { src?: string; alt: string; letter: string }) {
  if (src) {
    return (
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-[#ECECED] bg-white">
        <Image src={src} alt={alt} width={24} height={24} className="h-6 w-6 object-contain" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border border-[#ECECED] bg-[#F7F7F8] text-[12px] font-semibold text-[#6B7280]">
      {letter}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */

export default function Home() {
  const posts = getAllPosts().slice(0, 2);

  return (
    <div className="bg-white">
      <main className="mx-auto w-full max-w-[760px] px-8 pb-[120px] pt-10 md:pt-16">
        {/* ── Top bar: name + nav ─────────────────────────── */}
        <header className="mb-14 flex items-center justify-between">
          {/* Name occasionally shimmers into the handle; see .brand-swap in globals.css */}
          <p className="brand-swap text-[13px] font-semibold tracking-[0.08em] text-[#111827]">
            <span className="brand-name uppercase">Pranav Darekar</span>
            <span className="brand-handle" aria-hidden="true">/theraykar</span>
          </p>
          <nav className="flex items-center gap-5 text-[14px] font-medium text-[#6B7280]">
            <Link href="/blog" className="transition-colors duration-150 hover:text-[#111827]">
              Writing
            </Link>
            <a
              href="https://github.com/Skywalker1080"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-150 hover:text-[#111827]"
            >
              GitHub
            </a>
            <a
              href="https://x.com/the_ray_kar"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-150 hover:text-[#111827]"
            >
              Twitter
            </a>
          </nav>
        </header>

        {/* ── Hero ────────────────────────────────────────── */}
        <section className="mb-[64px]">
          <div className="mb-6 flex items-center gap-3 sm:gap-5">
            <Image
              src="/pfp.jpg"
              alt="Pranav Darekar"
              width={96}
              height={96}
              className="h-24 w-24 shrink-0 rounded-full object-cover"
            />
            <TechStackStrip tools={TOOLS} />
          </div>
          <h1 className="page-heading">
            Building production AI agents &amp; the &ldquo;boring&rdquo; infra
            behind them.
          </h1>
          <p className="mt-5 text-[15px] text-[#6B7280]">
            In practice, that means I build these for your AI agents:
          </p>
          <FocusPipeline />
          {/* What / Why / How: a quick read on the specialization for anyone skimming */}
          <dl className="mt-8 space-y-4 text-[17px] leading-[1.65] text-[#4a4948]">
            {INTRO.map((row) => (
              <div key={row.label} className="grid gap-1 sm:grid-cols-[64px_1fr] sm:gap-4">
                <dt className="pt-[5px] font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-[#C026D3]">
                  {row.label}
                </dt>
                <dd>{row.text}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 text-[17px] leading-[1.65] text-[#4a4948]">
            <p>
              Some of the best conversations I&apos;ve had started with a random
              hello on the internet. So…{" "}
              <a href={`mailto:${EMAIL}`} className="editorial-link">
                Message me <span className="arrow">→</span>
              </a>
            </p>
          </div>
        </section>

        {/* ── Experience ──────────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Experience</SectionLabel>
          <ul className="space-y-[24px]">
            {EXPERIENCE.map((job) => {
              const row = (
                <>
                  <span className="flex min-w-0 items-center gap-3">
                    <LogoMark src={job.logo} alt={`${job.company} logo`} letter={job.company[0]} />
                    <span className="truncate text-[16px] font-semibold tracking-[-0.01em] text-[#111827]">
                      {job.company}
                    </span>
                  </span>
                  <span className="hidden text-[15px] text-[#6B7280] md:block">{job.role}</span>
                  <span className="tabular ml-auto text-[14px] text-[#9CA3AF]">{job.period}</span>
                </>
              );
              const cls =
                "flex items-center gap-4 rounded-lg px-3 py-2 transition-colors duration-150 hover:bg-gray-50/50";
              return (
                <li key={job.company}>
                  {job.highlights ? (
                    // Achievements sit behind a dropdown; the pulsing hint nudges a click until it's opened.
                    <details className="exp-details group">
                      <summary className={`${cls} cursor-pointer list-none flex-wrap [&::-webkit-details-marker]:hidden`}>
                        {row}
                        {job.about && (
                          <span className="basis-full pl-[36px] text-[14px] leading-snug text-[#6B7280]">
                            {job.about}
                          </span>
                        )}
                        <span className="exp-hint basis-full pl-[36px] font-mono text-[12px] text-[#C026D3]">
                          <span className="group-open:hidden">See what I achieved here</span>
                          <span className="hidden group-open:inline">Hide achievements</span>
                          <span className="ml-1 inline-block transition-transform duration-200 group-open:rotate-180">▾</span>
                        </span>
                      </summary>
                      <p className="px-3 pt-1 text-[14px] text-[#6B7280] md:hidden">{job.role}</p>
                      <ul className="exp-panel mt-3 space-y-2 pl-[48px] pr-3">
                        {job.highlights.map((h) => (
                          <li key={h.lead} className="relative text-[15px] leading-[1.6] text-[#6B7280]">
                            <span
                              aria-hidden="true"
                              className="absolute -left-[14px] top-[9px] h-[5px] w-[5px] rounded-full bg-gradient-to-b from-[#F4ADFF] to-[#EA00FF]"
                            />
                            <span className="font-semibold text-[#111827]">{h.lead}</span>, {h.text}
                          </li>
                        ))}
                      </ul>
                      {job.href && (
                        <a
                          href={job.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="editorial-link ml-[48px] mt-3 inline-block text-[14px]"
                        >
                          Visit {job.company} <span className="arrow">→</span>
                        </a>
                      )}
                    </details>
                  ) : (
                    <>
                      {job.href ? (
                        <a href={job.href} target="_blank" rel="noopener noreferrer" className={cls}>
                          {row}
                        </a>
                      ) : (
                        <div className={cls}>{row}</div>
                      )}
                      <p className="px-3 pt-1 text-[14px] text-[#6B7280] md:hidden">{job.role}</p>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Recent Work ─────────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Recent Work</SectionLabel>
          <div className="space-y-6">
            {RECENT_WORK.map((work) => {
              const href = work.slug ? `/work/${work.slug}` : work.href;
              const external = !href.startsWith("/");
              return (
                <a
                  key={work.title}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group block overflow-hidden rounded-xl border border-[#ECECED] bg-white transition-colors duration-150 hover:border-[#E5E7EB] hover:bg-[#F7F7F8]"
                >
                  <span className="relative block aspect-[16/9] w-full overflow-hidden bg-[#F7F7F8]">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 760px"
                      className="object-cover"
                    />
                  </span>
                  <span className="block p-5">
                    <span className="block text-[16px] font-semibold tracking-[-0.01em] text-[#111827]">
                      {work.title}
                    </span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-[#6B7280]">
                      {work.description}
                    </span>
                    {work.projects && (
                      // Teaser for the detail page: what's inside, and a nudge to open it.
                      <span className="mt-4 block border-t border-[#ECECED] pt-3">
                        <span className="block text-[13px] text-[#6B7280]">
                          {work.projects.length} projects inside
                        </span>
                        <span className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                          {work.projects.map((p) => (
                            <span key={p.name} className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[#111827]">
                              <ProjectGlyph kind={p.area} size={26} />
                              {p.name}
                            </span>
                          ))}
                        </span>
                        <span className="sub-hint mt-2 inline-block font-mono text-[12px] text-[#C026D3]">
                          See how I built it{" "}
                          <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">→</span>
                        </span>
                      </span>
                    )}
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── Side Projects ───────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Side Projects</SectionLabel>
          <p className="mb-5 text-[16px] leading-[1.65] text-[#4a4948]">
            I&apos;m learning inference optimization and exploring new AI tools.
            Earlier, I built local-first journaling and agentic forecasting
            systems.
          </p>
          <div className="space-y-4">
            {SIDE_PROJECTS.map((p) => {
              const external = p.href.startsWith("http");
              return (
                <a
                  key={p.title}
                  href={p.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4"
                >
                  <span className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border border-[#ECECED] bg-[#F7F7F8] sm:w-[220px]">
                    <Image
                      src={p.image}
                      alt={`${p.title} preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, 220px"
                      unoptimized={p.image.endsWith(".svg")}
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </span>
                  <span className="flex flex-1 flex-col justify-center rounded-xl border border-[#ECECED] bg-white p-5 transition-colors duration-150 group-hover:bg-[#F7F7F8]">
                    <span className="block text-[15px] font-semibold text-[#111827]">
                      {p.title}
                    </span>
                    <span className="mt-2 block text-[14px] leading-relaxed text-[#6B7280]">
                      {p.description}
                    </span>
                    <span className="mt-3 block text-[14px] font-medium text-[#111827]">
                      Open <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">→</span>
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── Beyond work ─────────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Beyond Work</SectionLabel>
          <p className="mb-6 text-[16px] leading-[1.65] text-[#4a4948]">
            When I log off, I&apos;m usually doing one of these. They&apos;re how
            I recharge, and honestly where a lot of my best ideas show up.
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {BEYOND.map((b, i) => (
              <li
                key={b.title}
                className="beyond-sticker group rounded-2xl border border-[#ECECED] bg-white p-4 text-center"
                style={{ "--tilt": `${i % 2 === 0 ? -2.5 : 2.5}deg` } as React.CSSProperties}
              >
                <span className="beyond-glyph inline-block">
                  <HobbyGlyph kind={b.kind} />
                </span>
                <span className="mt-3 block text-[15px] font-semibold text-[#111827]">{b.title}</span>
                <span className="mt-1 block text-[12.5px] leading-snug text-[#6B7280]">{b.line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Now ─────────────────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Now</SectionLabel>
          <NowHud />
        </section>

        {/* ── Favourite Tools ─────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Favourite Tools</SectionLabel>
          <p className="mb-5 text-[16px] leading-[1.65] text-[#4a4948]">
            I&apos;m drawn to tools that feel functional and well-considered,
            where someone has clearly cared about the details.
          </p>
          <ul className="flex flex-wrap gap-2">
            {TOOLS.map((t) => (
              <li
                key={t.name}
                className="inline-flex items-center gap-2 rounded-full border border-[#ECECED] bg-white py-1.5 pl-2 pr-3.5 text-[14px] font-medium text-[#111827]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.logo} alt="" className="h-[18px] w-[18px] object-contain" />
                {t.name}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Principles ──────────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Principles</SectionLabel>
          <ol className="space-y-3">
            {PRINCIPLES.map((p, i) => (
              <li key={p} className="flex gap-4 text-[16px] leading-[1.65] text-[#4a4948]">
                <span className="tabular shrink-0 pt-[3px] font-mono text-[12px] text-[#C026D3]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p}
              </li>
            ))}
          </ol>
        </section>

        {/* ── Writing (blog — kept feature) ───────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Writing</SectionLabel>
          {posts.length === 0 ? (
            <p className="text-[16px] text-[#6B7280]">
              Notes and experiments on AI/ML —{" "}
              <Link href="/blog" className="editorial-link">
                all posts <span className="arrow">→</span>
              </Link>
            </p>
          ) : (
            <div className="divide-y divide-[#F3F4F6] border-y border-[#ECECED]">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block py-5">
                  <time dateTime={post.date} className="tabular font-mono text-[12px] text-[#C026D3]">
                    {formatDate(post.date)}
                  </time>
                  <span className="mt-1 block text-[17px] font-semibold tracking-[-0.01em] text-[#111827] decoration-[#EA00FF] group-hover:underline group-hover:underline-offset-4">
                    {post.title}
                  </span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-[#6B7280]">
                    {post.description}
                  </span>
                </Link>
              ))}
            </div>
          )}
          <p className="mt-4">
            <Link href="/blog" className="editorial-link text-[16px]">
              All writing <span className="arrow">→</span>
            </Link>
          </p>
        </section>

        {/* ── Around the Internet ─────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Around the Internet</SectionLabel>
          <ul className="divide-y divide-[#F3F4F6] border-y border-[#ECECED]">
            {ELSEWHERE.map((e) => {
              const external = e.href.startsWith("http");
              return (
                <li key={e.name}>
                  <a
                    href={e.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group flex items-baseline gap-4 py-3.5"
                  >
                    <span className="w-[72px] shrink-0 text-[15px] font-semibold text-[#111827]">{e.name}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[13px] text-[#C026D3]">{e.handle}</span>
                      <span className="block text-[14px] text-[#6B7280]">{e.note}</span>
                    </span>
                    <span className="shrink-0 text-[16px] text-[#9CA3AF] transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#EA00FF]">
                      ↗
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Education ───────────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Education</SectionLabel>
          <ul className="space-y-[24px]">
            {EDUCATION.map((edu) => (
              <li
                key={edu.school}
                className="flex items-center gap-4 rounded-lg px-3 py-2 transition-colors duration-150 hover:bg-gray-50/50"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <LogoMark src={edu.logo} alt={`${edu.school} logo`} letter={edu.school[0]} />
                  <span className="truncate text-[16px] font-semibold tracking-[-0.01em] text-[#111827]">
                    {edu.school}
                  </span>
                </span>
                <span className="hidden text-[15px] text-[#6B7280] md:block">{edu.degree}</span>
                <span className="tabular ml-auto shrink-0 text-[14px] text-[#9CA3AF]">
                  {edu.period}
                </span>
              </li>
            ))}
          </ul>
          {EDUCATION.map((edu) => (
            <p key={edu.school} className="mt-1 px-3 text-[14px] leading-relaxed text-[#6B7280] md:hidden">
              {edu.degree}
            </p>
          ))}
        </section>

        {/* ── Footer ──────────────────────────────────────── */}
        <footer>
          <div className="rounded-2xl border border-[#F5D0FE] bg-gradient-to-b from-[#FDF4FF] to-white p-6">
            <p className="text-[18px] font-semibold tracking-[-0.01em] text-[#111827]">
              Building AI agents and need the infra to hold up?
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-[#6B7280]">
              I&apos;m open to founding-engineer roles and select contract work. Say hello.
            </p>
            <a href={`mailto:${EMAIL}`} className="editorial-link mt-4 inline-block text-[16px]">
              Message me <span className="arrow">→</span>
            </a>
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-[#ECECED] pt-6 text-[14px] text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
            <p>Pune, India — perfect weather for a long build :)</p>
            <div className="flex items-center gap-5 font-medium">
              {ELSEWHERE.filter((e) => e.name !== "Email").map((e) => (
                <a
                  key={e.name}
                  href={e.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-150 hover:text-[#111827]"
                >
                  {e.name}
                </a>
              ))}
            </div>
          </div>
          <p className="mt-4 font-mono text-[12px] text-[#9CA3AF]">© {new Date().getFullYear()} Pranav Darekar</p>
        </footer>
      </main>
    </div>
  );
}
