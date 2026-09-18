import type { Metadata } from "next";
import { restaurant } from "@/config/restaurant";
import { getProvider } from "@/lib/data-provider";
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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${restaurant.displayName} — Private Concept (Unofficial)`,
};

/**
 * HOMEPAGE — cinematic narrative (Homepage Art-Direction Pass, 18 Sep 2026)
 *  01 film hero · 02 one name, many cravings · 03 EAT · 04 SWEET · 05 BAKERY
 *  · 06 menu discovery · 07 BEYOND THE TABLE · 08 two places, one Maosaji
 *  · 09 a familiar name in Bilaspur · 10 final cinematic CTA
 *  The DB-driven festive-gifting offer is folded into 07 (BEYOND THE TABLE)
 *  so the flow reads EAT → SWEET → BAKERY → MENU → BEYOND THE TABLE.
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
      <MenuDiscovery items={discovery} />
      <CelebrateChapter
        offerHeadline={offer?.headline ?? offer?.title ?? null}
        offerCopy={offer?.description ?? null}
        offerHref={offer?.ctaHref ?? null}
        offerLabel={offer?.ctaLabel ?? null}
        offerImage={offer?.imageSlug ?? null}
      />
      <LocationsChapter />
      <StoryChapter />
      <FinalCta />
    </>
  );
}
