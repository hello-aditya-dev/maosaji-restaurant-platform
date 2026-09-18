/**
 * Provider factory.
 * ────────────────
 * SUPABASE MODE: set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and
 * implement `supabase-provider.ts` against the same DataProvider interface
 * (schema/RLS notes live in PRODUCTION_HANDOFF.md). No UI changes needed.
 *
 * DEMO_MODE (default, active now): Prisma/SQLite server-persisted store.
 */
import { demoProvider } from "./demo-provider";
import type { DataProvider } from "./types";

export function hasSupabaseCredentials(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getProvider(): DataProvider {
  // Supabase provider is intentionally not wired until credentials exist —
  // falling back to DEMO_MODE keeps the private demo fully functional.
  return demoProvider;
}

export const backendMode: string = hasSupabaseCredentials() ? "SUPABASE" : "DEMO_MODE";

export * from "./types";
