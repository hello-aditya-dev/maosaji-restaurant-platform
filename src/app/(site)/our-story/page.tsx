import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Leaf,
  MapPin,
  NotebookPen,
  Sun,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { restaurant } from "@/config/restaurant";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = {
  title: "Our Story",
  description: `${restaurant.story.heading} ${restaurant.story.body}`,
};

/**
 * Generic, non-factual value cards — deliberately free of claims that would
 * need owner verification (no dates, no history, no provenance statements).
 */
const VALUES = [
  {
    icon: Leaf,
    title: "Quality ingredients",
    copy: "Everyday staples, chosen with care — the familiar done properly.",
  },
  {
    icon: Sun,
    title: "Fresh through the day",
    copy: "Made in batches through the day, so the counter never sits still.",
  },
  {
    icon: Users,
    title: "Made for gatherings",
    copy: "Boxes, trays and platters built for the table you're sharing.",
  },
  {
    icon: Heart,
    title: "Everyday favourites",
    copy: "The sweets and dishes people come back for, week after week.",
  },
] as const;

const NEXT_STEPS = [
  {
    href: "/menu",
    icon: UtensilsCrossed,
    title: "Explore the menu",
    copy: "Restaurant favourites, sweets, bakery and namkeen — the full spread, organised.",
  },
  {
    href: "/locations",
    icon: MapPin,
    title: "Find your outlet",
    copy: "Srikant Verma Marg and Mangla Chowk — pick the one closest to you.",
  },
] as const;

export default function OurStoryPage() {
  return (
    <>
      {/* Hero band */}
      <section
        aria-label="Our story introduction"
        className="relative flex h-[38vh] min-h-[300px] items-end overflow-hidden bg-ink"
      >
        <Image
          src="/images/hero-story.jpg"
          alt="Warmly lit restaurant dining room with wooden tables (generic placeholder photography)"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Top scrim keeps the fixed navbar legible; bottom scrim carries the title */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-ink/45 via-transparent to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent"
        />
        <div aria-hidden="true" className="grain absolute inset-0" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass-soft">
            Our story
          </p>
          <h1 className="mt-3 max-w-2xl text-balance font-serif text-3xl font-semibold leading-tight text-parchment sm:text-4xl lg:text-5xl">
            {restaurant.story.heading}
          </h1>
        </div>
      </section>

      {/* Body — config copy verbatim, then only publicly verifiable facts */}
      <section aria-label="Our story" className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-lg leading-relaxed text-ink-soft sm:text-xl">
              {restaurant.story.body}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                The range is deliberately wide. Restaurant food, Indian sweets, bakery
                products and namkeen all sit under one name — a single stop for a weekday
                lunch, a festival box or a birthday cake.
              </p>
              <p>
                In Bilaspur, you&rsquo;ll find that name at two locations — Srikant Verma
                Marg (SVM) and Mangla Chowk.
              </p>
              <p>
                For ordering in, both locations are listed on Zomato and Swiggy, so the
                food arrives through the platforms you already use.
              </p>
            </div>
          </Reveal>

          {/* Provenance note — intentional, to be completed with the owner */}
          <Reveal delay={0.1}>
            <aside
              aria-label="Provenance note"
              className="relative mt-10 rounded-xl border border-border bg-cream py-6 pl-7 pr-6 sm:py-8 sm:pl-9 sm:pr-8"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-4 left-0 w-1 rounded-full bg-brass"
              />
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-brass">
                <NotebookPen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                To be completed with the owner
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {restaurant.story.note}
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Values strip */}
      <section
        aria-label="Our values"
        className="border-y border-border bg-cream py-14 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="What we stand for"
              title="Simple things, done well"
            />
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.05}>
                <div className="group h-full rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)] sm:p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cream text-brand transition-colors duration-200 group-hover:text-brass">
                    <v.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-serif text-base font-semibold text-ink">
                    {v.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-soft sm:text-sm">
                    {v.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Link cards */}
      <section aria-label="Keep exploring" className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Keep exploring" title="Where to next?" />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {NEXT_STEPS.map((step, i) => (
              <Reveal key={step.href} delay={i * 0.05}>
                <Link
                  href={step.href}
                  className="group flex h-full gap-5 rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cream text-brand">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 font-serif text-lg font-semibold text-ink">
                      {step.title}
                      <ArrowRight
                        className="h-4 w-4 text-brass transition-transform duration-150 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                      {step.copy}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
