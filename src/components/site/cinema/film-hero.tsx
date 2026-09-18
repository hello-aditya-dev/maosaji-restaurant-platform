"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { restaurant } from "@/config/restaurant";
import { FilmFrames, type FilmFrame } from "./film-frames";

/**
 * 01 — CINEMATIC HERO
 * A silent six-shot food film: thali → dosa → mithai → garnish → bakery →
 * gift box. Overlay is deliberately restrained — one name, one line, one cue.
 * Portrait derivatives below `sm`; static poster for reduced motion.
 */

const FILM: FilmFrame[] = [
  { src: "/images/film/film-1-thali.jpg", alt: "Vegetarian thali being finished with fresh roti (concept imagery)" },
  { src: "/images/film/film-2-dosa.jpg", alt: "Dosa crisping on a black griddle (concept imagery)" },
  { src: "/images/film/film-3-mithai.jpg", alt: "Indian sweets with silver leaf, macro (concept imagery)" },
  { src: "/images/film/film-4-garnish.jpg", alt: "Pistachio slivers falling onto barfi (concept imagery)" },
  { src: "/images/film/film-5-bakery.jpg", alt: "Cream cake being sliced (concept imagery)" },
  { src: "/images/film/film-6-box.jpg", alt: "A gift box of sweets being tied with ribbon (concept imagery)" },
];

const FILM_PORTRAIT: FilmFrame[] = [
  { src: "/images/film/film-1-thali-p.jpg", alt: "Vegetarian thali (concept imagery)" },
  { src: "/images/film/film-2-dosa-p.jpg", alt: "Dosa on the griddle (concept imagery)" },
  { src: "/images/film/film-3-mithai-p.jpg", alt: "Indian sweets macro (concept imagery)" },
];

export function FilmHero({ announcement }: { announcement: string | null }) {
  const reduce = useReducedMotion();

  const line = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 0.58, 0.24, 1] as const },
        };

  return (
    <section
      aria-label="Welcome"
      className="grain relative flex h-[95svh] min-h-[560px] flex-col justify-end overflow-hidden bg-espresso"
    >
      <div className="absolute inset-0">
        <FilmFrames frames={FILM} portraitFrames={FILM_PORTRAIT} intervalMs={5200} />
      </div>
      {/* Left-weighted legibility scrim — keeps type quiet but readable */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-espresso/90 via-espresso/35 to-espresso/35 sm:bg-gradient-to-r sm:from-espresso/70 sm:via-transparent sm:to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-5 pb-32 pt-28 sm:px-8 sm:pb-24 lg:px-12">
        {announcement && (
          <motion.p
            {...line(0.1)}
            className="mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-parchment/25 bg-espresso/45 px-4 py-1.5 text-[11px] font-medium tracking-wide text-parchment backdrop-blur-sm"
          >
            <span className="h-1 w-1 rounded-full bg-brass-soft" aria-hidden="true" />
            {announcement}
          </motion.p>
        )}

        <motion.p {...line(0.18)} className="eyebrow text-brass-soft">
          {restaurant.hero.eyebrow}
        </motion.p>

        <motion.h1
          {...line(0.3)}
          className="display-xl mt-5 font-serif font-medium text-parchment"
        >
          {restaurant.hero.title}
        </motion.h1>

        <motion.p
          {...line(0.46)}
          className="mt-6 max-w-xs font-serif text-xl italic leading-snug text-parchment/90 sm:max-w-sm sm:text-2xl"
        >
          {restaurant.hero.line}
        </motion.p>

        <motion.div {...line(0.6)} className="mt-10">
          <a
            href="#one-name"
            className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-parchment/85 transition-colors hover:text-parchment"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-parchment/30 transition-all duration-300 group-hover:border-parchment/70 group-hover:bg-parchment/10">
              <ArrowDown className="h-4 w-4 animate-bounce-soft" aria-hidden="true" />
            </span>
            Explore
          </a>
        </motion.div>
      </div>

      <p className="absolute right-4 top-[4.5rem] z-20 hidden max-w-[230px] text-right text-[10px] leading-snug text-parchment/55 sm:right-8 sm:top-24 sm:block">
        Private concept — not the official {restaurant.displayName} website
      </p>
    </section>
  );
}
