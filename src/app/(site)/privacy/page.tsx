import type { Metadata } from "next";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How this private concept demo handles the little data it collects — local demo storage, no third-party trackers.",
};

const LAST_UPDATED = "18 September 2026";

const SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: "What this is",
    paragraphs: [
      "This website is a private concept prepared for Maosaji. It is unofficial — not affiliated with, endorsed by or operated on behalf of Maosaji — and it is not the official Maosaji website. This page explains, in plain language, how the demo handles data.",
    ],
  },
  {
    heading: "What the demo collects",
    paragraphs: [
      "Enquiry forms on this site — celebrations, bulk orders, cakes and general contact — store what you type in the demo's own local backend: your name, your phone or WhatsApp number, the outlet you select and the details of your request.",
      "The demo also records local analytics events, such as a menu search or an ordering link being opened. Those events are stored in the same demo database and appear only in the demo admin dashboard, clearly labelled as demo data.",
    ],
  },
  {
    heading: "What the demo does not do",
    paragraphs: [
      "There are no third-party trackers, advertising pixels or external analytics scripts anywhere on this site. Nothing is sold, shared or forwarded to anyone, and no notifications — email, WhatsApp or SMS — are ever sent to the restaurant from this demo.",
    ],
  },
  {
    heading: "Cookies and local storage",
    paragraphs: [
      "The site sets no tracking cookies. Two small things live on your own device: your selected outlet and your order list, held in the browser's local storage so the demo feels continuous from page to page. Clearing your browser data removes both.",
      "A single session cookie exists for the demo admin area. It is used only to keep the demo dashboard signed in and expires after twelve hours.",
    ],
  },
  {
    heading: "Enquiries and contact expectations",
    paragraphs: [
      "Submissions through the enquiry forms are demonstrations only. They do not reach the restaurant, and no one will respond to them.",
      "To place a real order, use the Zomato or Swiggy listings linked from this site. For anything else, use the restaurant's publicly listed contact details.",
    ],
  },
  {
    heading: "Name and marks",
    paragraphs: [
      "\u201CMaosaji\u201D and any related names or marks belong to their rightful owner. They appear here only to illustrate a private concept and imply no affiliation or endorsement.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <section className="pb-20 pt-24 sm:pt-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="sr-only">Privacy</h1>
        <Reveal>
          <SectionHeader
            eyebrow="Legal"
            title="Privacy"
            description="How this private concept demo handles the little data it collects — written plainly, because there isn't much of it."
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
