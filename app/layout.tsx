import type { Metadata, Viewport } from "next";
import { ScrollReveal } from "@/components/ScrollReveal";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gondarsimientours.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Gondar Simien Tours | Your Local Gateway to the Simien Mountains", template: "%s | Gondar Simien Tours" },
  description: "Private, locally guided Simien Mountains treks and Gondar journeys, personally planned by Tesema ‘Tevan’ Mulualem and a Gondar-based team.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Gondar Simien Tours",
    title: "Your Local Gateway to the Simien Mountains",
    description: "Discover Gondar. Explore Simien. Travel deeper with a local team that walks the trails and handles the details.",
    images: [{ url: "/images/imet-gogo.jpg", width: 1600, height: 1200, alt: "Imet Gogo in Ethiopia's Simien Mountains" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#1c2d26", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const business = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Gondar Simien Tours",
    url: siteUrl,
    telephone: "+251956616969",
    email: "info@simienethiotours.com",
    address: { "@type": "PostalAddress", streetAddress: "Fasil Castle Street", addressLocality: "Gondar", addressCountry: "ET" },
    areaServed: ["Gondar", "Simien Mountains National Park", "Northern Ethiopia"],
  };
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a>{children}<ScrollReveal /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }} /></body></html>;
}
