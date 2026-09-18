"use client";

/**
 * Bulk / corporate order quote form — the /bulk-orders sales-demo centrepiece.
 * Server-side Zod validation keys: organization / contactName / phone / email /
 * quantity / occasion / eventDate (plus optional categories, budgetRange,
 * locationSlug, message).
 *
 * `occasion` is validated server-side but has no dedicated storage column, so
 * it is folded into the message ("Corporate gifting — 200 boxes…") to keep the
 * full context visible in the admin demo.
 */

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { EnquiryFormShell, Field, inputClass, selectClass } from "./enquiry-form-shell";
import { track } from "@/lib/analytics";

const OCCASIONS = [
  "Corporate gifting",
  "Festival gifting",
  "Wedding",
  "Employee celebration",
  "Bulk namkeen",
  "Large food order",
  "Other",
] as const;

const CATEGORIES = [
  "Sweets",
  "Namkeen",
  "Bakery & cookies",
  "Gift boxes",
  "Snacks",
  "Beverages",
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
  payload.categories = Array.from(
    form.querySelectorAll<HTMLInputElement>('input[name="categories"]:checked')
  ).map((el) => el.value);

  // Optional selects/inputs: empty string → not sent.
  if (payload.budgetRange === "") delete payload.budgetRange;
  if (payload.locationSlug === "") delete payload.locationSlug;
  if (payload.email === "") delete payload.email;

  // occasion has no storage column — fold it into the message.
  const occasion = typeof payload.occasion === "string" ? payload.occasion : "";
  const note = typeof payload.message === "string" ? payload.message.trim() : "";
  payload.message = occasion ? (note ? `${occasion} — ${note}` : occasion) : note;

  return payload;
}

export function BulkOrderForm() {
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
    track("bulk_form_started");
  };

  return (
    <EnquiryFormShell
      type="bulk_order"
      submitLabel="Send quote request"
      successLine="Your quote request has been received — the team takes it from here."
      onStarted={onStarted}
      buildPayload={buildPayload}
    >
      {({ submitting, fieldErrors }) => (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Organisation" htmlFor="bulk-org" required error={fieldErrors.organization}>
            <input
              id="bulk-org"
              name="organization"
              type="text"
              autoComplete="organization"
              placeholder="Company, team or family name"
              required
              aria-invalid={!!fieldErrors.organization}
              className={inputClass}
              disabled={submitting}
            />
          </Field>

          <Field label="Contact name" htmlFor="bulk-name" required error={fieldErrors.contactName}>
            <input
              id="bulk-name"
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

          <Field label="Phone" htmlFor="bulk-phone" required error={fieldErrors.phone}>
            <input
              id="bulk-phone"
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

          <Field label="Email" htmlFor="bulk-email" error={fieldErrors.email} hint="Optional.">
            <input
              id="bulk-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!fieldErrors.email}
              className={inputClass}
              disabled={submitting}
            />
          </Field>

          <Field label="Quantity" htmlFor="bulk-quantity" required error={fieldErrors.quantity}>
            <input
              id="bulk-quantity"
              name="quantity"
              type="text"
              placeholder="e.g. 200 gift boxes"
              required
              aria-invalid={!!fieldErrors.quantity}
              className={inputClass}
              disabled={submitting}
            />
          </Field>

          <Field label="Occasion" htmlFor="bulk-occasion" required error={fieldErrors.occasion}>
            <div className="relative">
              <select
                id="bulk-occasion"
                name="occasion"
                defaultValue=""
                required
                aria-invalid={!!fieldErrors.occasion}
                className={selectClass}
                disabled={submitting}
              >
                <option value="" disabled>
                  Select the occasion
                </option>
                {OCCASIONS.map((occasion) => (
                  <option key={occasion} value={occasion}>
                    {occasion}
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

          <Field label="Required by" htmlFor="bulk-date" required error={fieldErrors.eventDate}>
            <input
              id="bulk-date"
              name="eventDate"
              type="date"
              min={minDate}
              required
              aria-invalid={!!fieldErrors.eventDate}
              className={inputClass}
              disabled={submitting}
            />
          </Field>

          <Field label="Preferred outlet" htmlFor="bulk-outlet" hint="Optional.">
            <div className="relative">
              <select
                id="bulk-outlet"
                name="locationSlug"
                defaultValue=""
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

          <Field label="Estimated budget" htmlFor="bulk-budget" className="sm:col-span-2" hint="Optional.">
            <div className="relative sm:max-w-sm">
              <select
                id="bulk-budget"
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
              Which categories?{" "}
              <span className="font-normal text-ink-soft">(optional — tick all that apply)</span>
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border border-border bg-white px-4 text-sm font-medium text-ink shadow-[0_1px_2px_rgba(38,33,27,0.04)] transition-colors has-[:checked]:border-brass has-[:checked]:bg-ivory has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brass/50 disabled:opacity-50"
                >
                  <input
                    type="checkbox"
                    name="categories"
                    value={category}
                    className="h-4 w-4 accent-brand"
                    disabled={submitting}
                  />
                  {category}
                </label>
              ))}
            </div>
          </fieldset>

          <Field
            label="Message"
            htmlFor="bulk-message"
            className="sm:col-span-2"
            hint="Optional — pack sizes, delivery notes, branding needs."
          >
            <textarea
              id="bulk-message"
              name="message"
              maxLength={1500}
              placeholder="Anything else the team should know"
              className={textareaClass}
              disabled={submitting}
            />
          </Field>
        </div>
      )}
    </EnquiryFormShell>
  );
}
