import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  ),
  title: {
    default: "Pranav Darekar — AI/ML Engineer & Builder",
    template: "%s | Pranav Darekar",
  },
  description:
    "AI/ML Engineer & Builder. Curious about how AI systems work and why they matter.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Pranav Darekar — AI/ML Engineer & Builder",
    description:
      "Curious about how AI systems work and why they matter.",
    siteName: "Pranav Darekar",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranav Darekar — AI/ML Engineer & Builder",
    description:
      "Curious about how AI systems work and why they matter.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Manrope:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-[#4B5563] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
