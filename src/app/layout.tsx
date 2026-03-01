import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  ),
  title: {
    default: "Pranav | Developer Portfolio",
    template: "%s | Pranav Portfolio",
  },
  description:
    "Developer portfolio showcasing Pranav's work, projects, and technical expertise in AI/ML, Data Engineering, and full-stack development.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Pranav | Developer Portfolio",
    description:
      "Developer portfolio showcasing Pranav's work, projects, and technical expertise.",
    siteName: "Pranav Portfolio",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranav | Developer Portfolio",
    description:
      "Developer portfolio showcasing Pranav's work, projects, and technical expertise.",
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
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="overflow-x-hidden min-h-screen relative antialiased">
        {children}
      </body>
    </html>
  );
}
