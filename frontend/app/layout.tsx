import type { Viewport } from "next";
import { getLocale } from "next-intl/server";
import { rootMetadata } from "@/lib/seo";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-ext-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-ext-500.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-ext-400-italic.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-ext-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-ext-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-ext-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/manrope/latin-ext-700.css";
import "./globals.css";

export const metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: "#1c2d26",
  colorScheme: "light",
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
