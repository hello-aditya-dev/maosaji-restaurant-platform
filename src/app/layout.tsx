import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { restaurant } from "@/config/restaurant";

/**
 * Editorial pairing:
 *  – Fraunces (soft serif, opsz + SOFT axes, WONK off) → display voice
 *  – Figtree (humanist sans) → interface/body voice
 */
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// PRIVATE CONCEPT — must remain noindex,nofollow until owner approval.
// See 09_PRODUCTION_HANDOFF_CHECKLIST.md: remove only at authorized launch.
export const metadata: Metadata = {
  title: {
    default: `${restaurant.displayName} — Private Concept (Unofficial)`,
    template: `%s — ${restaurant.displayName} (Private Concept)`,
  },
  description: `A private concept website prepared for ${restaurant.displayName}, ${restaurant.city}. ${restaurant.demoDisclaimer}`,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, "max-image-preview": "none" },
  },
  applicationName: "Restaurant Platform v1",
  other: {
    "X-Robots-Placeholder": "header-set-in-middleware",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf6ef",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
