import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import "katex/dist/katex.min.css";
import { getAllPosts, getPost } from "@/lib/blog";
import { mdxComponents } from "@/components/mdx";

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
    <main className="min-h-screen max-w-3xl mx-auto px-4 pt-24 pb-20">
      <Link href="/blog" className="font-mono text-xs text-gray-500 hover:text-primary">
        ← all posts
      </Link>

      <header className="mt-6 mb-8 border-b border-white/10 pb-6">
        <time className="font-mono text-xs text-gray-500">{post.date}</time>
        <h1 className="font-display text-3xl text-primary text-glow mt-2">{post.title}</h1>
        <p className="text-gray-400 mt-3">{post.description}</p>
      </header>

      <article className="blog-prose">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkMath],
              rehypePlugins: [
                rehypeKatex,
                [rehypePrettyCode, { theme: "github-dark" }],
              ],
            },
          }}
        />
      </article>
    </main>
  );
}
