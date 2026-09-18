"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * MASKED LINES — editorial type reveal: each line sits in an overflow-hidden
 * track and rises into view. Used for chapter words and oversized statements.
 */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  as: Tag = "span",
  delay = 0,
  stagger = 0.12,
  id,
}: {
  lines: (string | React.ReactNode)[];
  className?: string;
  lineClassName?: string;
  as?: "span" | "h1" | "h2" | "p" | "div";
  delay?: number;
  stagger?: number;
  id?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <Tag id={id} className={cn("block", className)}>
        {lines.map((line, i) => (
          <span key={i} className={cn("block", lineClassName)}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }
  return (
    <Tag id={id} className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={cn("block will-change-transform", lineClassName)}
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: [0.22, 0.58, 0.24, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
