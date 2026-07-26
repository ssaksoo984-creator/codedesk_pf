import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bluehost shared hosting only serves static files (no Node process for
  // `next start`), so build a plain HTML/CSS/JS bundle into out/ instead.
  output: "export",
};

export default nextConfig;
