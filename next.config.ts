import type { NextConfig } from "next";

// Standalone output is opt-in (`bun run build:standalone`) for bare-metal /
// Docker handoffs. Vercel and plain `next start` use the default server output.
const nextConfig: NextConfig = {
  ...(process.env.BUILD_STANDALONE === "1" ? { output: "standalone" as const } : {}),
  // Type errors fail the build (the project is kept tsc-clean — `bunx tsc --noEmit`).
  reactStrictMode: false,
  // The private preview proxy serves the dev server from a *.space-z.ai origin.
  allowedDevOrigins: ["*.space-z.ai"],
};

export default nextConfig;
