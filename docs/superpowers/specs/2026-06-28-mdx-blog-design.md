# MDX Blog — Design Spec

**Date:** 2026-06-28
**Status:** Approved
**Project:** pranav-portfolio (Next.js 16 App Router, React 19, Tailwind v4)

## Goal

Add a free, zero-cost blog to the portfolio. Posts authored as MDX files in the
repo, rendered statically at build time on the existing Vercel free tier. No
database, no external CMS, no API keys, no monthly cost.

## Requirements

The blog must support, in post content:

1. **Images** — including post-local images.
2. **Embedded links** — Markdown links and raw embeds (e.g. YouTube iframe).
3. **LaTeX formulas** — inline (`$...$`) and block (`$$...$$`).
4. **Code blocks** — syntax-highlighted, matching the site's dark theme.

Browsing requirements:

- A blog index at `/blog`: reverse-chronological list of post cards (cover
  image, title, date, description).
- Individual post pages at `/blog/<slug>`.
- No tag/category filtering (deferred — YAGNI until post volume warrants it).

## Approach

**Chosen: `next-mdx-remote/rsc` reading from a `content/blog/` folder.**

Content lives as plain `.mdx` files fully separated from application code.
Frontmatter parsed with `gray-matter`. Rendered via React Server Components so
pages are static and fast. This is the most battle-tested combination for the
LaTeX + code-block requirements and keeps everything build-time and free.

Rejected alternatives:

- **`@next/mdx` (post = `app/blog/slug/page.mdx`)** — tangles content into route
  folders, awkward index generation, metadata via JS exports instead of clean
  frontmatter.
- **Content layer (Contentlayer/Velite)** — extra tooling/config, uneven Next 16
  support, overkill for a personal blog.

## Content Storage

- New folder `content/blog/`, one `.mdx` file per post. Filename (without
  extension) is the URL slug, e.g. `my-first-post.mdx` → `/blog/my-first-post`.
- Frontmatter at the top of each file:

  ```yaml
  ---
  title: "My First Post"
  date: "2026-06-28"
  description: "A short summary for the list + SEO."
  cover: "/blog/my-first-post/cover.png"   # optional
  ---
  ```

- Post images live in `public/blog/<slug>/`, referenced as
  `/blog/<slug>/image.png`.

## Code Structure

| File | Responsibility |
| --- | --- |
| `src/lib/blog.ts` | Read/parse posts. Exposes `getAllPosts()` (newest-first) and `getPost(slug)`. Uses `gray-matter` for frontmatter. Defines the `Post`/frontmatter types. |
| `src/app/blog/page.tsx` | `/blog` index — reverse-chronological cards (cover, title, date, description). |
| `src/app/blog/[slug]/page.tsx` | Single post. Renders MDX via `next-mdx-remote/rsc`. Implements `generateStaticParams` (full static generation) and `generateMetadata` (per-post title/description/OG). |
| `src/components/mdx.tsx` | Themed MDX component overrides (headings, links, images→`next/image`, code, etc.). |

### Unit boundaries

- **`blog.ts`** — what: file-system source of truth for posts; how: import and
  call `getAllPosts`/`getPost`; depends on: `node:fs`, `gray-matter`, the
  `content/blog/` directory. Internals (file reading, sorting) can change without
  affecting consumers.
- **`mdx.tsx`** — what: maps Markdown/MDX elements to themed React components;
  how: passed as the `components` prop to the MDX renderer; depends on: Tailwind
  classes, `next/image`. Swappable styling without touching page logic.
- **Page components** — thin: fetch via `blog.ts`, render via `mdx.tsx`.

## Rendering Pipeline

MDX compiled with these plugins (all build-time):

- **`remark-math`** + **`rehype-katex`** — LaTeX. KaTeX CSS imported only on blog
  pages (not site-wide).
- **`rehype-pretty-code`** (backed by **`shiki`**) — code highlighting with a
  dark theme consistent with the site.

Feature mapping:

- **Images** — Markdown `![alt](/blog/...)`; the `img` override maps to Next
  `<Image>` for optimization.
- **Embed links** — Markdown links; raw JSX embeds (e.g. YouTube iframe)
  permitted because content is MDX.
- **LaTeX** — `$E=mc^2$` inline, `$$...$$` block.
- **Code blocks** — fenced code with language hints, Shiki-highlighted.

## Dependencies

All free, build-time only:

`next-mdx-remote`, `gray-matter`, `remark-math`, `rehype-katex`,
`rehype-pretty-code`, `shiki`, `katex`.

## Navigation & Starter Content

- Add a **"Blog"** link to the site navigation.
- Add **one starter example post** that exercises an image, an embedded link, a
  LaTeX formula, and a code block — serves as a working reference/template.

## Styling

Match existing site conventions: dark theme, Orbitron (display) + JetBrains Mono
fonts, sci-fi aesthetic. Reuse existing Tailwind v4 patterns from `page.tsx`.

## Cost & Hosting

$0. Static generation at build time on the existing Vercel free tier. No
database, external service, or secrets.

## Out of Scope (deferred)

- Tag/category filtering.
- Comments.
- RSS feed (could be a cheap follow-up).
- Pagination (not needed until post count is large).
