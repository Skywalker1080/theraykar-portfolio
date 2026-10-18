import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

/* ════════════════════════════════════════════════════════════════
   DATA — Pranav content mapped onto the reference structure
   ════════════════════════════════════════════════════════════════ */

const EXPERIENCE = [
  {
    company: "Crypto Prism",
    logo: "/cp.svg",
    role: "AI Engineer",
    period: "2025",
    href: "https://cryptoprism-io.web.app/",
  },
  {
    company: "Coolboots Media",
    role: "Creative Engineer",
    period: "2024",
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

const RECENT_WORK = [
  {
    title: "Crypto Prism",
    description:
      "Ask about any coin in plain English and get an instant, quant-grade read on it.",
    image: "/cp-website.png",
    href: "https://cryptoprism-io.firebaseapp.com/",
  },
  {
    title: "Context Window",
    description:
      "A calmer way to save links — triage before you hoard, and search everything later.",
    image: "/context-window.png",
    href: "http://context-window.vercel.app/",
  },
];

const SIDE_PROJECTS = [
  {
    title: "MANAS CORE",
    description:
      "A private AI journal that turns your daily notes into searchable insights.",
    href: "https://github.com/Skywalker1080/manasCore.git",
  },
  {
    title: "ALPHA STREAM",
    description:
      "Live crypto forecasts that update themselves as the market moves.",
    href: "#",
  },
  {
    title: "Illustrative Guide to Git",
    description:
      "A visual, plain-English walkthrough of how Git actually works.",
    href: "/blog/illustrative-guide-to-git",
  },
];

const BEYOND = [
  "Gaming",
  "Plane spotting",
  "Blender 3D",
  "Weight lifting",
  "Chess",
  "Long walks",
  "Think and Grow Rich",
  "Deep Learning (Goodfellow)",
  "The Red Queen (Ridley)",
  "Reinforcement Learning",
  "Robotics",
  "LLM infrastructure",
];

const NOW_STATS = [
  {
    icon: "🚀",
    value: "Daily",
    label: "Build streak",
    note: "Shipping on Crypto Prism every day.",
  },
  {
    icon: "🏋️",
    value: "5× / week",
    label: "Training",
    note: "Weight lifting and long walks.",
  },
  {
    icon: "📚",
    value: "Always",
    label: "Reading",
    note: "DL systems, RL, and inference optimization.",
  },
  {
    icon: "🧠",
    value: "Deep work",
    label: "Default mode",
    note: "Fewer meetings, longer builds.",
  },
];

const TOOLS = [
  { name: "Python", logo: "/logos/python.svg", note: "The default for anything with gradients or data." },
  { name: "FastAPI", logo: "/logos/fastapi.svg", note: "Ships ML backends fast, with types end to end." },
  { name: "Next.js", logo: "/logos/nextdotjs.svg", note: "Frontends that go from idea to URL quickly." },
  { name: "PostgreSQL", logo: "/logos/postgresql.svg", note: "The database I reach for first." },
  { name: "Docker", logo: "/logos/docker.svg", note: "If it runs here, it runs there." },
  { name: "AWS", logo: "/aws-svg 1.png", note: "Where the production infra lives." },
  { name: "LangGraph", logo: "/logos/langgraph.svg", note: "For agents that need to stay in control." },
  { name: "MLflow", logo: "/logos/mlflow.svg", note: "Keeps experiments honest and reproducible." },
  { name: "PyTorch", logo: "/logos/pytorch.svg", note: "My default for training and fine-tunes." },
  { name: "Claude Code", logo: "/logos/anthropic.svg", note: "The pair programmer I use every day." },
  { name: "Kubernetes", logo: "/logos/kubernetes.svg", note: "For when containers need to scale." },
];

const PRINCIPLES = [
  "Own the full path to production.",
  "Caring deeply about something is rare, and beautiful.",
  "Focus on improving your technique, outcomes will follow.",
  "Just showing up every day can change your life.",
  "Being fun to work with is a competitive advantage.",
  "Stay humble. You're not above anyone.",
  "There is no such thing as a bad decision, only feedback.",
  "Being on time is a sign of respect.",
  "Good taste is a muscle that can be built.",
  "Reflect obsessively, and refuse to lie to yourself.",
];

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
          <p className="text-[13px] font-semibold tracking-[0.08em] text-[#111827] uppercase">
            Pranav Darekar
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
          <Image
            src="/pfp.jpg"
            alt="Pranav Darekar"
            width={96}
            height={96}
            className="mb-6 h-24 w-24 rounded-full object-cover"
          />
          <h1 className="page-heading">
            Building production AI agents &amp; the &ldquo;boring&rdquo; infra
            behind them.
            <br />
            Backends, evals, guardrails &amp; cloud deployments.
          </h1>
          <div className="mt-6 space-y-4 text-[17px] leading-[1.65] text-[#4a4948]">
            <p>
              I was lucky to have fallen in love with building early, and luckier
              to still feel the same way after shipping production AI systems.
            </p>
            <p>
              I consider myself a creator at heart and care deeply about craft
              and polish. I&apos;m currently part of the founding team at
              Crypto Prism — working across the product, from data pipelines
              and agent backends to evals and cloud deployments.
            </p>
            <p>
              Some of the best conversations I&apos;ve had started with a random
              hello on the internet. So…{" "}
              <a href="mailto:pranav.darekar1080@gmail.com" className="editorial-link">
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
                  {job.href ? (
                    <a href={job.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {row}
                    </a>
                  ) : (
                    <div className={cls}>{row}</div>
                  )}
                  <p className="px-3 pt-1 text-[14px] text-[#6B7280] md:hidden">{job.role}</p>
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
          <p className="mt-3 px-3 text-[14px] leading-relaxed text-[#6B7280] md:hidden">
            B.E in Automation and Robotics
          </p>
        </section>

        {/* ── Recent Work ─────────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Recent Work</SectionLabel>
          <div className="space-y-6">
            {RECENT_WORK.map((work) => (
              <a
                key={work.title}
                href={work.href}
                target={work.href.startsWith("/") ? undefined : "_blank"}
                rel="noopener noreferrer"
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
                </span>
              </a>
            ))}
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
            {SIDE_PROJECTS.map((p) => (
              <a
                key={p.title}
                href={p.href}
                className="group block rounded-xl border border-[#ECECED] bg-white p-5 transition-colors duration-150 hover:bg-[#F7F7F8]"
              >
                <span className="block text-[15px] font-semibold text-[#111827]">
                  {p.title}
                </span>
                <span className="mt-2 block text-[14px] leading-relaxed text-[#6B7280]">
                  {p.description}
                </span>
                <span className="mt-3 block text-[14px] font-medium text-[#111827]">
                  Open <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">→</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Beyond work ─────────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Beyond Work</SectionLabel>
          <p className="mb-5 text-[16px] leading-[1.65] text-[#4a4948]">
            When I&apos;m not training models, I&apos;m training myself —
            lifting, spotting planes, modelling in Blender, or going down a
            reading rabbit hole.
          </p>
          <ul className="flex flex-wrap gap-2">
            {BEYOND.map((item) => (
              <li
                key={item}
                className="rounded-full border border-[#ECECED] bg-white px-3.5 py-1.5 text-[14px] text-[#374151]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Now ─────────────────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Now</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {NOW_STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-[#ECECED] bg-white p-5">
                <p className="text-[22px]">{s.icon}</p>
                <p className="mt-2 text-[16px] font-semibold text-[#111827]">{s.value}</p>
                <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-[#9CA3AF]">
                  {s.label}
                </p>
                <p className="mt-1 text-[14px] text-[#6B7280]">{s.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Favourite Tools ─────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Favourite Tools</SectionLabel>
          <p className="mb-5 text-[16px] leading-[1.65] text-[#4a4948]">
            I&apos;m drawn to tools that feel functional and well-considered,
            where someone has clearly cared about the details.
          </p>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-[20px] sm:grid-cols-2">
            {TOOLS.map((t) => (
              <li key={t.name} className="flex items-start gap-3 px-1">
                {t.logo ? (
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.logo} alt={`${t.name} logo`} className="mt-[2px] h-5 w-5 shrink-0 object-contain" />
                ) : (
                  <LogoMark alt={`${t.name} mark`} letter={t.name[0]} />
                )}
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-[#111827]">{t.name}</p>
                  <p className="text-[14px] text-[#6B7280]">{t.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Principles ──────────────────────────────────── */}
        <section className="mb-[64px]">
          <SectionLabel>Principles</SectionLabel>
          <p className="mb-4 text-[14px] text-[#9CA3AF]">In no particular order:</p>
          <ul className="list-disc space-y-2 pl-5 text-[16px] leading-[1.65] text-[#4a4948]">
            {PRINCIPLES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
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
                  <time className="tabular text-[13px] text-[#9CA3AF]">{post.date}</time>
                  <span className="mt-1 block text-[17px] font-semibold tracking-[-0.01em] text-[#111827] group-hover:underline group-hover:underline-offset-4">
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
          <p className="text-[16px] leading-[1.65] text-[#4a4948]">
            GitHub is where I ship, X is where I share learnings from everyday
            building.
          </p>
          <ul className="mt-4 space-y-3 text-[16px]">
            <li>
              <a
                href="https://github.com/Skywalker1080"
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link"
              >
                GitHub <span className="arrow">→</span>
              </a>
            </li>
            <li>
              <a
                href="https://x.com/the_ray_kar"
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link"
              >
                Twitter (X) <span className="arrow">→</span>
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/pranav-darekar"
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link"
              >
                LinkedIn <span className="arrow">→</span>
              </a>
            </li>
          </ul>
        </section>

        {/* ── Footer ──────────────────────────────────────── */}
        <footer className="border-t border-[#ECECED] pt-6">
          <p className="text-[14px] text-[#6B7280]">Pune, India — perfect weather for a long build :)</p>
          <div className="mt-3 flex items-center gap-5 text-[14px] font-medium text-[#6B7280]">
            <Link href="/blog" className="transition-colors duration-150 hover:text-[#111827]">
              Writing
            </Link>
            <a
              href="https://x.com/the_ray_kar"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-150 hover:text-[#111827]"
            >
              Twitter (X)
            </a>
            <a
              href="https://linkedin.com/in/pranav-darekar"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-150 hover:text-[#111827]"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
