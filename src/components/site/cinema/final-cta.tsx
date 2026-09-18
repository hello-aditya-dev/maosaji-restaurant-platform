import Link from "next/link";
import { restaurant } from "@/config/restaurant";
import { MaskedLines } from "./masked-lines";
import { Reveal } from "@/components/shared/reveal";
import { Parallax } from "./parallax";

/**
 * 10 — FINAL CTA
 * The site ends the way it began — on appetite. A quiet food loop still, one
 * question, three doors. No corporate contact form.
 */
export function FinalCta() {
  const actions = [
    { label: "Menu", href: "/menu", note: "Browse everything" },
    { label: "Order", href: "/order", note: "Zomato & Swiggy" },
    { label: "Find a location", href: "/locations", note: "SVM & Mangla" },
  ];

  return (
    <section aria-labelledby="final-heading" className="relative overflow-hidden bg-espresso">
      <Parallax range={60} className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/final/final-wide.jpg)" }}
          role="img"
          aria-label="Masala chai being poured into a brass glass (concept imagery)"
        />
      </Parallax>
      <div className="grain absolute inset-0 bg-espresso/62" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40 lg:px-12">
        <Reveal variant="fade" className="text-center">
          <p className="eyebrow text-brass-soft">Before you go</p>
        </Reveal>
        <MaskedLines
          as="h2"
          id="final-heading"
          className="display-lg mx-auto mt-6 text-center font-serif font-medium text-parchment"
          lines={["What are you", "craving?"]}
        />

        <Reveal delay={0.3} className="mt-14">
          <ul className="mx-auto flex max-w-3xl flex-col items-stretch gap-4 sm:flex-row sm:gap-6">
            {actions.map((action) => (
              <li key={action.href} className="flex-1">
                <Link
                  href={action.href}
                  className="group flex h-full flex-col items-center justify-between gap-6 rounded-2xl border border-parchment/15 bg-espresso/40 px-6 py-8 backdrop-blur-sm transition-all duration-300 hover:border-brass-soft/60 hover:bg-espresso/25"
                >
                  <span className="font-serif text-2xl font-medium text-parchment transition-colors group-hover:text-brass-soft sm:text-[1.7rem]">
                    {action.label}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-parchment/50">
                    {action.note}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.4} className="mt-12 text-center">
          <p className="text-xs text-parchment/45">
            {restaurant.displayName} · {restaurant.city} — {restaurant.demoDisclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
