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

      {post.cover ? (
        <div className="relative mt-6 aspect-[5/2] w-full overflow-hidden rounded-md border border-white/10">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <time className="font-mono text-xs text-gray-300">{post.date}</time>
            <h1 className="font-display text-2xl sm:text-3xl text-primary text-glow mt-1">
              {post.title}
            </h1>
          </div>
        </div>
      ) : (
        <header className="mt-6">
          <time className="font-mono text-xs text-gray-500">{post.date}</time>
          <h1 className="font-display text-3xl text-primary text-glow mt-2">{post.title}</h1>
        </header>
      )}

      <p className="text-gray-400 mt-5 mb-8 border-b border-white/10 pb-6">
        {post.description}
      </p>

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
