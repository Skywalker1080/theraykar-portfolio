import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import "katex/dist/katex.min.css";
import { getAllPosts, getPost } from "@/lib/blog";
import { mdxComponents } from "@/components/mdx";
import { rehypePinkArrows } from "@/lib/rehype-pink-arrows";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      ...(post.cover ? { images: [{ url: post.cover }] } : {}),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="bg-white">
      <main className="mx-auto min-h-screen w-full max-w-[760px] px-8 pb-[120px] pt-10 md:pt-16">
        <Link
          href="/blog"
          className="text-[14px] font-medium text-[#6B7280] transition-colors duration-150 hover:text-[#111827]"
        >
          ← all posts
        </Link>

        {post.cover ? (
          <div className="relative mt-6 aspect-[5/2] w-full overflow-hidden rounded-xl border border-[#ECECED]">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        ) : null}

        <header className="mt-6 border-b border-[#ECECED] pb-6">
          <time className="tabular text-[13px] text-[#9CA3AF]">{post.date}</time>
          <h1 className="mt-2 text-[32px] font-bold leading-[1.2] tracking-[-0.03em] text-[#111827]">
            {post.title}
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-[#4B5563]">
            {post.description}
          </p>
        </header>

        <article className="blog-prose mt-8">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              // Posts live in this repo, so allow JS expressions in props (arrays for the
              // visualizations); the dangerous-globals filter stays on.
              blockJS: false,
              mdxOptions: {
                remarkPlugins: [remarkMath],
                rehypePlugins: [
                  rehypePinkArrows,
                  rehypeKatex,
                  [rehypePrettyCode, { theme: "github-light" }],
                ],
              },
            }}
          />
        </article>
      </main>
    </div>
  );
}
