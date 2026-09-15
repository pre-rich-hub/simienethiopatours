import { JournalIndex } from "@/components/JournalIndex";
import { getPosts } from "@/lib/catalogue";
import { pageMetadata, localeFromParam } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = (await getPosts(locale)).find(p => p.category?.slug === slug);
  if (!post?.category) return {};
  const t = await getTranslations({ locale: localeFromParam(locale), namespace: "journal" });
  return pageMetadata({ locale: localeFromParam(locale), title: `${post.category.name} — ${t("journal")}`, description: t("journalIntro"), path: `/journal/category/${slug}` });
}
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) { const { locale, slug } = await params; return <JournalIndex locale={locale} categorySlug={slug} />; }
