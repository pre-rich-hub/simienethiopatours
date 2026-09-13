import { JournalIndex } from "@/components/JournalIndex";
import { getTranslations } from "next-intl/server";
import { pageMetadata, localeFromParam } from "@/lib/seo";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale: localeFromParam(locale), namespace: "journal" });
  return pageMetadata({ locale: localeFromParam(locale), title: t("journal"), description: t("journalIntro"), path: "/journal" });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { return <JournalIndex locale={(await params).locale} />; }
