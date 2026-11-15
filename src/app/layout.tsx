import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/instrument-sans/400.css";
import "@fontsource/instrument-sans/500.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://codedesk-studio.online"),
  title: { default: "CodeDesk — Soomin Park, UI/UX designer", template: "%s — CodeDesk" },
  description: "Step into Soomin Park’s workroom: résumé on the idea board, portfolio on the computer, notes by the window.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07090d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-mode="night" suppressHydrationWarning>
      <head>
        {/* First frame of the intro, so the opening paints at once. */}
        <link rel="preload" as="image" href="/media/room/intro-v8-poster.webp" />
        {/* Apply the saved day/night choice before paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement,m=localStorage.getItem("mode");if(m==="day")d.dataset.mode="day";if(sessionStorage.getItem("intro")==="seen"||matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.intro="seen"}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
