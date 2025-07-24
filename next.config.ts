import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mastra/*"],
  transpilePackages: ["@mastra/core", "@mastra/memory", "@mastra/pg"],
};

export default nextConfig;
