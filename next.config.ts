import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Static export to `out/` so the site can be served as plain HTML/CSS/JS
  // on Cloudflare Pages (no Node server required).
  output: "export",
  // No image optimization server in a static export.
  images: { unoptimized: true },
};

export default nextConfig;
