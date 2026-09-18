import "server-only";
import { getProvider } from "@/lib/data-provider";

/** Server-side analytics tracker (used by API routes). */
export async function track(name: string, payload?: Record<string, unknown>) {
  try {
    await getProvider().trackEvent(name, payload);
  } catch {
    // analytics must never break a request
  }
}
