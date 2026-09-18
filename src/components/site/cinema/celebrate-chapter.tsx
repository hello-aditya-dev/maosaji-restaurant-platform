import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MaskedLines } from "./masked-lines";
import { Reveal } from "@/components/shared/reveal";

/**
 * 07 — CELEBRATE. Commercial chapter
 * Back to full-width storytelling. Introduces the concept enquiry flows —
 * celebrations, bulk, gifting, cakes — into the existing working forms.
 */
export function CelebrateChapter() {
  return (
    <section aria-labelledby="celebrate-heading" className="relative overflow-hidden bg-espresso">
      <div className="grid lg:grid-cols-[1fr_38%]">
        <div className="relative order-2 lg:order-1">
          {/* Full-bleed packing scene */}
          <figure className="relative h-[46vh] min-h-[320px] lg:h-full lg:min-h-[640px]">
            <Image
              src="/images/celebrate/celebrate-wide.jpg"
              alt="Gift boxes of sweets and namkeen being packed with ribbon (concept imagery)"
              fill
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="object-cover"
            />
            <div className="film-grade absolute inset-0" aria-hidden="true" />
          </figure>
        </div>

        <div className="order-1 flex flex-col justify-center px-5 py-20 sm:px-8 lg:order-2 lg:px-12 lg:py-32">
          <Reveal variant="fade">
            <p className="eyebrow text-brass-soft">Beyond the table</p>
          </Reveal>
          <MaskedLines
            as="h2"
            id="celebrate-heading"
            className="display-md mt-4 font-serif font-medium text-parchment"
            lines={["More than", "a meal."]}
          />
          <Reveal delay={0.25} className="mt-7 max-w-md">
            <p className="text-[15px] leading-relaxed text-parchment/75">
              Two hundred gift boxes for a corporate Diwali. A birthday cake with
              a name on it. Sweets for a wedding, snacks for a function. One
              structured enquiry reaches the team — and this platform tracks it
              end to end.
            </p>
          </Reveal>

          <Reveal delay={0.35} className="mt-10 space-y-4">
            <Link
              href="/celebrations"
              className="group inline-flex w-fit items-center gap-4 font-serif text-2xl font-medium text-parchment transition-colors hover:text-brass-soft"
            >
              Plan an occasion
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-parchment/25 transition-all duration-300 group-hover:border-brass-soft group-hover:bg-brass-soft group-hover:text-espresso">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </Link>
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
              <Link
                href="/bulk-orders"
                className="quiet-link decoration-brass-soft/50 text-[11px] font-semibold uppercase tracking-[0.22em] text-parchment/80 hover:text-parchment"
              >
                Request a bulk quote
              </Link>
              <Link
                href="/bakery#cake-enquiry"
                className="quiet-link decoration-brass-soft/50 text-[11px] font-semibold uppercase tracking-[0.22em] text-parchment/80 hover:text-parchment"
              >
                Custom cake enquiry
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Celebration table detail — quiet band beneath */}
      <div className="relative border-t border-parchment/10">
        <figure className="relative mx-auto h-[30vh] max-w-7xl md:h-[34vh]">
          <Image
            src="/images/celebrate/celebrate-tall.jpg"
            alt="Celebration table detail with diya, marigold and sweets box (concept imagery)"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-90"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-espresso/60 via-transparent to-espresso/60"
            aria-hidden="true"
          />
        </figure>
      </div>
    </section>
  );
}
