"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

/* ════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════ */

const SKILLS = [
  "Machine Learning",
  "Deep Learning",
  "PyTorch",
  "Agentic AI",
  "Multi-agent Workflows",
  "Langchain",
  "LangGraph",
  "Pydantic AI",
  "FastAPI",
  "RAGs",
  "Memory Systems",
];

const EXPERIENCE = [
  {
    company: "Crypto Prism",
    logo: "/cp.svg",
    role: "Founder's Associate",
    period: "NOV 2024 – APR 2025",
    link: "https://cryptoprism-io.web.app/",
    bullets: [
      "Built Data Pipelines.",
      "Custom Trading Indicators on over 1000+ crypto coins.",
    ],
  },
  {
    company: "COOLBOOTS MEDIA PVT LTD",
    logo: "/cmh-logo.png",
    role: "Artificial Intelligence Intern",
    period: "AUG 2024 – DEC 2024",
    bullets: [
      "Developed RAG pipelines using LangChain.",
      "Integrated vector databases for semantic search.",
    ],
  },
];

/* ════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════════════════════════ */

function StatusBar() {
  const [cpu, setCpu] = useState(4);
  const [mem, setMem] = useState(1.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 15) + 1); // 1% to 15%
      setMem(+(Math.random() * (2.4 - 1.1) + 1.1).toFixed(1)); // 1.1GB to 2.4GB
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-40 bg-black border-b border-primary/30 text-[10px] leading-[18px] font-normal uppercase tracking-widest py-2 px-4 flex justify-between items-center text-primary/80 font-mono">
      {/* Centered Brand element */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-xs tracking-tighter text-glow font-display hidden lg:block">
        the_ray_kar
      </div>
      <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
        <span className="text-primary font-normal flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-dot" />
          <span className="hidden sm:inline">SYSTEM_ONLINE</span>
          <span className="sm:hidden">SYS_ON</span>
        </span>
        <div className="flex gap-3 md:gap-5 border-l border-primary/30 pl-3 md:pl-5 ml-1 md:ml-3">
          <a className="hover:text-primary transition-colors" href="#">GITHUB</a>
          <a className="hover:text-primary transition-colors" href="#">LINKEDIN</a>
          <a className="hover:text-primary transition-colors" href="#">TWITTER</a>
        </div>
      </div>
      <div className="flex gap-3 md:gap-4 shrink-0">
        <span className="hidden sm:inline">MEM: {mem.toFixed(1)}GB</span>
        <span>CPU: {cpu.toString().padStart(2, "0")}%</span>
        <span className="hidden md:inline">LOC: EARTH_01</span>
      </div>
    </div>
  );
}

function TickerTape() {
  const items = [
    { title: "BTC/USD", value: "91,245.00 (+1.2%)" },
    { title: "ETH/USD", value: "2,845.50 (-0.4%)" },
    { title: "INTEREST:", value: "QUANTITATIVE FINANCE" },
    { title: "STATUS:", value: "BUILDING CONTEXT_MEMORY" },
    { title: "LATENCY:", value: "12ms" },
    { title: "INTEREST:", value: "REINFORCEMENT LEARNING" },
    { title: "RELATIONSHIPS:", value: "SINGLE" },
    { title: "SYS_LOAD:", value: "NORMAL" },
  ];

  // Repeat the items 3 times to ensure a smooth scrolling loop
  const tickerContent = [...items, ...items, ...items].map((item, i) => (
    <span key={i} className="mx-6 flex items-center gap-2 text-[10px] leading-[18px] font-normal font-mono">
      <span className="text-primary/50 text-[10px] font-bold">»</span>
      <span className="text-[#4a7a60]">{item.title}</span>
      <span className="text-[#00ff88]">{item.value}</span>
    </span>
  ));

  return (
    <div className="fixed top-[35px] left-0 w-full z-30 bg-black border-b border-primary/20 overflow-hidden py-1">
      <div className="flex animate-ticker w-max">
        {tickerContent}
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section
      id="hero"
      className="mb-10 pt-4"
    >
      {/* Text Side */}
      <div className="space-y-3 text-center md:text-left">
        <div className="space-y-1">
          <p className="text-primary font-normal text-[10px] leading-[18px] tracking-[0.3em] opacity-70 font-mono">
            $ EXECUTING WHOAMI...
          </p>
          <h1 className="text-3xl md:text-4xl font-display text-white uppercase leading-tight text-glow">
            Hi, I&apos;m <span className="text-primary">Pranav</span>
            <span className="animate-blink text-primary">_</span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 font-mono">
            AI/ML &amp; Data Engineer. Building intelligent agents that remember
            and reason.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-6 justify-center md:justify-start items-center">
          <a
            href="mailto:pranav.darekar1080@gmail.com"
            className="text-[10px] leading-[18px] text-primary/70 hover:text-primary transition-colors font-mono tracking-widest uppercase"
          >
            pranav.darekar1080@gmail.com
          </a>
          <a href="#contact" className="cta-primary w-full sm:w-auto text-center">
            get_in_touch
          </a>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="mb-10 space-y-3">
      <h2 className="text-[13px] leading-[18px] text-primary font-normal tracking-[0.3em] font-mono border-b border-primary/20 pb-2 flex items-center gap-3 uppercase">
        <span className="opacity-70">01.</span> ABOUT_ME
      </h2>

      <div className="terminal-container p-4 rounded relative border-glow">
        <div className="terminal-dots mb-3">
          <div className="terminal-dot red" />
          <div className="terminal-dot yellow" />
          <div className="terminal-dot green" />
        </div>

        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed font-mono text-xs md:text-sm">
            <span className="text-primary">&gt;</span> AI/ML Engineer
            passionate about building intelligent systems. Currently working on
            multi-agent workflows and building{" "}
            <span className="text-primary/90 underline decoration-primary/40 decoration-1 underline-offset-4">
              ContextMemory
            </span>
            , a memory system for AI applications.
          </p>
          <p className="text-gray-400 leading-relaxed font-mono text-xs md:text-sm">
            <span className="text-primary">&gt;</span> Specialized in Machine
            Learning, Deep Learning, NLP, and backend development with Python
            and FastAPI.
          </p>
        </div>

        <div className="absolute bottom-2 right-4 text-[10px] leading-[18px] font-normal text-gray-700 font-mono tracking-widest">
          MODE: READ_ONLY_STMT
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section id="work" className="mb-10 space-y-4">
      <h2 className="text-[13px] leading-[18px] text-primary font-normal tracking-[0.3em] font-mono border-b border-primary/20 pb-2 flex items-center gap-3 uppercase">
        <span className="opacity-70">02.</span> WORK_EXPERIENCE
      </h2>

      <div className="space-y-3">
        {EXPERIENCE.map((exp) => {
          const content = (
            <div className="experience-card group">
              {/* Logo */}
              <div className="shrink-0 hidden sm:block">
                <div className="w-10 h-10 bg-black rounded flex items-center justify-center overflow-hidden border border-white/10">
                  <Image
                    src={exp.logo}
                    alt={`${exp.company} Logo`}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                  <h3 className="text-base font-bold text-white exp-title transition-colors">
                    {exp.company}
                  </h3>
                  <span className="text-[10px] leading-[18px] font-normal text-gray-600 font-mono exp-period transition-colors">
                    [ {exp.period} ]
                  </span>
                </div>
                <p className="text-primary/70 text-[10px] leading-[18px] font-normal uppercase tracking-widest mb-2">
                  {exp.role}
                </p>
                <ul className="space-y-1 text-xs text-gray-400">
                  {exp.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );

          if (exp.link) {
            return (
              <a
                key={exp.company}
                href={exp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block no-underline"
              >
                {content}
              </a>
            );
          }

          return <div key={exp.company}>{content}</div>;
        })}
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="mb-10">
      <h2 className="text-[13px] leading-[18px] text-primary font-normal tracking-[0.3em] font-mono border-b border-primary/20 pb-2 flex items-center gap-3 mb-4 uppercase">
        <span className="opacity-70">03.</span> SKILLS_SET
      </h2>

      <div className="flex flex-wrap gap-2">
        {SKILLS.map((skill) => (
          <div key={skill} className="skill-tag">
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] leading-[18px] font-normal text-gray-600 gap-6 font-mono">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-primary/40" />
        <span className="tracking-widest">STATUS: SYSTEM_OPTIMIZED</span>
      </div>

      <div className="tracking-widest text-center">
        © 2025 PRANAV // DESIGN_VER: 4.0.0
      </div>

      <div className="flex gap-6">
        <a className="footer-link flex items-center gap-1" href="#">
          GITHUB
        </a>
        <a className="footer-link flex items-center gap-1" href="#">
          LINKEDIN
        </a>
        <a className="footer-link flex items-center gap-1" href="#">
          TWITTER
        </a>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <>
      {/* CRT Scanlines */}
      <div className="scanlines opacity-30" />

      {/* Status Bar */}
      <StatusBar />
      <TickerTape />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-6 md:py-10 relative z-10 pt-24 md:pt-28">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <Footer />
      </main>

      {/* Bottom glow line */}
      <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

      {/* Side decorative bars */}
      <div className="fixed top-1/2 right-4 -translate-y-1/2 flex flex-col gap-8 pointer-events-none opacity-20">
        <div className="w-px h-12 bg-primary" />
        <div className="w-px h-12 bg-primary" />
        <div className="w-px h-12 bg-primary" />
      </div>
    </>
  );
}
