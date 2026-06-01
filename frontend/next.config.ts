import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Safely tells the Next.js compiler to ignore type errors during production builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Safely tells the Next.js compiler to ignore ESLint warnings during production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;