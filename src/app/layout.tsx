import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { pretendard, cormorant } from "./fonts";
import { GnbThemeProvider } from "@/components/site-header/gnb-theme";
import { LocaleProvider } from "@/components/site-header/locale-context";
import { PageBackground } from "@/components/site-header/page-background";
import { LocaleToggle } from "@/components/site-header/locale-toggle";
import { BackToTop } from "@/components/site-header/back-to-top";
import "./globals.css";

export const metadata: Metadata = {
  title: "{Code} · Desk",
  description: "Portfolio of {Code} · Desk — design & frontend development.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${cormorant.variable} h-full antialiased`}
      // Both the moon-mode and scroll-snap-opt-out scripts below mutate
      // <html> before hydration runs — expected, not a real mismatch.
      suppressHydrationWarning
    >
      <head>
        <script
          // Runs before hydration so moon mode doesn't flash unstyled on reload.
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('scheme')==='moon'){document.documentElement.dataset.scheme='moon'}}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          <GnbThemeProvider>
            <PageBackground />
            {children}
            <LocaleToggle />
            <BackToTop />
          </GnbThemeProvider>
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
