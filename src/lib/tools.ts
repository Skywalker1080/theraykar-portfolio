/* The tech stack, shared by the homepage strip and the blog visualizations so every icon
   comes from one place. */
export type Tool = { name: string; logo: string; note: string };

export const TOOLS: Tool[] = [
  { name: "Python", logo: "/python 1.svg", note: "The default for anything with gradients or data." },
  { name: "FastAPI", logo: "/fastapi 1.svg", note: "Ships ML backends fast, with types end to end." },
  { name: "TypeScript", logo: "/typescript 1.svg", note: "Types that catch the bug before the user does." },
  { name: "Next.js", logo: "/nextdotjs 1.svg", note: "Frontends that go from idea to URL quickly." },
  { name: "PostgreSQL", logo: "/postgresql 1.svg", note: "The database I reach for first." },
  { name: "Kafka", logo: "/apachekafka 1.svg", note: "Streams market data through the pipeline in real time." },
  { name: "Docker", logo: "/docker-svg 1.svg", note: "If it runs here, it runs there." },
  { name: "AWS", logo: "/aws-svg 1.svg", note: "Where the production infra lives." },
  { name: "LangGraph", logo: "/langchain 1.svg", note: "For agents that need to stay in control." },
  { name: "MLflow", logo: "/mlflow 1.svg", note: "Keeps experiments honest and reproducible." },
  { name: "PyTorch", logo: "/pytorch-svg 1.svg", note: "My default for training and fine-tunes." },
  { name: "GitHub", logo: "/github 1.svg", note: "Where every project lives, ships, and gets reviewed." },
  { name: "Claude Code", logo: "/claudecode 1.svg", note: "The pair programmer I use every day." },
  { name: "Kubernetes", logo: "/kubernetes-svg 1.svg", note: "For when containers need to scale." },
];

export function toolLogo(name: string): string | undefined {
  return TOOLS.find((t) => t.name === name)?.logo;
}
