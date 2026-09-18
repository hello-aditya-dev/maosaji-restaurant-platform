import Image from "next/image";
import { MaskedLines } from "./masked-lines";
import { Parallax } from "./parallax";
import { Reveal } from "@/components/shared/reveal";

/**
 * 02 — BRAND STATEMENT
 * A vast warm-ivory field. Oversized type with isolated food imagery drifting
 * around it — Maosaji's breadth communicated without a single category card.
 */
export function BrandStatement() {
  return (
    <section
      id="one-name"
      aria-labelledby="one-name-heading"
      className="relative overflow-hidden bg-ivory py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
          {/* Statement */}
          <div className="relative">
            <MaskedLines
              as="h2"
              id="one-name-heading"
              className="display-lg font-serif font-medium text-ink"
              lines={[
                "One name.",
                <span key="cravings">
                  Many <em className="font-light italic text-brand">cravings.</em>
                </span>,
              ]}
            />
            <Reveal delay={0.35} className="mt-7 max-w-md">
              <p className="lede text-ink-soft">
                Restaurant favourites, sweets, bakery and namkeen — across
                Bilaspur.
              </p>
            </Reveal>
          </div>

          {/* Floating specimens — isolated food imagery around the type */}
          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-5 sm:gap-7 lg:max-w-none">
            <Parallax range={56} className="col-span-1 space-y-5 sm:space-y-7">
              <Reveal variant="mask">
                <figure className="arch-mask relative aspect-[3/4]">
                  <Image
                    src="/images/brand/thali-arch.jpg"
                    alt="Vegetarian thali (concept imagery)"
                    fill
                    sizes="(max-width: 1024px) 45vw, 22vw"
                    className="object-cover"
                  />
                </figure>
              </Reveal>
              <Reveal variant="mask" delay={0.12}>
                <figure className="circle-mask relative aspect-square">
                  <Image
                    src="/images/brand/chaat-bowl.jpg"
                    alt="Papdi chaat in an earthen bowl (concept imagery)"
                    fill
                    sizes="(max-width: 1024px) 45vw, 22vw"
                    className="object-cover"
                  />
                </figure>
              </Reveal>
            </Parallax>
            <Parallax range={-40} className="col-span-1 mt-10 space-y-5 sm:mt-16 sm:space-y-7">
              <Reveal variant="mask" delay={0.08}>
                <figure className="circle-mask relative aspect-square">
                  <Image
                    src="/images/brand/dosa-roll.jpg"
                    alt="Golden rolled dosa with chutneys (concept imagery)"
                    fill
                    sizes="(max-width: 1024px) 45vw, 22vw"
                    className="object-cover"
                  />
                </figure>
              </Reveal>
              <Reveal variant="mask" delay={0.2}>
                <figure className="arch-mask relative aspect-[3/4]">
                  <Image
                    src="/images/brand/cake-slice.jpg"
                    alt="Cream cake slice (concept imagery)"
                    fill
                    sizes="(max-width: 1024px) 45vw, 22vw"
                    className="object-cover"
                  />
                </figure>
              </Reveal>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}
