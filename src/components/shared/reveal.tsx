"use client";

import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The platform's standard reveal. Backward-compatible with every existing
 * usage (fade-up), plus editorial variants for the cinematic homepage:
 *
 *  – "up"    gentle rise (default — legacy behaviour)
 *  – "mask"  image mask reveal (clip + settle)
 *  – "scale" slow settle from a slightly larger crop
 *  – "fade"  opacity only (for dark bands)
 */

const EASE = [0.22, 0.58, 0.24, 1] as const;

const variantsFor = (variant: string): Variants => {
  switch (variant) {
    case "mask":
      return {
        hidden: { clipPath: "inset(12% 8% 12% 8%)", opacity: 0.4, scale: 1.015 },
        visible: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scale: 1 },
      };
    case "scale":
      return {
        hidden: { opacity: 0, scale: 1.06 },
        visible: { opacity: 1, scale: 1 },
      };
    case "fade":
      return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    default:
      return { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };
  }
};

const transitionFor = (variant: string, delay: number): Transition => ({
  duration: variant === "scale" ? 1.1 : variant === "mask" ? 1 : 0.55,
  delay,
  ease: EASE,
});

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  variant = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "figure" | "span" | "p" | "h2" | "h3";
  variant?: "up" | "mask" | "scale" | "fade";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  if (reduce) {
    return <Comp className={className}>{children}</Comp>;
  }
  return (
    <Comp
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variantsFor(variant)}
      transition={transitionFor(variant, delay)}
      className={className}
    >
      {children}
    </Comp>
  );
}
