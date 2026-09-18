import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Cake,
  CheckCircle2,
  Heart,
  PartyPopper,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { restaurant } from "@/config/restaurant";
import { Reveal } from "@/components/shared/reveal";
import { PageHero } from "@/components/site/cinema/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { CelebrationForm } from "@/components/forms/celebration-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Celebrations — ${restaurant.displayName} (Private Concept)`,
  description:
    "Birthdays, weddings, family functions, corporate events, festivals and large gatherings — one enquiry covers catering, sweets, snacks, gift boxes and cake.",
};

const OCCASIONS: { icon: LucideIcon; title: string; line: string }[] = [
  { icon: Cake, title: "Birthdays", line: "Cakes, snacks and sweets for the birthday table." },
  { icon: Heart, title: "Weddings", line: "Sweets, catering and gift boxes at guest-list scale." },
  { icon: Users, title: "Family Functions", line: "Family gatherings, fed without the fuss." },
  { icon: Building2, title: "Corporate Events", line: "Office celebrations and team meals, end to end." },
  { icon: Sparkles, title: "Festivals", line: "Festive sweets and gift boxes in season." },
  { icon: PartyPopper, title: "Large Gatherings", line: "Big guest lists, planned in bulk and on time." },
];

const ASSURANCES = [
  "One enquiry covers catering, sweets, snacks, gift boxes, cake and restaurant bookings.",
  "You get a reference number the moment you submit.",
  "The team confirms details, quantities and pricing before anything is finalised.",
];

export default function CelebrationsPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        eyebrow="Celebrations"
        title="Make it an occasion."
        lede="Birthdays, weddings and family functions — tell us what you are planning and the team takes it from there."
        image="/images/hero-celebrations.jpg"
        alt="Festive celebration table with brass thalis and sweets (concept imagery)"
      />

      {/* Occasion cards */}
      <section aria-label="Occasions we cater" className="border-b border-border bg-background py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Occasions"
              title="What are we celebrating?"
              description="Pick the occasion — every card leads to the same short enquiry."
            />
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OCCASIONS.map((occasion, i) => (
              <Reveal as="li" key={occasion.title} delay={(i % 3) * 0.05}>
                <Link
                  href="#celebration-form"
                  className="group flex h-full gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream text-brand">
                    <occasion.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 font-serif text-base font-semibold text-ink">
                      {occasion.title}
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 text-brass transition-transform duration-150 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                      {occasion.line}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Enquiry form */}
      <section
        id="celebration-form"
        aria-label="Celebration enquiry form"
        className="scroll-mt-24 py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <SectionHeader
                eyebrow="The next step"
                title="Tell us about your celebration"
                description="Share the occasion, the date and the guest count — the team comes back on the food, the quantities and the next steps."
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
                <CelebrationForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
