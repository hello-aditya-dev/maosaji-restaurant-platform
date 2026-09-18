"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MaskedLines } from "./masked-lines";
import { Reveal } from "@/components/shared/reveal";

/**
 * 04 — SWEET. Signature chapter
 * A dark espresso band of macro mithai — texture, nuts, saffron, silver —
 * with a slow horizontal product rail drifting against the scroll.
 */

const RAIL = [
  { src: "/images/sweet/rail-katli.jpg", name: "Kaju Katli", note: "Silver-leaf cashew diamonds" },
  { src: "/images/sweet/rail-laddoo.jpg", name: "Motichoor Laddoo", note: "Fine boondi, pistachio" },
  { src: "/images/sweet/rail-barfi.jpg", name: "Pista Barfi", note: "Layered, saffron-kissed" },
  { src: "/images/sweet/rail-jamun.jpg", name: "Gulab Jamun", note: "In saffron syrup" },
];

export function SweetChapter() {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["3%", "-16%"]);

  return (
    <section aria-labelledby="sweet-heading" className="relative overflow-hidden bg-espresso py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal variant="fade">
              <p className="eyebrow text-brass-soft">Chapter two</p>
            </Reveal>
            <MaskedLines
              as="h2"
              id="sweet-heading"
              className="display-xl mt-4 font-serif font-medium text-parchment"
              lines={["Sweet."]}
            />
          </div>
          <Reveal variant="fade" delay={0.2} className="max-w-xs pb-3">
            <p className="font-serif text-xl italic leading-snug text-parchment/80">
              For a craving. For a gift. For the table.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 sm:mt-20 lg:grid-cols-[38%_1fr] lg:gap-16">
          {/* Tall macro portrait */}
          <Reveal variant="mask" className="order-1">
            <figure className="soft-mask relative aspect-[3/4] lg:aspect-auto lg:h-full lg:min-h-[520px]">
              <Image
                src="/images/sweet/sweet-tall.jpg"
                alt="Tower of Indian sweets with silver leaf and pistachio, macro (concept imagery)"
                fill
                sizes="(max-width: 1024px) 90vw, 34vw"
                className="object-cover"
              />
            </figure>
          </Reveal>

          <div className="order-2 flex flex-col justify-between gap-10">
            <Reveal variant="mask">
              <figure className="soft-mask relative aspect-[16/10]">
                <Image
                  src="/images/sweet/sweet-wide.jpg"
                  alt="Indian sweets in gleaming rows on brass trays (concept imagery)"
                  fill
                  sizes="(max-width: 1024px) 90vw, 58vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>

            <div>
              <Reveal>
                <p className="max-w-md text-[15px] leading-relaxed text-parchment/85">
                  Mithai, gifting and familiar favourites — barfi, laddoo and
                  gulab jamun for the table, the festival, or simply because
                  Thursday asked for it.
                </p>
              </Reveal>
              <Reveal delay={0.15} className="mt-8">
                <Link
                  href="/sweets"
                  className="group inline-flex items-center gap-4 font-serif text-2xl font-medium text-parchment transition-colors hover:text-brass-soft sm:text-3xl"
                >
                  Explore sweets
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-parchment/25 transition-all duration-300 group-hover:border-brass-soft group-hover:bg-brass-soft group-hover:text-espresso">
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* Drifting product rail */}
      <div ref={railRef} className="mt-12 sm:mt-16">
        <motion.ul
          style={reduce ? undefined : { x: drift }}
          className="flex w-max gap-5 sm:gap-8"
          aria-label="Sweets showcase"
        >
          {RAIL.map((item, i) => (
            <li key={item.src} className="w-[46vw] shrink-0 sm:w-[30vw] lg:w-[21vw]">
              <Reveal variant="mask" delay={i * 0.08}>
                <figure className="group relative">
                  <div className="soft-mask relative aspect-[4/5] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.65)]">
                    <Image
                      src={item.src}
                      alt={`${item.name}, macro concept photography`}
                      fill
                      sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 21vw"
                      className="object-cover transition-all duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                    <span className="font-serif text-lg font-medium text-parchment">{item.name}</span>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-parchment/50">{item.note}</span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
