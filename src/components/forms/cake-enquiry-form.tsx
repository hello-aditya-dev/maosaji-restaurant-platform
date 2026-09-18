"use client";

/**
 * Cake enquiry form — custom/designer cake requests from the /bakery page.
 * Client-side it only collects; validation happens server-side (Zod) and
 * fieldErrors come back keyed by contactName / phone / eventDate / cakeType /
 * cakeWeight. Reference image upload is intentionally NOT offered — the demo
 * data layer does not support file storage safely yet.
 */

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { EnquiryFormShell, Field, inputClass, selectClass } from "./enquiry-form-shell";
import { track } from "@/lib/analytics";

const CAKE_TYPES = [
  "Birthday — chocolate truffle",
  "Birthday — black forest",
  "Anniversary",
  "Custom/designer cake",
  "Other",
] as const;

const CAKE_WEIGHTS = ["500 g", "1 kg", "1.5 kg", "2 kg", "2 kg+"] as const;

/** inputClass, but sized for a multi-line note instead of a fixed h-11 row. */
const textareaClass =
  "mt-1.5 flex min-h-[104px] w-full resize-y rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-ink shadow-[0_1px_2px_rgba(38,33,27,0.04)] transition-colors placeholder:text-ink-soft/50 focus-visible:border-brass focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brass/50 disabled:opacity-50 aria-[invalid=true]:border-[#b3261e]";

function buildPayload(form: HTMLFormElement): Record<string, unknown> {
  const fd = new FormData(form);
  return Object.fromEntries(fd.entries());
}

export function CakeEnquiryForm() {
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
    track("cake_form_started");
  };

  return (
    <EnquiryFormShell
      type="cake"
      submitLabel="Send cake enquiry"
      successLine="Your cake enquiry has been received — keep the reference number handy."
      onStarted={onStarted}
      buildPayload={buildPayload}
    >
      {({ submitting, fieldErrors }) => (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" htmlFor="cake-name" required error={fieldErrors.contactName}>
            <input
              id="cake-name"
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

          <Field label="Mobile number" htmlFor="cake-phone" required error={fieldErrors.phone}>
            <input
              id="cake-phone"
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

          <Field label="Date needed" htmlFor="cake-date" required error={fieldErrors.eventDate}>
            <input
              id="cake-date"
              name="eventDate"
              type="date"
              min={minDate}
              required
              aria-invalid={!!fieldErrors.eventDate}
              className={inputClass}
              disabled={submitting}
            />
          </Field>

          <Field
            label="Cake type"
            htmlFor="cake-type"
            required
            error={fieldErrors.cakeType}
            hint="Reference image upload is planned for production — describe the design in the notes for now."
          >
            <div className="relative">
              <select
                id="cake-type"
                name="cakeType"
                defaultValue=""
                required
                aria-invalid={!!fieldErrors.cakeType}
                className={selectClass}
                disabled={submitting}
              >
                <option value="" disabled>
                  Select a cake type
                </option>
                {CAKE_TYPES.map((type) => (
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

          <Field label="Approximate weight" htmlFor="cake-weight" required error={fieldErrors.cakeWeight}>
            <div className="relative">
              <select
                id="cake-weight"
                name="cakeWeight"
                defaultValue=""
                required
                aria-invalid={!!fieldErrors.cakeWeight}
                className={selectClass}
                disabled={submitting}
              >
                <option value="" disabled>
                  Select a weight
                </option>
                {CAKE_WEIGHTS.map((weight) => (
                  <option key={weight} value={weight}>
                    {weight}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-7 h-4 w-4 -translate-y-1/2 text-ink-soft"
                aria-hidden="true"
              />
            </div>
          </Field>

          <Field
            label="Message on the cake"
            htmlFor="cake-message"
            hint="Optional — exactly what should be written on top."
          >
            <input
              id="cake-message"
              name="cakeMessage"
              type="text"
              maxLength={200}
              placeholder="e.g. Happy Birthday Aarav"
              className={inputClass}
              disabled={submitting}
            />
          </Field>

          <Field
            label="Notes"
            htmlFor="cake-notes"
            className="sm:col-span-2"
            hint="Optional — flavour preferences, pickup outlet, anything else."
          >
            <textarea
              id="cake-notes"
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
