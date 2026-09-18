"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { restaurant } from "@/config/restaurant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Admin login — passcode entry for the private demo console.
 * The demo passcode hint is intentional: this is a private concept demo and the
 * presenter needs to be able to sign in during the sales conversation.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        // Refresh so the server layout re-reads the session cookie, then enter
        // the console. AdminGate also re-validates /api/admin/session on route
        // change, so the two mechanisms back each other up.
        router.push("/admin");
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data && typeof data.error === "string" ? data.error : "Incorrect passcode. Please try again.");
      setPending(false);
    } catch {
      setError("Could not reach the server. Please try again.");
      setPending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Subtle heritage motif, matching the consumer site's language */}
      <div className="motif-bg pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden="true" />

      <main className="relative z-10 w-full max-w-sm">
        <div className="mb-6 text-center">
          <span
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand font-serif text-xl font-semibold text-parchment"
            aria-hidden="true"
          >
            {restaurant.displayName.charAt(0)}
          </span>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">
            {restaurant.displayName}
          </h1>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brass">
            Team access
          </p>
        </div>

        <Card className="border-border shadow-[0_18px_50px_-24px_rgba(38,33,27,0.35)]">
          <CardContent className="p-6">
            <form onSubmit={submit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="passcode" className="text-sm font-medium text-ink">
                  Passcode
                </Label>
                <div className="relative">
                  <Input
                    id="passcode"
                    name="passcode"
                    type={showPasscode ? "text" : "password"}
                    inputMode="text"
                    autoComplete="current-password"
                    autoFocus
                    required
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter the team passcode"
                    className="h-11 border-border bg-card pr-11 text-base tracking-wide"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? "passcode-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-ink-soft transition-colors hover:text-ink"
                    aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
                  >
                    {showPasscode ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {error && (
                  <p
                    id="passcode-error"
                    role="alert"
                    className="text-sm font-medium text-[#b3261e]"
                  >
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={pending || passcode.trim().length === 0}
                className="mt-5 h-11 w-full bg-brand text-sm font-semibold text-parchment hover:bg-brand-deep"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  "Enter console"
                )}
              </Button>
            </form>

            {/* Intentional hint — private demo, the presenter signs in live */}
            <div className="mt-5 rounded-lg border border-dashed border-brass/50 bg-brass/[0.06] p-3.5">
              <p className="flex items-center gap-2 text-xs font-semibold text-[#8a6d3b]">
                <KeyRound className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Private demo passcode:{" "}
                <code className="rounded border border-brass/40 bg-card px-1.5 py-0.5 font-mono text-xs text-ink">
                  demo2026
                </code>
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-soft">
                This concept is a private demonstration prepared for {restaurant.displayName} —
                the passcode is shown so the presenter can sign in.
              </p>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-soft/80">
              <ShieldCheck className="h-3.5 w-3.5 text-veg" aria-hidden="true" />
              Session is cookie-based and expires automatically.
            </p>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to the site
          </Link>
        </div>
      </main>
    </div>
  );
}
