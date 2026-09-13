import { permanentRedirect } from "next/navigation";

/**
 * P0 locked a dedicated contact route; until a distinct NAP contact page ships,
 * permanently redirect locale /contact to the journey planner (/plan).
 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/plan`);
}
