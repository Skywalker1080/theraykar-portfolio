import type { MetadataRoute } from "next";

// Blog is temporarily hidden, so the sitemap lists only the homepage.
// To re-enable, restore the /blog and per-post entries (import getAllPosts).
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
