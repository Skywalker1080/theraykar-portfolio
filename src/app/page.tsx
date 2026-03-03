"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

/* ════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════ */

const SKILLS = [
  // Core Programming
  "Python",
  "C++",
  "JavaScript",
  "Bash/Linux",
  "SQL",

  // Machine Learning & AI
  "Machine Learning",
  "Deep Learning",
  "PyTorch",
  "Scikit-Learn",
  "Keras",
  "Agentic AI",
  "Multi-agent Workflows",

  // LLM & RAG Ecosystem
  "LangChain",
  "LangGraph",
  "HuggingFace",
  "RAG Systems",
  "Pydantic AI",

  // Data & Scientific Computing
  "NumPy",
  "Pandas",
  "Matplotlib",

  // Backend & APIs
  "FastAPI",

  // MLOps & Infrastructure
  "MLflow",
  "Docker",
  "Google Cloud",

  // Databases & Caching
  "MongoDB",
  "Redis",

  // Tooling
  "Git",
  "Claude Code",

  //Misc
  "Forecasting",
  "Backtesting",

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

const PROJECTS = [
  {
    title: "Crypto Prism",
    description: "Automated crypto trading system using Reinforcement Learning and Sentiment Analysis from real-time X (Twitter) feeds. Achieved 12% alpha over BTC benchmark in simulation.",
    tags: ["Python", "PyTorch", "Redis", "FastAPI"],
    link: "#",
    image: "https://images.unsplash.com/photo-1611974714022-de8fc8494b5f?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "MANAS CORE",
    description: "Local-first AI Journaling App with RAG engine. Features vector-based semantic search and automated daily summaries and visualizations using local LLMs.",
    tags: ["Next.js", "TypeScript", "Ollama", "SQLite-Vector"],
    link: "https://github.com/Skywalker1080/manasCore.git",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "ALPHA STREAM",
    description: "An Agentic, Crypto Forecasting System powered by Google's 500M Forecasting Model, with complete MLOps",
    tags: ["Python", "Forecasting", "Quant Finance", "MLOps", "Pytorch"],
    link: "#",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "VECTOR",
    description: "An End to End AI Agent for controlling a Robotic Manipulator in an unstructured environment.",
    tags: ["Agentic AI", "Python", "Gemini", "ROS2"],
    link: "#",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop"
  }
];

const EDUCATION = [
  {
    institution: "SAVITRIBAI PHULE PUNE UNIVERSITY",
    degree: "B.E in Automation and robotics",
    period: "2022 — 2026",
    logo: "/sppu.png",
    details: "CGPA: 8.5/10. Relevant coursework: Data Structures and Algorithms, Machine Learning, AI for Robotics, Optimization Techniques."
  }
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
            Architecting AI Agents and Machine Learning Solutions for Quantitative Trading and Financial Markets
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
             {" "}
            <a
              href="https://github.com/Skywalker1080/manasCore.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <span className="text-primary/90 underline decoration-primary/40 decoration-1 underline-offset-4">
                manasCore
              </span>
            </a>
            , an local first AI Journaling Toolkit
          </p>
          <p className="text-gray-400 leading-relaxed font-mono text-xs md:text-sm">
            <span className="text-primary">&gt;</span> I Specialized in Leveraging Deep Learning and NLP to develop sophisticated forecasting models for financial market trends and risk assessment.
          </p>
          <p className="text-gray-400 leading-relaxed font-mono text-xs md:text-sm">
            <span className="text-primary">&gt;</span> Expert in building robust, scalable backends using Python and FastAPI to deploy predictive models that drive quantitative insights and market analysis.
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

function ProjectsSection() {
  return (
    <section id="projects" className="mb-10 space-y-4">
      <h2 className="text-[13px] leading-[18px] text-primary font-normal tracking-[0.3em] font-mono border-b border-primary/20 pb-2 flex items-center gap-3 uppercase">
        <span className="opacity-70">03.</span> FEATURED_PROJECTS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECTS.map((project, idx) => (
          <a 
            key={idx} 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="terminal-container group cursor-pointer overflow-hidden border-glow block"
          >
            <div className="relative h-40 overflow-hidden border-b border-primary/10">
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none mix-blend-overlay" />
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
              />
              <div className="absolute top-2 right-2 z-20">
                <div className="bg-black/80 px-2 py-1 border border-primary/30 text-[8px] font-mono text-primary/80 uppercase">
                  v{idx + 1}.0.2
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-display text-white group-hover:text-primary transition-colors text-glow uppercase tracking-wider">
                  {project.title}
                </h3>
                <span className="text-primary text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  [VIEW_SRC]
                </span>
              </div>
              
              <p className="text-[11px] leading-relaxed text-gray-400 font-mono h-12 overflow-hidden">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-mono border border-primary/20 px-1.5 py-0.5 rounded text-primary/60 bg-primary/5 group-hover:border-primary/50 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="mb-10">
      <h2 className="text-[13px] leading-[18px] text-primary font-normal tracking-[0.3em] font-mono border-b border-primary/20 pb-2 flex items-center gap-3 mb-4 uppercase">
        <span className="opacity-70">04.</span> SKILLS_SET
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

function EducationSection() {
  return (
    <section id="education" className="mb-10 space-y-4">
      <h2 className="text-[13px] leading-[18px] text-primary font-normal tracking-[0.3em] font-mono border-b border-primary/20 pb-2 flex items-center gap-3 uppercase">
        <span className="opacity-70">05.</span> ACADEMIC_RECORD
      </h2>
      
      <div className="space-y-3">
        {EDUCATION.map((edu, idx) => (
          <div key={idx} className="experience-card group">
            {/* Logo Container */}
            <div className="shrink-0 hidden sm:block">
              <div className="w-10 h-10 bg-black rounded flex items-center justify-center overflow-hidden border border-white/10">
                <Image
                  src={edu.logo}
                  alt={`${edu.institution} Logo`}
                  width={28}
                  height={28}
                  className="object-contain transition-opacity group-hover:scale-110 duration-300"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                <h3 className="text-base font-bold text-white exp-title transition-colors">
                  {edu.institution}
                </h3>
                <span className="text-[10px] leading-[18px] font-normal text-gray-600 font-mono exp-period transition-colors">
                  [ {edu.period} ]
                </span>
              </div>
              <p className="text-primary/70 text-[10px] leading-[18px] font-normal uppercase tracking-widest mb-2">
                {edu.degree}
              </p>
              <p className="text-xs text-gray-400 font-mono leading-relaxed">
                <span className="text-primary mr-2">→</span> {edu.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const contacts = [
    { 
      label: "EMAIL", 
      value: "pranav.darekar1080@gmail.com", 
      link: "mailto:pranav.darekar1080@gmail.com",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>
      )
    },
    { 
      label: "GITHUB", 
      value: "github.com/Skywalker1080", 
      link: "https://github.com/Skywalker1080",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
      )
    },
    { 
      label: "LINKEDIN", 
      value: "linkedin.com/in/pranav-darekar", 
      link: "https://linkedin.com/in/pranav-darekar",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
      )
    },
    { 
      label: "TWITTER / X", 
      value: "@the_ray_kar", 
      link: "https://x.com/the_ray_kar",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
      )
    },
  ];

  return (
    <section id="contact" className="mb-20 pt-10 border-t border-primary/10">
      <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
        {/* Left Column */}
        <div className="flex-1 space-y-8 max-w-xl">
          
          
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-display text-white uppercase leading-tight text-glow">
              Let&apos;s build<br />the <span className="text-primary">Matrix</span> together
            </h2>
            <p className="text-gray-500 font-mono text-xs md:text-sm leading-relaxed max-w-md">
              Curruntly open to work Remotely on AI Systems, Fintech, Crypto, Data Infrastructure, and Developer Tools.
            </p>
          </div>

          <div className="pt-4">
            <a href="mailto:pranav.darekar1080@gmail.com" className="cta-primary flex items-center gap-3 w-max px-8">
              send_message
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 w-full space-y-3">
          {contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-5 terminal-container hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 group border-glow"
            >
              <div className="text-gray-600 group-hover:text-primary transition-colors duration-300">
                {contact.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-600 font-mono uppercase tracking-[0.2em] group-hover:text-primary/70 transition-colors">
                  {contact.label}
                </span>
                <span className="text-sm text-gray-300 font-mono group-hover:text-white transition-colors">
                  {contact.value}
                </span>
              </div>
            </a>
          ))}
        </div>
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
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <ContactSection />
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
