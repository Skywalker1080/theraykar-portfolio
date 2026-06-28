import Image from "next/image";

export const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="font-display text-2xl text-primary text-glow mt-10 mb-4" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="font-display text-xl text-primary mt-8 mb-3" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="font-display text-lg text-gray-200 mt-6 mb-2" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="leading-7 my-4 text-gray-400" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-primary underline underline-offset-4 hover:text-[color:var(--color-primary-hover)]"
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="list-disc pl-6 my-4 space-y-1 text-gray-400" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="list-decimal pl-6 my-4 space-y-1 text-gray-400" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => <li className="leading-7" {...props} />,
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-2 border-primary/50 pl-4 my-4 italic text-gray-500"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-white/10" />,
  img: ({ src, alt }: React.ComponentProps<"img">) => (
    <Image
      src={typeof src === "string" ? src : ""}
      alt={alt ?? ""}
      width={1200}
      height={630}
      sizes="(max-width: 768px) 100vw, 768px"
      className="rounded-md border border-white/10 my-6 w-full h-auto object-contain"
    />
  ),
};
