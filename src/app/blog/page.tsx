import Link from "next/link";
import Image from "next/image";
import type { Metadata, Route } from "next";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes and experiments on AI/ML, data engineering, and building things.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-4 pt-24 pb-20">
      <Link href="/" className="font-mono text-xs text-gray-500 hover:text-primary">
        ← back to home
      </Link>

      <h1 className="font-display text-3xl text-primary text-glow mt-6 mb-2">BLOG</h1>
      <p className="text-gray-500 mb-10 font-mono text-sm">
        {"// thoughts, notes, and experiments"}
      </p>

      {posts.length === 0 ? (
        <p className="text-gray-500 font-mono text-sm">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}` as Route}
              className="block terminal-container rounded-md p-5 group"
            >
              {post.cover && (
                <Image
                  src={post.cover}
                  alt={post.title}
                  width={1200}
                  height={630}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="rounded-md border border-white/10 mb-4 w-full aspect-[5/2] object-cover"
                />
              )}
              <time className="font-mono text-xs text-gray-500">{post.date}</time>
              <h2 className="font-display text-xl text-gray-200 group-hover:text-primary transition-colors mt-1">
                {post.title}
              </h2>
              <p className="text-gray-400 mt-2 text-sm leading-6">{post.description}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
