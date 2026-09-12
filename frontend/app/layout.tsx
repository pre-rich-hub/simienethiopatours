import type { Viewport } from "next";
import { ScrollReveal } from "@/components/ScrollReveal";
import { FloatingContact } from "@/components/FloatingContact";
import { jsonLdScript, organizationJsonLd, rootMetadata } from "@/lib/seo";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "./globals.css";

export const metadata = rootMetadata;

export const viewport: Viewport = { themeColor: "#1c2d26", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main-content">Skip to content</a>{children}<FloatingContact /><ScrollReveal /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }} /></body></html>;
}
