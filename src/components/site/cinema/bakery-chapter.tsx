import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MaskedLines } from "./masked-lines";
import { Reveal } from "@/components/shared/reveal";

/**
 * 05 — BAKERY. A change of visual tempo
 * Cream, whitespace, directional light. Related to the brand, quieter than
 * the chapters around it — proof the platform can hold many product worlds.
 */
export function BakeryChapter() {
  return (
    <section aria-labelledby="bakery-heading" className="bg-parchment py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="eyebrow-ink">Chapter three</p>
            </Reveal>
            <MaskedLines
              as="h2"
              id="bakery-heading"
              className="display-lg mt-4 font-serif font-medium text-ink"
              lines={["Bakery."]}
            />
            <Reveal delay={0.25} className="mt-7 max-w-md">
              <p className="lede text-ink-soft">
                Soft, fresh and quietly indulgent — cream cakes, pastries and
                cookies from the bakery counter. Order a slice today, or plan a
                cake for Saturday.
              </p>
            </Reveal>
            <Reveal delay={0.35} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
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

          <div className="order-1 grid grid-cols-[1fr_38%] items-end gap-4 sm:gap-6 lg:order-2">
            <Reveal variant="mask">
              <figure className="soft-mask relative aspect-[4/3]">
                <Image
                  src="/images/bakery/bakery-wide.jpg"
                  alt="Cream cake and pastries on marble, clean editorial styling (concept imagery)"
                  fill
                  sizes="(max-width: 1024px) 60vw, 38vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>
            <Reveal variant="mask" delay={0.15}>
              <figure className="soft-mask mb-0 aspect-[3/4] sm:mb-10">
                <Image
                  src="/images/bakery/bakery-tall.jpg"
                  alt="Layered pastry with linen and marble (concept imagery)"
                  fill
                  sizes="(max-width: 1024px) 30vw, 16vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
