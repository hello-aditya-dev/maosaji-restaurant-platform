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
 */
export function StoryChapter() {
  return (
    <section aria-labelledby="story-heading" className="bg-parchment py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_44%] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow-ink">Our story</p>
            </Reveal>
            <MaskedLines
              as="h2"
              id="story-heading"
              className="display-md mt-4 font-serif font-medium text-ink"
              lines={["A familiar name", "in Bilaspur."]}
            />
            <Reveal delay={0.25} className="mt-7 max-w-md">
              <p className="lede text-ink-soft">{restaurant.story.body}</p>
            </Reveal>
            <Reveal delay={0.35} className="mt-10">
              <Link
                href="/our-story"
                className="group inline-flex items-center gap-4 font-serif text-2xl font-medium text-ink transition-colors hover:text-brand sm:text-3xl"
              >
                Read our story
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-parchment">
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
            <Reveal delay={0.45}>
              <p className="mt-8 max-w-md border-l-2 border-brass/60 pl-4 text-xs leading-relaxed text-ink-soft/75">
                The full history — founders, family, milestones — is intentionally
                unwritten. It should be documented with the owner, never invented.
              </p>
            </Reveal>
          </div>

          <Reveal variant="mask">
            <figure className="relative">
              <div className="soft-mask relative aspect-[4/5] sm:aspect-[16/12] lg:aspect-[4/5]">
                <Image
                  src="/images/hero-story.jpg"
                  alt="Warm restaurant interior with brass lamps and set tables (concept imagery)"
                  fill
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="soft-mask absolute -bottom-8 -left-4 hidden aspect-square w-40 border-4 border-parchment sm:block lg:-left-10 lg:w-48">
                <Image
                  src="/images/gallery/kitchen.jpg"
                  alt="Hands plating food at the kitchen pass (concept imagery)"
                  fill
                  sizes="12vw"
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
