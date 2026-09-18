"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

export type FieldErrors = Record<string, string>;

/**
 * Shared shell for all public enquiry forms:
 * honeypot → POST /api/enquiries → server Zod validation → success reference.
 * Private demo: nothing is ever sent to the restaurant; data lands in the local
 * demo store and appears in /admin immediately.
 */
export function EnquiryFormShell({
  type,
  children,
  submitLabel,
  onStarted,
  successTitle = "Thank you.",
  successLine,
  buildPayload,
}: {
  type: "celebration" | "bulk_order" | "cake" | "contact";
  children: (props: { submitting: boolean; fieldErrors: FieldErrors }) => ReactNode;
  submitLabel: string;
  onStarted?: () => void;
  successTitle?: string;
  successLine: string;
  buildPayload: (form: HTMLFormElement) => Record<string, unknown>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (submitting) return;

    setSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...buildPayload(form) }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setFormError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      track(`${type}_form_submitted`, { reference: data.reference });
      setReference(data.reference);
      setSubmitting(false);
      form.reset();
    } catch {
      // P0-2 reliability: on a network failure, preserve everything the user
      // typed (do NOT reset the form) and surface a clear, retryable message
      // that matches the Maosaji reliability-pass wording exactly.
      setFormError("We couldn't send this yet. Check your connection and try again.");
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <div className="rounded-xl border border-veg/30 bg-[#f2f7f1] p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-veg" aria-hidden="true" />
        <h3 className="mt-4 font-serif text-2xl font-semibold text-ink">{successTitle}</h3>
        <p className="mt-2 text-sm text-ink-soft">{successLine}</p>
        <p className="mt-4 inline-block rounded-md border border-border bg-white px-4 py-2 font-mono text-sm text-brand">
          Reference: {reference}
        </p>
        <p className="mt-4 text-xs text-ink-soft/70">
          Private demo — this enquiry is stored locally and appears in the admin dashboard. No real notification is sent.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setReference(null);
            }}
          >
            Submit another
          </Button>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-md bg-brand px-5 text-sm font-semibold text-parchment transition-colors hover:bg-brand-deep"
          >
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onFocus={onStarted} noValidate className="space-y-5">
      {/* Honeypot — hidden from humans, irresistible to bots */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {formError && (
        <p role="alert" className="rounded-md border border-[#b3261e]/30 bg-[#fdf0ef] px-4 py-3 text-sm text-[#b3261e]">
          {formError}
        </p>
      )}

      {children({ submitting, fieldErrors })}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand text-parchment hover:bg-brand-deep active:scale-[0.98] sm:w-auto"
        size="lg"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
          </>
        ) : (
          submitLabel
        )}
      </Button>
      <p className="text-xs leading-relaxed text-ink-soft/70">
        Private demo — submissions are stored locally for the admin demonstration and never contact the restaurant.
      </p>
    </form>
  );
}

/** Consistent labelled field wrapper with inline validation. */
export function Field({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between text-sm font-medium text-ink">
        <span>
          {label}
          {required && (
            <span className="ml-0.5 text-brand" aria-hidden="true">
              *
            </span>
          )}
        </span>
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-soft/70">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "mt-1.5 flex h-11 w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-ink shadow-[0_1px_2px_rgba(38,33,27,0.04)] transition-colors placeholder:text-ink-soft/50 focus-visible:border-brass focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brass/50 disabled:opacity-50 aria-[invalid=true]:border-[#b3261e]";

export const selectClass = inputClass + " appearance-none pr-9";
