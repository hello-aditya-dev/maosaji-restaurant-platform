import "server-only";
import { createHash } from "crypto";
import { cookies } from "next/headers";

/**
 * DEMO admin authentication — passcode + httpOnly cookie session.
 * ──────────────────────────────────────────────────────────────
 * This is intentionally simple for the PRIVATE DEMO. The production path is
 * Supabase Auth with Owner/Manager/Content-Editor roles (see PRODUCTION_HANDOFF.md).
 * The rest of the admin code only asks "isAuthenticated()" — swapping the
 * mechanism later touches only this file.
 */

const COOKIE_NAME = "rp_admin_session";

export function demoPasscode(): string {
  return process.env.ADMIN_DEMO_PASSCODE || "demo2026";
}

function tokenFor(passcode: string): string {
  return createHash("sha256")
    .update(`restaurant-platform-v1::${passcode}::${process.env.ADMIN_SESSION_SECRET || "private-demo"}`)
    .digest("hex");
}

export function expectedToken(): string {
  return tokenFor(demoPasscode());
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === expectedToken();
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
