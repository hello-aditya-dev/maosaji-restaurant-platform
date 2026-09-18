import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MaskedLines } from "./masked-lines";
import { Reveal } from "@/components/shared/reveal";

/**
 * 07 — BEYOND THE TABLE. Signature commercial chapter
 * Full-bleed packing scene + editorial "BEYOND THE TABLE" typography + the
 * four enquiry capabilities (Bulk, Celebrations, Cake, Gifting). The DB-driven
 * festive-gifting offer is folded in here (it used to sit awkwardly before the
 * menu) so the flow reads EAT → SWEET → BAKERY → MENU → BEYOND THE TABLE.
 */
export function CelebrateChapter({
  offerHeadline,
  offerCopy,
  offerHref,
  offerLabel,
  offerImage,
}: {
  offerHeadline?: string | null;
  offerCopy?: string | null;
  offerHref?: string | null;
  offerLabel?: string | null;
  offerImage?: string | null;
}) {
  const actions = [
    { label: "Bulk orders", href: "/bulk-orders" },
    { label: "Celebrations", href: "/celebrations" },
    { label: "Cake enquiry", href: "/bakery#cake-enquiry" },
    { label: "Gifting", href: offerHref ?? "/bulk-orders" },
  ];

  return (
    <section aria-labelledby="celebrate-heading" className="relative overflow-hidden bg-espresso">
      <div className="grid lg:grid-cols-[1fr_40%]">
        <div className="relative order-2 lg:order-1">
          {/* Full-bleed packing scene */}
          <figure className="relative h-[42vh] min-h-[300px] lg:h-full lg:min-h-[600px]">
            <Image
              src={offerImage ?? "/images/celebrate/celebrate-wide.jpg"}
              alt="Gift boxes of sweets and namkeen being packed with ribbon (concept imagery)"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="film-grade absolute inset-0" aria-hidden="true" />
          </figure>
        </div>

        <div className="order-1 flex flex-col justify-center px-5 py-16 sm:px-8 lg:order-2 lg:px-12 lg:py-24">
          <Reveal variant="fade">
            <p className="eyebrow text-brass-soft">Beyond the table</p>
          </Reveal>
          <MaskedLines
            as="h2"
            id="celebrate-heading"
            className="display-md mt-4 font-serif font-medium text-parchment"
            lines={["More than", "a meal."]}
          />
          <Reveal delay={0.25} className="mt-6 max-w-md">
            <p className="text-[15px] leading-relaxed text-parchment/75">
              {offerCopy ??
                "Gift boxes, wedding sweets, corporate hampers and celebration cakes — one structured enquiry reaches the team, and this platform tracks it end to end."}
            </p>
          </Reveal>

          <Reveal delay={0.35} className="mt-8">
            <ul className="grid grid-cols-2 gap-3 sm:max-w-md">
              {actions.map((action) => (
                <li key={action.label}>
                  <Link
                    href={action.href}
                    className="group flex items-center justify-between gap-2 rounded-lg border border-parchment/25 px-4 py-3.5 text-parchment transition-all duration-300 hover:border-brass-soft hover:bg-parchment hover:text-espresso"
                  >
                    <span className="font-serif text-base font-medium">{action.label}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      {/* Celebration table detail — quiet band beneath */}
      <div className="relative border-t border-parchment/10">
        <figure className="relative mx-auto h-[26vh] max-w-7xl md:h-[30vh]">
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
