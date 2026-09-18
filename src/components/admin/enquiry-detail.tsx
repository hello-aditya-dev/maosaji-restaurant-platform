"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import {
  ENQUIRY_STATUSES,
  type EnquiryDTO,
  type EnquiryStatus,
} from "@/lib/data-provider/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DemoDataChip, EnquiryTypeChip, StatusChip } from "./status-chip";
import { formatDateTimeIst, typeLabelLong } from "./format";

/** Simple label/value pair used across the enquiry detail sheet. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft/80">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

/** Event dates are plain strings from the public forms — format when parseable. */
function tryFormatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export type LocationOption = { slug: string; name: string; shortName?: string };

/**
 * EnquiryDetail — every submitted field, laid out clearly, with the status
 * control (PATCHes through the parent's optimistic handler).
 */
export function EnquiryDetail({
  enquiry,
  locationOptions,
  statusPending,
  onStatusChange,
}: {
  enquiry: EnquiryDTO;
  locationOptions: LocationOption[];
  statusPending: boolean;
  onStatusChange: (status: EnquiryStatus) => void;
}) {
  const locationName = enquiry.locationSlug
    ? locationOptions.find((l) => l.slug === enquiry.locationSlug)?.name ?? enquiry.locationSlug
    : null;

  const requirements =
    enquiry.requirements && enquiry.requirements.length > 0 ? enquiry.requirements : null;

  return (
    <div className="border-t border-border bg-ivory/70 px-4 py-4 sm:px-5 sm:py-5">
      {/* Status control — the presenter's primary action */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft/80">
            Status
          </span>
          <StatusChip status={enquiry.status} />
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          {statusPending && (
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
              Saving…
            </span>
          )}
          <div className="flex flex-col gap-1">
            <span className="sr-only">
              <Label htmlFor={`status-${enquiry.id}`}>Enquiry status</Label>
            </span>
            <Select
              value={enquiry.status}
              onValueChange={(value) => onStatusChange(value as EnquiryStatus)}
              disabled={statusPending}
            >
              <SelectTrigger id={`status-${enquiry.id}`} size="sm" className="w-[170px] bg-card">
                <SelectValue placeholder="Set status" />
              </SelectTrigger>
              <SelectContent>
                {ENQUIRY_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Every submitted field */}
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Reference">{enquiry.referenceNumber}</Field>
        <Field label="Enquiry type">{typeLabelLong(enquiry.type)}</Field>
        <Field label="Provenance">
          <DemoDataChip isDemo={enquiry.isDemoData} />
        </Field>
        <Field label="Contact name">{enquiry.contactName}</Field>
        <Field label="Phone">{enquiry.phone}</Field>
        {enquiry.email && <Field label="Email">{enquiry.email}</Field>}
        {enquiry.organization && <Field label="Organisation">{enquiry.organization}</Field>}
        {locationName && <Field label="Preferred location">{locationName}</Field>}
        {enquiry.eventDate && <Field label="Event date">{tryFormatDate(enquiry.eventDate)}</Field>}
        {enquiry.guestCount !== null && enquiry.guestCount !== undefined && (
          <Field label="Expected guests">{enquiry.guestCount.toLocaleString("en-IN")}</Field>
        )}
        {enquiry.quantity && <Field label="Quantity">{enquiry.quantity}</Field>}
        {enquiry.budgetRange && <Field label="Budget range">{enquiry.budgetRange}</Field>}
        {requirements && (
          <Field label="Requirements">
            <span className="flex flex-wrap gap-1.5">
              {requirements.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center rounded-md border border-border bg-cream px-1.5 py-0.5 text-xs text-ink-soft"
                >
                  {r}
                </span>
              ))}
            </span>
          </Field>
        )}
        {enquiry.cakeType && <Field label="Cake type">{enquiry.cakeType}</Field>}
        {enquiry.cakeWeight && <Field label="Cake weight">{enquiry.cakeWeight}</Field>}
        {enquiry.cakeMessage && <Field label="Message on cake">“{enquiry.cakeMessage}”</Field>}
        {enquiry.message && (
          <div className="sm:col-span-2 lg:col-span-3">
            <Field label="Message">
              <p className="whitespace-pre-line rounded-lg border border-border bg-card p-3 text-sm leading-relaxed text-ink">
                {enquiry.message}
              </p>
            </Field>
          </div>
        )}
        <Field label="Source">{enquiry.source}</Field>
        <Field label="Submitted">{formatDateTimeIst(enquiry.createdAt)}</Field>
        <Field label="Last updated">{formatDateTimeIst(enquiry.updatedAt)}</Field>
      </dl>

      <p className="mt-4 flex items-center gap-2 text-[11px] text-ink-soft/80">
        <EnquiryTypeChip type={enquiry.type} />
        Status changes save immediately and are visible to everyone using this console.
      </p>
    </div>
  );
}
