"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MaskedLines } from "./masked-lines";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

/**
 * 03 — EAT. Editorial chapter
 * Desktop: a sticky portrait media rail occupies ~55-65% of the viewport while
 * short category copy progresses beside it. Mobile: a natural vertical
 * sequence — no desktop sticky constructs forced onto small screens.
 */

const COURSES = [
  {
    id: "north-indian",
    label: "North Indian",
    line: "Paneer, gravies and the everyday classics.",
    image: "/images/eat/sticky-curry.jpg",
    alt: "Paneer butter masala in a copper handi (concept imagery)",
  },
  {
    id: "south-indian",
    label: "South Indian",
    line: "Dosas, idlis and chutneys from the south.",
    image: "/images/eat/sticky-dosa.jpg",
    alt: "Masala dosa with chutneys on a banana leaf (concept imagery)",
  },
  {
    id: "thali",
    label: "Thalis",
    line: "The whole table on one brass plate.",
    image: "/images/eat/sticky-thali.jpg",
    alt: "Vegetarian thali on a brass plate (concept imagery)",
  },
  {
    id: "chaat-snacks",
    label: "Chaat & Snacks",
    line: "Crisp, tangy, finished under a snowfall of sev.",
    image: "/images/eat/sticky-chaat.jpg",
    alt: "Raj kachori chaat with sev and pomegranate (concept imagery)",
  },
];

export function EatChapter() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(COURSES[0].id);
  const listRef = useRef<HTMLDivElement>(null);

  /* Scroll progress decides which portrait the sticky rail holds */
  useEffect(() => {
    if (reduce) return;
    const root = listRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-course]"));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement) {
          setActiveId(visible.target.dataset.course ?? COURSES[0].id);
        }
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0, 0.25, 0.6] },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [reduce]);

  return (
    <section aria-labelledby="eat-heading" className="bg-ivory py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <p className="eyebrow">Chapter one</p>
            </Reveal>
            <MaskedLines
              as="h2"
              id="eat-heading"
              className="display-xl mt-4 font-serif font-medium text-ink"
              lines={["Eat."]}
            />
          </div>
          <Reveal delay={0.2} className="max-w-xs pb-3">
            <p className="font-serif text-xl italic leading-snug text-ink-soft">
              The restaurant, the heart of the menu.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-[42%_1fr] lg:gap-14">
          {/* Copy progression */}
          <div ref={listRef} className="order-2 lg:order-1">
            {COURSES.map((course, i) => (
              <div
                key={course.id}
                data-course={course.id}
                className="scroll-mt-28 border-t border-border py-7 first:border-t-0 first:pt-0 sm:py-9 lg:py-11"
              >
                <Reveal variant="fade">
                  <div className="flex items-baseline gap-6">
                    <span className="font-serif text-sm italic text-brass">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3
                        className={cn(
                          "font-serif text-3xl font-medium transition-colors duration-500 sm:text-4xl",
                          activeId === course.id ? "text-brand" : "text-ink",
                        )}
                      >
                        {course.label}
                      </h3>
                      <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                        {course.line}
                      </p>
                      <Link
                        href={`/menu?category=${course.id === "thali" ? "thali" : course.id}`}
                        className="quiet-link mt-3 inline-flex items-center gap-1.5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink"
                      >
                        Browse {course.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </Reveal>

                {/* Mobile inline media */}
                <Reveal variant="mask" delay={0.1} className="mt-6 lg:hidden">
                  <figure className="soft-mask relative aspect-[4/3]">
                    <Image
                      src={course.image}
                      alt={course.alt}
                      fill
                      sizes="90vw"
                      className="object-cover"
                    />
                  </figure>
                </Reveal>
              </div>
            ))}
          </div>

          {/* Sticky media rail (desktop only) */}
          <div className="order-1 hidden lg:order-2 lg:block">
            <div className="sticky top-24 h-[68vh] min-h-[420px]">
              {COURSES.map((course) => (
                <div
                  key={course.id}
                  className={cn(
                    "absolute inset-0 transition-all duration-[1100ms] ease-[cubic-bezier(0.22,0.58,0.24,1)]",
                    activeId === course.id
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-6 opacity-0",
                  )}
                  aria-hidden={activeId !== course.id}
                >
                  <figure className="soft-mask relative h-full w-full">
                    <Image
                      src={course.image}
                      alt={course.alt}
                      fill
                      sizes="42vw"
                      className="object-cover"
                    />
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Reveal className="mt-12 border-t border-border pt-8 sm:mt-16">
          <Link
            href="/menu"
            className="group inline-flex items-center gap-4 font-serif text-2xl font-medium text-ink transition-colors hover:text-brand sm:text-3xl"
          >
            Explore the menu
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-parchment">
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
