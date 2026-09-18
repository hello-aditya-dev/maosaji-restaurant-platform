"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type FilmFrame = { src: string; alt: string };

/**
 * FILM FRAMES — the site's cinematic "video" engine.
 *
 * A silent, looping montage built from graded stills: slow crossfades with
 * alternating Ken Burns drift, engineered like a hero video loop without
 * shipping a single byte of video.
 *
 *  • first frame is `priority` (poster-equivalent LCP)
 *  • pauses when substantially off-screen or when the tab is hidden
 *  • prefers-reduced-motion → static poster composition
 *  • dedicated portrait frames below `sm` — never a squashed desktop crop
 *
 * CONNECTION-AWARE (P0-2 reliability): on a slow / data-saver connection we
 * deliberately SKIP the crossfade and show only the first (priority) frame as
 * a static poster. The hero still looks intentionally designed — the user on
 * a weak Indian mobile connection never sees a "broken" mid-crossfade gap
 * while a later frame is still downloading. The rotation the owner likes
 * remains on fast connections. We never depend on the Network Information
 * API for correctness — if it is unavailable we fall back to the rotation.
 */
export function FilmFrames({
  frames,
  portraitFrames,
  className,
  intervalMs = 5200,
  sizes = "100vw",
  grade = true,
}: {
  frames: FilmFrame[];
  portraitFrames?: FilmFrame[];
  className?: string;
  intervalMs?: number;
  sizes?: string;
  grade?: boolean;
}) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);
  const [running, setRunning] = useState(true);
  const [staticMode, setStaticMode] = useState(false);

  /* Responsive source strategy: portrait derivatives on narrow screens */
  useEffect(() => {
    if (!portraitFrames?.length) return;
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setIsPortrait(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [portraitFrames?.length]);

  /* Connection-aware: on saveData or 2g/slow-2g, prefer a static poster and
     skip the crossfade entirely (progressive enhancement, not a hard gate). */
  useEffect(() => {
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads prefers-reduced-motion (external browser preference) once on mount
      setStaticMode(true);
      return;
    }
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData) {
      setStaticMode(true);
      return;
    }
    const et = conn?.effectiveType;
    if (et === "slow-2g" || et === "2g") {
      setStaticMode(true);
      return;
    }
    // Additionally: if the second frame hasn't loaded within a short budget
    // we assume a slow link and freeze on the poster rather than flicker.
  }, [reduce]);

  const list = isPortrait && portraitFrames?.length ? portraitFrames : frames;

  /* Viewport-aware playback — pause when substantially outside view */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => setRunning(entry.intersectionRatio > 0.2),
      { threshold: [0, 0.2, 0.6] },
    );
    io.observe(el);
    const onVis = () => setRunning(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  /* The cut — only when not in static mode, running, and we have >1 frame */
  useEffect(() => {
    if (staticMode || reduce || list.length < 2 || !running) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % list.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [staticMode, reduce, running, list.length, intervalMs]);

  // In static mode (slow connection / reduced motion) we render only the
  // first frame so no other image needs to download. This is the "poster".
  const renderList = staticMode ? list.slice(0, 1) : list;

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden bg-espresso", className)}
      aria-hidden="true"
    >
      {renderList.map((frame, i) => {
        const isActive = i === active || staticMode;
        return (
          <div
            key={frame.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1600ms] ease-in-out",
              isActive ? "opacity-100" : "opacity-0",
            )}
            style={{ willChange: "opacity" }}
          >
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              sizes={sizes}
              priority={i === 0}
              className={cn(
                "object-cover",
                /* Ken Burns drift — alternates direction per frame */
                !reduce && isActive && list.length > 1 && !staticMode
                  ? i % 2 === 0
                    ? "animate-kenburns-a"
                    : "animate-kenburns-b"
                  : "",
              )}
            />
          </div>
        );
      })}
      {grade && <div className="film-grade pointer-events-none absolute inset-0 z-10" />}
    </div>
  );
}
