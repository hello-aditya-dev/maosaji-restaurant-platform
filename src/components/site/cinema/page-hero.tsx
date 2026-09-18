import Image from "next/image";
import { Reveal } from "@/components/shared/reveal";
import { MaskedLines } from "./masked-lines";

/**
 * PAGE HERO — cinematic dark band used by the commercial pages
 * (sweets, bakery, celebrations, bulk orders). Keeps the homepage's
 * media-first language alive deeper in the site.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  alt,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  image: string;
  alt: string;
}) {
  return (
    <section aria-labelledby="page-hero-heading" className="relative flex h-[46vh] min-h-[360px] flex-col justify-end overflow-hidden bg-espresso sm:h-[52vh]">
      <figure className="absolute inset-0" aria-hidden="true">
        <Image
          src={image}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="film-grade absolute inset-0" />
      </figure>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/30 to-espresso/35"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-28 sm:px-8 sm:pb-14 lg:px-12">
        <Reveal variant="fade">
          <p className="eyebrow text-brass-soft">{eyebrow}</p>
        </Reveal>
        <MaskedLines
          as="h1"
          id="page-hero-heading"
          className="display-md mt-4 font-serif font-medium text-parchment"
          lines={[title]}
        />
        {lede && (
          <Reveal delay={0.25} className="mt-5 max-w-md">
            <p className="text-[15px] leading-relaxed text-parchment/80">{lede}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
