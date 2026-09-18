import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProvider } from "@/lib/data-provider";
import { restaurant } from "@/config/restaurant";
import { FilmHero } from "@/components/site/cinema/film-hero";
import { BrandStatement } from "@/components/site/cinema/brand-statement";
import { EatChapter } from "@/components/site/cinema/eat-chapter";
import { SweetChapter } from "@/components/site/cinema/sweet-chapter";
import { BakeryChapter } from "@/components/site/cinema/bakery-chapter";
import { MenuDiscovery, type DiscoveryItem } from "@/components/site/cinema/menu-discovery";
import { CelebrateChapter } from "@/components/site/cinema/celebrate-chapter";
import { LocationsChapter } from "@/components/site/cinema/locations-chapter";
import { StoryChapter } from "@/components/site/cinema/story-chapter";
import { FinalCta } from "@/components/site/cinema/final-cta";
import { Reveal } from "@/components/shared/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${restaurant.displayName} — Private Concept (Unofficial)`,
};

/**
 * HOMEPAGE — cinematic narrative (Visual Experience Override, 18 Sep 2026)
 *  01 film hero · 02 brand statement · 03 EAT · 04 SWEET · 05 BAKERY
 *  · 06 menu discovery · 07 CELEBRATE · 08 locations · 09 story · 10 final CTA
 */
export default async function HomePage() {
  const provider = getProvider();
  const [items, offers, settings] = await Promise.all([
    provider.getMenuItems(),
    provider.getActiveOffers(),
    provider.getSettings(),
  ]);

  const discovery: DiscoveryItem[] = items
    .filter((i) => i.isAvailable)
    .map((i) => ({
      id: i.id,
      slug: i.slug,
      name: i.name,
      description: i.description,
      categorySlug: i.categorySlug,
      priceCents: i.priceCents,
      imageUrl: i.imageUrl,
      isVegetarian: i.isVegetarian,
      isFeatured: i.isFeatured,
    }));

  const announcement =
    typeof settings.homepage_announcement === "string" && settings.homepage_announcement.trim()
      ? settings.homepage_announcement
      : null;
  const offer = offers[0];

  return (
    <>
      <FilmHero announcement={announcement} />
      <BrandStatement />
      <EatChapter />
      <SweetChapter />
      <BakeryChapter />

      {/* Offer — DB-driven, rendered as a quiet editorial interlude */}
      {offer && (
        <section aria-labelledby="offer-heading" className="border-y border-border bg-cream">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_36%] lg:gap-16 lg:px-12">
            <div>
              <Reveal>
                <p className="eyebrow-ink">
                  Offer · <span className="text-ink-soft/60">demo data</span>
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 id="offer-heading" className="display-sm mt-4 font-serif font-medium text-ink">
                  {offer.headline ?? offer.title}
                </h2>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft">{offer.description}</p>
              </Reveal>
              {offer.ctaLabel && offer.ctaHref && (
                <Reveal delay={0.26} className="mt-7">
                  <Link
                    href={offer.ctaHref}
                    className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand"
                  >
                    {offer.ctaLabel}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </Reveal>
              )}
            </div>
            {offer.imageSlug && (
              <Reveal variant="mask">
                <figure className="soft-mask relative aspect-[16/9]">
                  <Image
                    src={offer.imageSlug}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 92vw, 34vw"
                    className="object-cover"
                  />
                </figure>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <MenuDiscovery items={discovery} />
      <CelebrateChapter />
      <LocationsChapter />
      <StoryChapter />
      <FinalCta />
    </>
  );
}
