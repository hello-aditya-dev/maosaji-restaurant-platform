import type { Metadata } from "next";
import type { ReactNode } from "react";
import { isAuthenticated } from "@/lib/admin-auth";
import { AdminGate } from "@/components/admin/admin-gate";

/**
 * Admin layout — a server component that resolves the session cookie once and
 * hands the result to the client AdminGate. The gate owns the shell (sidebar +
 * topbar), re-validates /api/admin/session on route changes and renders the
 * login route bare. Reading cookies() makes the whole subtree dynamic.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Team Console", template: "%s — Team Console" },
  // Private demo — noindex is inherited from the root layout; restated for safety.
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authenticated = await isAuthenticated();
  return <AdminGate initialAuthenticated={authenticated}>{children}</AdminGate>;
}
