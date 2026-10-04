import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* NEXT_DIST_DIR lets a local test build (e.g. .next-soak) live beside the
     dev server's .next without the two overwriting each other. */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
