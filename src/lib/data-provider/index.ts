/**
 * Provider factory.
 * ────────────────
 * SUPABASE MODE: set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and
 * implement `supabase-provider.ts` against the same DataProvider interface
 * (schema/RLS notes live in PRODUCTION_HANDOFF.md). No UI changes needed.
 *
 * DEMO_MODE (default): server-persisted Prisma/SQLite store.
 *
 * DEMO_MODE_MEMORY (serverless fallback): when no database is available —
 * e.g. a zero-config Vercel deploy whose filesystem is read-only — the
 * platform degrades gracefully to an in-memory provider seeded with the
 * same data. Every page and flow keeps working; data resets on cold starts.
 */
import { demoProvider } from "./demo-provider";
import { memoryProvider } from "./memory-provider";
import type { DataProvider } from "./types";

export function hasSupabaseCredentials(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * SQLite (file) persistence needs a writable local filesystem AND a
 * configured DATABASE_URL. Serverless platforms (Vercel) have neither by
 * default, so they run the in-memory demo mode instead of erroring.
 */
export function canUseSqlitePersistence(): boolean {
  if (!process.env.DATABASE_URL) return false;
  if (process.env.VERCEL === "1") return false; // read-only FS — no SQLite writes
  return true;
}

let cachedProvider: DataProvider | null = null;

export function getProvider(): DataProvider {
  if (!cachedProvider) {
    cachedProvider = canUseSqlitePersistence() ? demoProvider : memoryProvider;
  }
  return cachedProvider;
}

export const backendMode: string = hasSupabaseCredentials()
  ? "SUPABASE"
  : canUseSqlitePersistence()
    ? "DEMO_MODE"
    : "DEMO_MODE_MEMORY";

export * from "./types";
