import Link from "next/link";
import { restaurant } from "@/config/restaurant";
import { MaskedLines } from "./masked-lines";
import { Reveal } from "@/components/shared/reveal";
import { Parallax } from "./parallax";

/**
 * 10 — FINAL CTA
 * The site ends on appetite. A quiet food still, one question, three obvious
 * high-contrast doors — Menu, Order Online, Find Maosaji. No faint boxes.
 */
export function FinalCta() {
  const actions = [
    { label: "Menu", sub: "Browse everything", href: "/menu" },
    { label: "Order Online", sub: "Zomato & Swiggy", href: "/order" },
    { label: "Find Maosaji", sub: "SVM & Mangla", href: "/locations" },
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

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <Reveal variant="fade" className="text-center">
          <p className="eyebrow text-brass-soft">Before you go</p>
        </Reveal>
        <MaskedLines
          as="h2"
          id="final-heading"
          className="display-lg mx-auto mt-5 text-center font-serif font-medium text-parchment"
          lines={["What are you", "craving?"]}
        />

        <Reveal delay={0.3} className="mt-12">
          <ul className="mx-auto flex max-w-3xl flex-col items-stretch gap-3 sm:flex-row sm:gap-4">
            {actions.map((action) => (
              <li key={action.href} className="flex-1">
                <Link
                  href={action.href}
                  className="group flex h-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-parchment/70 bg-parchment/10 px-6 py-7 backdrop-blur-sm transition-all duration-300 hover:border-brass-soft hover:bg-parchment hover:text-espresso sm:py-8"
                >
                  <span className="font-serif text-2xl font-medium text-parchment transition-colors group-hover:text-espresso sm:text-[1.7rem]">
                    {action.label}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-parchment/60 transition-colors group-hover:text-espresso/70">
                    {action.sub}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.4} className="mt-10 text-center">
          <p className="text-xs text-parchment/45">
            {restaurant.displayName} · {restaurant.city} — {restaurant.demoDisclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
