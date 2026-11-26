import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@electric-sql/pglite", "pg", "bcryptjs"],
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: false,
  },
};

export default nextConfig;
