import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/instrument-sans/400.css";
import "@fontsource/instrument-sans/500.css";
import "@fontsource/ibm-plex-mono/400.css";
import { Header } from "@/components/studio/header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://codedesk-studio.online"),
  title: {
    default: "CodeDesk Studio — Web and digital design, Vancouver",
    template: "%s — CodeDesk Studio",
  },
  description:
    "CodeDesk Studio is an independent web and digital design studio in Vancouver: websites, product interfaces and brand identities, designed and built.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f3ee",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-svh antialiased">
        <a href="#main" className="sr-only z-50 bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
