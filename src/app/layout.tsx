import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/jetbrains-mono/400.css";
import { LocaleProvider } from "@/components/site-header/locale-context";
import { Nav } from "@/components/site/nav";
import { Cursor } from "@/components/site/cursor";
import { AskMe } from "@/components/site/ask-me";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soomin Park — UI/UX Designer · {Code} · Desk",
  description:
    "Portfolio of Soomin Park, a UI/UX designer in Vancouver: information architecture, flows, interfaces and working prototypes for public-sector systems, commerce and AI products.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f4ee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Pretendard as unicode-range chunks — only the glyphs a page uses get downloaded. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/pretendard/pretendardvariable-dynamic-subset.css" />
      </head>
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          <Nav />
          {children}
          <AskMe />
          <Cursor />
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
