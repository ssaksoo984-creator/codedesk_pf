import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bluehost shared hosting only serves static files (no Node process for
  // `next start`), so build a plain HTML/CSS/JS bundle into out/ instead.
  output: "export",
  // Emit work/01/index.html instead of work/01.html: Apache (Bluehost)
  // doesn't map /work/01 → work/01.html, so deep links and refreshes 404'd.
  trailingSlash: true,
};

export default nextConfig;
