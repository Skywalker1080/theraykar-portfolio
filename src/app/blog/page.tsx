import Link from "next/link";
import Image from "next/image";
import type { Metadata, Route } from "next";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes and experiments on AI/ML, data engineering, and building things.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="bg-white">
      <main className="mx-auto min-h-screen w-full max-w-[760px] px-8 pb-[120px] pt-10 md:pt-16">
        <Link
          href="/"
          className="text-[14px] font-medium text-[#6B7280] transition-colors duration-150 hover:text-[#111827]"
        >
          ← back to home
        </Link>

        <h1 className="mt-6 text-[36px] font-bold leading-[1.15] tracking-[-0.03em] text-[#111827]">
          Writing
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-[#4B5563]">
          Notes and experiments on AI/ML, data engineering, and building things.
        </p>

        <div className="mt-10">
          {posts.length === 0 ? (
            <p className="text-[16px] text-[#6B7280]">No posts yet.</p>
          ) : (
            <div className="divide-y divide-[#F3F4F6] border-y border-[#ECECED]">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}` as Route}
                  className="group block py-8"
                >
                  {post.cover && (
                    <Image
                      src={post.cover}
                      alt={post.title}
                      width={1200}
                      height={630}
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="mb-4 aspect-[5/2] w-full rounded-xl border border-[#ECECED] object-cover"
                    />
                  )}
                  <time className="tabular text-[13px] text-[#9CA3AF]">{post.date}</time>
                  <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.01em] text-[#111827] group-hover:underline group-hover:underline-offset-4">
                    {post.title}
                  </h2>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#6B7280]">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
