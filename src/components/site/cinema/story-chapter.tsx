import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { restaurant } from "@/config/restaurant";
import { MaskedLines } from "./masked-lines";
import { Reveal } from "@/components/shared/reveal";

/**
 * 09 — STORY. No invented history
 * "A familiar name in Bilaspur." — contemporary, verified-only copy. The
 * architecture is ready for the real story, which must come from the owner.
 * Compressed: one image, one short paragraph, one CTA.
 */
export function StoryChapter() {
  return (
    <section aria-labelledby="story-heading" className="bg-parchment py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_44%] lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow-ink">Our story</p>
            </Reveal>
            <MaskedLines
              as="h2"
              id="story-heading"
              className="display-md mt-3 font-serif font-medium text-ink"
              lines={["A familiar name", "in Bilaspur."]}
            />
            <Reveal delay={0.25} className="mt-6 max-w-md">
              <p className="lede text-ink-soft">{restaurant.story.body}</p>
            </Reveal>
            <Reveal delay={0.35} className="mt-8">
              <Link
                href="/our-story"
                className="group inline-flex items-center gap-4 font-serif text-2xl font-medium text-ink transition-colors hover:text-brand sm:text-3xl"
              >
                Our story
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-parchment">
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          </div>

          <Reveal variant="mask">
            <figure className="relative">
              <div className="soft-mask relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4]">
                <Image
                  src="/images/hero-story.jpg"
                  alt="Warm restaurant interior with brass lamps and set tables (concept imagery)"
                  fill
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
