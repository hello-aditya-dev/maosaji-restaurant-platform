import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MaskedLines } from "./masked-lines";
import { Reveal } from "@/components/shared/reveal";

/**
 * 05 — BAKERY. A change of visual tempo
 * Bright, clean, soft daylight. One large hero cake image plus two smaller
 * editorial crops (pastry + cookies) — calmer than SWEET, product-focused.
 * No standard 4-card grid.
 */
export function BakeryChapter() {
  return (
    <section aria-labelledby="bakery-heading" className="bg-parchment py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Large hero + two small crops */}
          <div className="order-1 grid grid-cols-[1fr_38%] grid-rows-[auto_auto] gap-4 sm:gap-5 lg:order-2">
            <Reveal variant="mask" className="col-span-1 row-span-2">
              <figure className="soft-mask relative aspect-[4/5] sm:aspect-[3/4]">
                <Image
                  src="/images/bakery/bakery-wide.jpg"
                  alt="Cream cake and pastries on marble (concept imagery)"
                  fill
                  sizes="(max-width: 1024px) 60vw, 32vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>
            <Reveal variant="mask" delay={0.12} className="col-start-2 row-start-1">
              <figure className="soft-mask relative aspect-square">
                <Image
                  src="/images/items/pineapple-pastry.jpg"
                  alt="Pineapple pastry (concept imagery)"
                  fill
                  sizes="(max-width: 1024px) 24vw, 13vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>
            <Reveal variant="mask" delay={0.22} className="col-start-2 row-start-2">
              <figure className="soft-mask relative aspect-square">
                <Image
                  src="/images/items/chocolate-chip-cookies.jpg"
                  alt="Chocolate chip cookies (concept imagery)"
                  fill
                  sizes="(max-width: 1024px) 24vw, 13vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>
          </div>

          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="eyebrow-ink">From the bakery</p>
            </Reveal>
            <MaskedLines
              as="h2"
              id="bakery-heading"
              className="display-lg mt-4 font-serif font-medium text-ink"
              lines={["Bakery."]}
            />
            <Reveal delay={0.25} className="mt-6 max-w-md">
              <p className="lede text-ink-soft">
                Cream cakes, pastries and cookies — soft, bright and quietly
                indulgent. Slice today, or plan a cake for the next celebration.
              </p>
            </Reveal>
            <Reveal delay={0.35} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link
                href="/bakery"
                className="group inline-flex items-center gap-4 font-serif text-2xl font-medium text-ink transition-colors hover:text-brand"
              >
                Explore the bakery
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-parchment">
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </Link>
              <Link
                href="/bakery#cake-enquiry"
                className="quiet-link text-[11px] font-semibold uppercase tracking-[0.22em] text-ink"
              >
                Enquire about a cake
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
