import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Food, sweets, bakery and celebrations — a photo gallery for the Maosaji private concept.",
};

export default function GalleryPage() {
  return (
    <>
      <section
        aria-label="Gallery introduction"
        className="border-b border-border pb-10 pt-24 sm:pb-12 sm:pt-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="sr-only">Gallery</h1>
          <Reveal>
            <SectionHeader
              eyebrow="Gallery"
              title="A look inside"
              description="Food, sweets, bakery and celebrations — tap any photo to view it larger."
            />
          </Reveal>
        </div>
      </section>

      <section aria-label="Photo grid" className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <GalleryGrid />
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-10 flex max-w-xl items-start justify-center gap-2 text-center text-xs leading-relaxed text-ink-soft/80">
              <Camera
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass"
                aria-hidden="true"
              />
              <span>
                Placeholder photography for the private concept — production would use
                owner-approved originals.
              </span>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
