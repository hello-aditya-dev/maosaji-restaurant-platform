import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  Heart,
  Package,
  Sparkles,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { restaurant } from "@/config/restaurant";
import { Reveal } from "@/components/shared/reveal";
import { PageHero } from "@/components/site/cinema/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { BulkOrderForm } from "@/components/forms/bulk-order-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Bulk & Corporate Orders — ${restaurant.displayName} (Private Concept)`,
  description:
    "Corporate gifting, festival boxes, wedding sweets, bulk namkeen and large food orders — one structured enquiry with a reference number.",
};

const USE_CASES: { icon: LucideIcon; title: string; line: string }[] = [
  { icon: Gift, title: "Corporate Gifting", line: "Boxed gifts for clients and partners, done properly." },
  { icon: Sparkles, title: "Festival Gifting", line: "Seasonal boxes, ordered ahead of the rush." },
  { icon: Heart, title: "Wedding Sweets", line: "Wedding sweets and gift boxes at guest-list scale." },
  { icon: Users, title: "Employee Celebrations", line: "Birthdays, milestones and team wins — boxed and ready." },
  { icon: Package, title: "Bulk Namkeen", line: "Namkeen and snacks in bulk for offices and events." },
  { icon: UtensilsCrossed, title: "Large Food Orders", line: "Party plates and full menus for big gatherings." },
];

const ASSURANCES = [
  "Built for volume — boxes, kilos and guest counts, not single plates.",
  "Every request gets a reference number the moment you submit.",
  "Details and pricing are confirmed by the team before pickup or delivery.",
];

const NEXT_STEPS = [
  {
    title: "Enquiry received",
    line: "Your request is logged with a reference number the moment you submit the form.",
  },
  {
    title: "Team confirms details & pricing",
    line: "The team reviews quantities, dates and categories, then confirms what is possible and the pricing.",
  },
  {
    title: "Pickup/delivery arranged at the outlet",
    line: "Once confirmed, your order is scheduled for pickup or delivery from your preferred outlet.",
  },
];

export default function BulkOrdersPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        eyebrow="Bulk &amp; Corporate"
        title="Order in volume."
        lede="Corporate gifting, festival boxes, wedding sweets and large food orders — one structured enquiry."
        image="/images/hero-bulk.jpg"
        alt="Premium gift boxes of sweets and namkeen (concept imagery)"
      />

      {/* Use case cards */}
      <section aria-label="Bulk order use cases" className="border-b border-border bg-background py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Use cases"
              title="What are you ordering for?"
              description="Pick the closest match — every card leads to the same short quote request."
            />
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((useCase, i) => (
              <Reveal as="li" key={useCase.title} delay={(i % 3) * 0.05}>
                <Link
                  href="#bulk-form"
                  className="group flex h-full gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream text-brand">
                    <useCase.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 font-serif text-base font-semibold text-ink">
                      {useCase.title}
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 text-brass transition-transform duration-150 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                      {useCase.line}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Quote request form */}
      <section
        id="bulk-form"
        aria-label="Bulk order quote request form"
        className="scroll-mt-24 py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <SectionHeader
                eyebrow="Request a quote"
                title="Tell us what you need"
                description="Quantities, dates and categories — one structured form instead of a hundred phone calls."
              />
              <ul className="mt-8 space-y-3">
                {ASSURANCES.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-veg" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-3">
              <div className="rounded-xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(38,33,27,0.04)] sm:p-8">
                <BulkOrderForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section aria-label="What happens next" className="border-t border-border bg-cream py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="After you submit"
              title="What happens next"
              description="Three steps between your enquiry and the food being in hand."
            />
          </Reveal>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {NEXT_STEPS.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-brass/40 bg-white font-serif text-base font-semibold text-brass"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.line}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
