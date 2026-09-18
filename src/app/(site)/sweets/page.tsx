import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";
import { getProvider } from "@/lib/data-provider";
import { restaurant } from "@/config/restaurant";
import { Reveal } from "@/components/shared/reveal";
import { PageHero } from "@/components/site/cinema/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { VegBadge } from "@/components/shared/veg-badge";
import { PriceTag } from "@/components/shared/price-tag";
import { AddToOrderButton } from "@/components/menu/add-to-order-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Sweets & Gifting — ${restaurant.displayName} (Private Concept)`,
  description:
    "Traditional sweets, festive boxes, dry fruits, namkeen and gift packs — browse the counter and enquire for festival or corporate gifting.",
};

/** Retail shelf categories — enquiry-led gifting lines point at /bulk-orders. */
const SHELF = [
  {
    label: "Traditional Sweets",
    line: "Everyday favourites from the counter.",
    href: "/menu?category=sweets",
    image: "/images/cat-sweets.jpg",
    alt: "Assorted Indian sweets with silver leaf arranged on a marble plate",
  },
  {
    label: "Festive Boxes",
    line: "Seasonal boxes, packed to gift.",
    href: "/bulk-orders",
    image: "/images/items/festive-sweets-box.jpg",
    alt: "Open festive gift box with assorted Indian sweets in neat rows",
  },
  {
    label: "Dry Fruits",
    line: "Gifting-grade dry fruit selections.",
    href: "/bulk-orders",
    image: "/images/items/dry-fruit-box.jpg",
    alt: "Assorted dry fruits — almonds, cashews, raisins and pistachios",
  },
  {
    label: "Namkeen",
    line: "Savoury crunch, by the box.",
    href: "/menu?category=namkeen",
    image: "/images/cat-namkeen.jpg",
    alt: "Indian namkeen mixture served in a brass bowl",
  },
  {
    label: "Gift Packs",
    line: "Curated packs for festivals and companies.",
    href: "/bulk-orders",
    image: "/images/items/motichoor-laddoo.jpg",
    alt: "Stack of motichoor laddoos on a brass plate",
  },
] as const;

export default async function SweetsPage() {
  const items = (await getProvider().getMenuItems()).filter(
    (item) => item.categorySlug === "sweets" && item.isAvailable
  );

  return (
    <>
      {/* Hero */}
      <PageHero
        eyebrow="Sweets &amp; Gifting"
        title="Something sweet."
        lede="Traditional sweets for every day, festive boxes for the season, and gifting for the people who matter."
        image="/images/hero-sweets.jpg"
        alt="Assorted Indian sweets on marble with brass bowls (concept imagery)"
      />

      {/* Category shelf */}
      <section aria-label="Sweets shelf categories" className="border-b border-border bg-background py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="The shelf"
              title="Browse the counter"
              description="Five ways to buy sweets — from a single box for home to festival and corporate volumes."
            />
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SHELF.map((shelf, i) => (
              <Reveal
                as="li"
                key={shelf.label}
                delay={i * 0.04}
                className={i === SHELF.length - 1 ? "col-span-2 sm:col-span-1" : undefined}
              >
                <Link
                  href={shelf.href}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                    <Image
                      src={shelf.image}
                      alt={shelf.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="flex items-center justify-between gap-2 text-sm font-semibold text-ink">
                      {shelf.label}
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 text-brass transition-transform duration-150 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1 text-xs leading-relaxed text-ink-soft">{shelf.line}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Product grid */}
      <section aria-label="Sweets from the counter" className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeader
                eyebrow="From the counter"
                title="The sweets shelf"
                description="Add favourites to your order list — prices and checkout stay with the ordering partners."
              />
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
              >
                View full menu <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          {items.length > 0 ? (
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item, i) => (
                <Reveal as="li" key={item.id} delay={(i % 4) * 0.05}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)]">
                    <div className="relative aspect-square overflow-hidden bg-cream">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-3.5">
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                        {item.isVegetarian && <VegBadge size={12} />} {item.name}
                      </h3>
                      {item.description && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                        <PriceTag priceCents={item.priceCents} className="text-xs" />
                        <AddToOrderButton
                          item={{
                            slug: item.slug,
                            name: item.name,
                            categorySlug: item.categorySlug,
                            imageUrl: item.imageUrl,
                          }}
                          compact
                        />
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="mt-8 rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm leading-relaxed text-ink-soft">
              The sweets counter is being updated.{" "}
              <Link
                href="/menu"
                className="font-medium text-brand underline decoration-brass-soft/60 underline-offset-4 transition-colors hover:text-brand-deep"
              >
                Browse the full menu
              </Link>{" "}
              in the meantime.
            </p>
          )}
        </div>
      </section>

      {/* Gifting CTA band */}
      <section aria-label="Bulk gifting enquiry" className="bg-brand py-14 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Reveal className="max-w-2xl">
            <Gift className="h-8 w-8 text-brass-soft" aria-hidden="true" />
            <h2 className="mt-4 font-serif text-2xl font-semibold text-balance text-parchment sm:text-3xl">
              Gifting for a festival or a company?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/85 sm:text-base">
              Festive boxes, dry fruits and gift packs in volume — send one enquiry and the team
              puts a quote together for you.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="shrink-0">
            <Link
              href="/bulk-orders"
              className="inline-flex items-center gap-2 rounded-md bg-parchment px-6 py-3.5 text-sm font-semibold text-ink transition-all duration-200 hover:bg-white active:scale-[0.98]"
            >
              Request a quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
