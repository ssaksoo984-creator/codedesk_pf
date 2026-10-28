import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/chakra-petch/400.css";
import "@fontsource/chakra-petch/500.css";
import "@fontsource/chakra-petch/600.css";
import "@fontsource/chakra-petch/700.css";
import "@fontsource/chakra-petch/500-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import { pretendard } from "./fonts";
import { LocaleProvider } from "@/components/site-header/locale-context";
import { BackToTop } from "@/components/site-header/back-to-top";
import { CyberBackground } from "@/components/cyber/cyber-background";
import { CyberCursor } from "@/components/cyber/cyber-cursor";
import { BootScreen } from "@/components/cyber/boot-screen";
import { IntegrityHud } from "@/components/cyber/integrity-hud";
import { SysBot } from "@/components/cyber/sys-bot";
import { WorldSaved } from "@/components/cyber/world-saved";
import "./globals.css";

export const metadata: Metadata = {
  title: "{Code} · Desk — Recovery Protocol",
  description:
    "Portfolio of Soomin Park ({Code} · Desk) — UI/UX design & frontend. Restore every sector to save the digital world.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pretendard.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Runs before paint: skip the boot overlay for anyone who already booted this session. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('rp-booted')||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.booted='1'}}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          <CyberBackground />
          <BootScreen />
          {children}
          <IntegrityHud />
          <BackToTop />
          <SysBot />
          <WorldSaved />
          <CyberCursor />
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
