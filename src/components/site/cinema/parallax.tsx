"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Small, restrained parallax — movement comes from scrolling, not UI chaos.
 * `range` is pixels of vertical drift across the element's scroll passage.
 */
export function Parallax({
  children,
  range = 44,
  className,
}: {
  children: ReactNode;
  range?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range / 2, -range / 2]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
