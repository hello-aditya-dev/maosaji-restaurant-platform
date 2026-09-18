import type { NextConfig } from "next";

// Standalone output is opt-in (`bun run build:standalone`) for bare-metal /
// Docker handoffs. Vercel and plain `next start` use the default server output.
const nextConfig: NextConfig = {
  ...(process.env.BUILD_STANDALONE === "1" ? { output: "standalone" as const } : {}),
  // Type errors fail the build (the project is kept tsc-clean — `bunx tsc --noEmit`).
  reactStrictMode: false,
  // The private preview proxy serves the dev server from a *.space-z.ai origin.
  // localhost / 127.0.0.1 added so headless browser audits (agent-browser) and
  // local tooling don't get blocked cross-origin on /_next/* resources.
  allowedDevOrigins: ["*.space-z.ai", "localhost", "127.0.0.1"],
};

export default nextConfig;
