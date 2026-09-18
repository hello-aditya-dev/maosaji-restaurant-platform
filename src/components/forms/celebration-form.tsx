"use client";

/**
 * Celebration enquiry form — /celebrations page.
 * Server-side Zod validation keys: contactName / phone / email / eventDate /
 * guestCount (plus optional locationSlug, budgetRange, requirements, message).
 *
 * `eventType` has no dedicated column in the enquiry schema, so it is folded
 * into the message ("Wedding — need catering…") instead of being dropped —
 * the admin demo then shows the full context of every request.
 */

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { EnquiryFormShell, Field, inputClass, selectClass } from "./enquiry-form-shell";
import { track } from "@/lib/analytics";

const EVENT_TYPES = [
  "Birthday",
  "Wedding",
  "Family function",
  "Corporate event",
  "Festival",
  "Large gathering",
] as const;

const REQUIREMENTS = [
  "Catering",
  "Sweets",
  "Snacks",
  "Gift boxes",
  "Cake",
  "Restaurant booking",
] as const;

const BUDGET_RANGES = [
  "Under ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000+",
  "Prefer not to say",
] as const;

/** inputClass, but sized for a multi-line message instead of a fixed h-11 row. */
const textareaClass =
  "mt-1.5 flex min-h-[104px] w-full resize-y rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-ink shadow-[0_1px_2px_rgba(38,33,27,0.04)] transition-colors placeholder:text-ink-soft/50 focus-visible:border-brass focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brass/50 disabled:opacity-50 aria-[invalid=true]:border-[#b3261e]";

function buildPayload(form: HTMLFormElement): Record<string, unknown> {
  const fd = new FormData(form);
  const payload: Record<string, unknown> = Object.fromEntries(fd.entries());

  // Checkbox group → array (FormData alone would keep only the last checked box).
  payload.requirements = Array.from(
    form.querySelectorAll<HTMLInputElement>('input[name="requirements"]:checked')
  ).map((el) => el.value);

  // "No preference" → null location.
  if (payload.locationSlug === "") payload.locationSlug = null;

  // Optional selects/inputs: empty string → not sent.
  if (payload.budgetRange === "") delete payload.budgetRange;
  if (payload.email === "") delete payload.email;

  // eventType has no storage column — fold it into the message.
  const eventType = typeof payload.eventType === "string" ? payload.eventType : "";
  const note = typeof payload.message === "string" ? payload.message.trim() : "";
  payload.message = eventType ? (note ? `${eventType} — ${note}` : eventType) : note;
  delete payload.eventType;

  return payload;
}

export function CelebrationForm() {
  const startedRef = useRef(false);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);

  // Set after mount (not during SSR) so server and client markup always match,
  // whatever timezones are involved. Built from LOCAL date parts — toISOString()
  // would give the UTC date, which is "yesterday" in zones ahead of UTC (e.g.
  // IST before 05:30) and would let past dates through the min guard.
   
  useEffect(() => {
    const d = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tz-safe client-side date minimum
    setMinDate(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    );
  }, []);

  const onStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("celebration_form_started");
  };

  return (
    <EnquiryFormShell
      type="celebration"
      submitLabel="Send enquiry"
      successLine="Your celebration enquiry has been received — the team takes it from here."
      onStarted={onStarted}
      buildPayload={buildPayload}
    >
      {({ submitting, fieldErrors }) => (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" htmlFor="cele-name" required error={fieldErrors.contactName}>
            <input
              id="cele-name"
              name="contactName"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              required
              aria-invalid={!!fieldErrors.contactName}
              className={inputClass}
              disabled={submitting}
            />
          </Field>

          <Field label="Mobile number" htmlFor="cele-phone" required error={fieldErrors.phone}>
            <input
              id="cele-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="Mobile number"
              required
              aria-invalid={!!fieldErrors.phone}
              className={inputClass}
              disabled={submitting}
            />
          </Field>

          <Field label="Email" htmlFor="cele-email" error={fieldErrors.email} hint="Optional.">
            <input
              id="cele-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!fieldErrors.email}
              className={inputClass}
              disabled={submitting}
            />
          </Field>

          <Field label="Event type" htmlFor="cele-type" required>
            <div className="relative">
              <select id="cele-type" name="eventType" defaultValue="" required className={selectClass} disabled={submitting}>
                <option value="" disabled>
                  Select the occasion
                </option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {/* top-7 centres the chevron on the h-11 control beneath its mt-1.5 */}
              <ChevronDown
                className="pointer-events-none absolute right-3 top-7 h-4 w-4 -translate-y-1/2 text-ink-soft"
                aria-hidden="true"
              />
            </div>
          </Field>

          <Field label="Event date" htmlFor="cele-date" required error={fieldErrors.eventDate}>
            <input
              id="cele-date"
              name="eventDate"
              type="date"
              min={minDate}
              required
              aria-invalid={!!fieldErrors.eventDate}
              className={inputClass}
              disabled={submitting}
            />
          </Field>

          <Field label="Expected guests" htmlFor="cele-guests" required error={fieldErrors.guestCount}>
            <input
              id="cele-guests"
              name="guestCount"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              placeholder="e.g. 120"
              required
              aria-invalid={!!fieldErrors.guestCount}
              className={inputClass}
              disabled={submitting}
            />
          </Field>

          <Field label="Preferred location" htmlFor="cele-location" required>
            <div className="relative">
              <select
                id="cele-location"
                name="locationSlug"
                defaultValue=""
                required
                className={selectClass}
                disabled={submitting}
              >
                <option value="">No preference</option>
                <option value="svm">Srikant Verma Marg</option>
                <option value="mangla">Mangla Chowk</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-7 h-4 w-4 -translate-y-1/2 text-ink-soft"
                aria-hidden="true"
              />
            </div>
          </Field>

          <Field label="Estimated budget" htmlFor="cele-budget" hint="Optional.">
            <div className="relative">
              <select
                id="cele-budget"
                name="budgetRange"
                defaultValue=""
                className={selectClass}
                disabled={submitting}
              >
                <option value="">Select a range (optional)</option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-7 h-4 w-4 -translate-y-1/2 text-ink-soft"
                aria-hidden="true"
              />
            </div>
          </Field>

          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-medium text-ink">
              What should the team arrange?{" "}
              <span className="font-normal text-ink-soft">(optional — tick all that apply)</span>
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {REQUIREMENTS.map((requirement) => (
                <label
                  key={requirement}
                  className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border border-border bg-white px-4 text-sm font-medium text-ink shadow-[0_1px_2px_rgba(38,33,27,0.04)] transition-colors has-[:checked]:border-brass has-[:checked]:bg-ivory has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brass/50 disabled:opacity-50"
                >
                  <input
                    type="checkbox"
                    name="requirements"
                    value={requirement}
                    className="h-4 w-4 accent-brand"
                    disabled={submitting}
                  />
                  {requirement}
                </label>
              ))}
            </div>
          </fieldset>

          <Field
            label="Message"
            htmlFor="cele-message"
            className="sm:col-span-2"
            hint="Optional — anything else about the celebration."
          >
            <textarea
              id="cele-message"
              name="message"
              maxLength={1500}
              placeholder="Tell us about the celebration"
              className={textareaClass}
              disabled={submitting}
            />
          </Field>
        </div>
      )}
    </EnquiryFormShell>
  );
}
