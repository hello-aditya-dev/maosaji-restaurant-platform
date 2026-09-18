import type { Metadata } from "next";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The ground rules for this private concept demo — unofficial, no orders or payments, demonstration data and placeholder imagery.",
};

const LAST_UPDATED = "18 September 2026";

const SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: "Unofficial private concept",
    paragraphs: [
      "This website is a private, unofficial concept prepared for Maosaji. It is not affiliated with, endorsed by or connected to Maosaji, and it is not the official Maosaji website.",
    ],
  },
  {
    heading: "No orders or payments",
    paragraphs: [
      "Nothing is sold on this site. It does not process orders, payments or reservations. Online ordering happens on third-party partner platforms — Zomato and Swiggy — and this site simply links to those public listings. Once you leave for a partner platform, that platform's own terms apply.",
    ],
  },
  {
    heading: "Enquiries are demonstrations",
    paragraphs: [
      "The forms on this site — celebrations, bulk orders, cakes and contact — are part of a demonstration flow. Submitting one creates a record in the demo backend and nothing more. It is not an order, a booking or a contract, and no response is promised or implied.",
    ],
  },
  {
    heading: "Accuracy of information",
    paragraphs: [
      "Menu items, categories, descriptions, availability and any other details shown are demonstration data. While the overall breadth of the offering reflects publicly available information, no warranty is given for the accuracy or completeness of anything on this site.",
      "Confirm current items, prices and availability directly with the restaurant or its ordering partners.",
    ],
  },
  {
    heading: "Imagery",
    paragraphs: [
      "All photography on this site is generic placeholder imagery. It does not depict Maosaji premises, food, products, staff or customers, and it must not be relied on as a representation of them.",
    ],
  },
  {
    heading: "Trademarks",
    paragraphs: [
      "The Maosaji name and any associated marks belong to their rightful owner. Their use in this private concept is illustrative only and implies no affiliation or endorsement.",
    ],
  },
  {
    heading: "Changes",
    paragraphs: [
      "This concept may be updated or withdrawn at any time. These terms were written for the private concept demo and will be revised together with the owner before any real-world use.",
    ],
  },
];

export default function TermsPage() {
  return (
    <section className="pb-20 pt-24 sm:pt-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="sr-only">Terms</h1>
        <Reveal>
          <SectionHeader
            eyebrow="Legal"
            title="Terms"
            description="The ground rules for this private concept demo — short, plain and specific to what this site actually is."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 space-y-8">
            {SECTIONS.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-lg font-semibold text-ink">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-4 text-sm leading-relaxed text-ink-soft sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-ink-soft/75">
            Last updated {LAST_UPDATED} · Private concept — not the official Maosaji
            website.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
