"use client";

/**
 * Contact enquiry form (general messages) — /contact page.
 * Built on EnquiryFormShell: honeypot → POST /api/enquiries → server Zod
 * validation → success reference.
 *
 * Two client-side behaviours the shell cannot express on its own:
 *  1. "min 10 characters" for the message — the server schema treats a contact
 *     message as optional, so the rule is enforced with a capture-phase submit
 *     guard on the form (the shell owns the form's React submit handler; React
 *     19 dispatches bubble-phase onSubmit from the root container, so stopping
 *     propagation at the target prevents the shell handler from firing).
 *  2. the guard must follow the LIVE form element — the shell unmounts its
 *     <form> after success and mounts a fresh one on "Submit another", so the
 *     textarea's ref callback re-registers the guard whenever that happens.
 *
 * `subject` has no dedicated column in the enquiry schema, so it is folded into
 * the message ("Feedback — …") like the celebration form does with eventType —
 * the admin demo then shows the full context of every message.
 */

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  EnquiryFormShell,
  Field,
  inputClass,
  selectClass,
} from "./enquiry-form-shell";
import { track } from "@/lib/analytics";

const SUBJECTS = ["General", "Feedback", "Bulk enquiry", "Cake enquiry"] as const;
const MIN_MESSAGE = 10;

function buildPayload(form: HTMLFormElement): Record<string, unknown> {
  const payload: Record<string, unknown> = Object.fromEntries(new FormData(form).entries());

  // Optional email: empty string → not sent (server treats missing as null).
  if (payload.email === "") delete payload.email;

  // subject has no storage column — fold it into the message. "General" is the
  // default and stays silent to keep messages clean.
  const subject = typeof payload.subject === "string" ? payload.subject : "";
  const note = typeof payload.message === "string" ? payload.message.trim() : "";
  payload.message =
    subject && subject !== "General" ? (note ? `${subject} — ${note}` : subject) : note;
  delete payload.subject;

  return payload;
}

export function ContactForm() {
  const startedRef = useRef(false);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  // The <form> that currently owns the message textarea. Tracked in state so
  // the guard below re-attaches when the shell swaps in a fresh form.
  const [formEl, setFormEl] = useState<HTMLFormElement | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  // Capture-phase guard: runs before the shell's React submit handler and
  // stops the submit when the message is missing or under 10 characters.
  useEffect(() => {
    if (!formEl) return;
    const guard = (e: SubmitEvent) => {
      const value = (messageRef.current?.value ?? "").trim();
      if (value.length < MIN_MESSAGE) {
        e.preventDefault(); // no native form submission
        e.stopPropagation(); // the shell's onSubmit never fires
        setMessageError(`Please write at least ${MIN_MESSAGE} characters so the team can help.`);
        messageRef.current?.focus();
      }
    };
    formEl.addEventListener("submit", guard, true);
    return () => formEl.removeEventListener("submit", guard, true);
  }, [formEl]);

  return (
    <EnquiryFormShell
      type="contact"
      submitLabel="Send message"
      successLine="Your message has been recorded. In this private demo it appears in the admin dashboard straight away — no real notification is sent."
      onStarted={() => {
        if (startedRef.current) return;
        startedRef.current = true;
        track("contact_form_started", { form: "contact" });
      }}
      buildPayload={buildPayload}
    >
      {({ submitting, fieldErrors }) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" htmlFor="contact-name" required error={fieldErrors.contactName}>
              <input
                id="contact-name"
                name="contactName"
                type="text"
                required
                autoComplete="name"
                disabled={submitting}
                placeholder="Your name"
                className={inputClass}
                aria-invalid={fieldErrors.contactName ? true : undefined}
              />
            </Field>

            <Field
              label="Phone"
              htmlFor="contact-phone"
              required
              error={fieldErrors.phone}
              hint="So the team can reach you back."
            >
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                required
                autoComplete="tel"
                disabled={submitting}
                placeholder="10-digit mobile number"
                className={inputClass}
                aria-invalid={fieldErrors.phone ? true : undefined}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Email"
              htmlFor="contact-email"
              error={fieldErrors.email}
              hint="Optional — only used to reply to you."
            >
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                disabled={submitting}
                placeholder="you@example.com"
                className={inputClass}
                aria-invalid={fieldErrors.email ? true : undefined}
              />
            </Field>

            <Field
              label="Subject"
              htmlFor="contact-subject"
              hint="Optional — where should your message go?"
            >
              <div className="relative mt-1.5">
                <select
                  id="contact-subject"
                  name="subject"
                  defaultValue="General"
                  disabled={submitting}
                  className={selectClass}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
                  aria-hidden="true"
                />
              </div>
            </Field>
          </div>

          <Field
            label="Message"
            htmlFor="contact-message"
            required
            error={fieldErrors.message ?? messageError ?? undefined}
            hint={`Tell us what's on your mind — at least ${MIN_MESSAGE} characters.`}
          >
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={MIN_MESSAGE}
              rows={5}
              disabled={submitting}
              placeholder="Write at least a sentence so we can help…"
              ref={(el) => {
                messageRef.current = el;
                setFormEl(el?.form ?? null);
              }}
              onChange={() => setMessageError(null)}
              className={`${inputClass} min-h-[130px] resize-y`}
              aria-invalid={fieldErrors.message || messageError ? true : undefined}
            />
          </Field>
        </>
      )}
    </EnquiryFormShell>
  );
}
