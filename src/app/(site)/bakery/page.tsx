import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProvider } from "@/lib/data-provider";
import { restaurant } from "@/config/restaurant";
import { Reveal } from "@/components/shared/reveal";
import { PageHero } from "@/components/site/cinema/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { VegBadge } from "@/components/shared/veg-badge";
import { PriceTag } from "@/components/shared/price-tag";
import { AddToOrderButton } from "@/components/menu/add-to-order-button";
import { CakeEnquiryForm } from "@/components/forms/cake-enquiry-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Bakery & Cakes — ${restaurant.displayName} (Private Concept)`,
  description:
    "Cakes, pastries and cookies from the bakery counter — plus a custom cake enquiry for birthdays, anniversaries and designer cakes.",
};

export default async function BakeryPage() {
  const items = (await getProvider().getMenuItems()).filter(
    (item) => item.categorySlug === "bakery-cakes" && item.isAvailable
  );

  return (
    <>
      {/* Hero */}
      <PageHero
        eyebrow="Bakery &amp; Cakes"
        title="Fresh from the oven."
        lede="Cream cakes, pastries and cookies from the bakery counter — slice today, or plan a cake for Saturday."
        image="/images/hero-bakery.jpg"
        alt="Bakery display with cakes and pastries (concept imagery)"
      />

      {/* Product grid */}
      <section aria-label="Bakery items" className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeader
                eyebrow="From the counter"
                title="Cakes, pastries & cookies"
                description="Add favourites to your order list — prices and checkout stay with the ordering partners."
              />
              <Link
                href="/menu?category=bakery-cakes"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
              >
                View in full menu <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
              The bakery counter is being updated.{" "}
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

      {/* Birthday / custom cake enquiry */}
      <section
        id="cake-enquiry"
        aria-label="Custom cake enquiry"
        className="scroll-mt-24 border-t border-border bg-cream py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Custom cakes"
              title="Planning a birthday?"
              description="Tell us the date, the cake and the message — the enquiry goes straight to the team with a reference number."
            />
          </Reveal>
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-[#fffdf8]">
                <Image
                  src="/images/items/birthday-cake.jpg"
                  alt="Pastel birthday cake decorated with fresh cream flowers on a marble stand"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-soft">
                Chocolate truffle, black forest, anniversary and custom cakes — start with the
                form and the team will confirm what is possible for your date, including the
                message on top.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(38,33,27,0.04)] sm:p-8">
                <CakeEnquiryForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
