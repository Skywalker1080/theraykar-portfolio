# Pranav Portfolio (Next.js + Bun)

Production-ready Next.js (App Router) starter for a personal portfolio site,
configured for Bun + TypeScript and optimized baseline performance.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- Bun runtime + package manager

## Quick Start

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
bun run dev       # local development
bun run typecheck # TypeScript checks
bun run lint      # ESLint
bun run check     # typecheck + lint
bun run build     # production build
bun run start     # run production build
```

## Production Defaults Included

- `reactStrictMode` enabled
- `typedRoutes` enabled
- `poweredByHeader` disabled
- AVIF/WebP image formats enabled
- SEO baseline metadata in `src/app/layout.tsx`
- `robots.ts` and `sitemap.ts` route metadata
- Server-first page structure for minimal client JavaScript

## Before Deploy

1. Set `NEXT_PUBLIC_SITE_URL` to your live domain.
2. Replace placeholder portfolio content in `src/app/page.tsx`.
3. Add real OG image and social links.
4. Run `bun run check && bun run build`.
