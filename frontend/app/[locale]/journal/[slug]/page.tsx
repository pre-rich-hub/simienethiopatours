import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/PageShell";
import { EditorialHero } from "@/components/Editorial";
import { getPostForRoute, requireContentLocale, resolveMediaUrl } from "@/lib/catalogue";
import { catalogueMetadata } from "@/lib/catalogue-seo";
import { localeFromParam, absoluteUrl, localePath, jsonLdScript } from "@/lib/seo";
async function article(locale: string, slug: string) {
  const post = await getPostForRoute(slug, locale);
  if (!post) notFound();
  return requireContentLocale(post, locale);
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = await article(locale, slug);
  const metadata = catalogueMetadata({ locale: localeFromParam(locale), title: post.blogTitle, description: post.description, path: post.path, ...(post.imageUrl ? { image: { url: resolveMediaUrl(post.imageUrl), alt: post.imageAlt ?? "" } } : {}) }, post.availableLocales);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article" as const, publishedTime: post.publishedAt, modifiedTime: post.updatedAt, authors: [post.author] } };
}
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = await article(locale, slug);
  const t = await getTranslations("journal");
  const url = absoluteUrl(localePath(post.path, localeFromParam(locale)));
  const journalUrl = absoluteUrl(localePath("/journal", localeFromParam(locale)));
  return <PageShell lightHeader={!post.imageUrl}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript({ "@context": "https://schema.org", "@graph": [
      { "@type": "Article", headline: post.blogTitle, description: post.description, author: { "@type": "Person", name: post.author }, datePublished: post.publishedAt, dateModified: post.updatedAt, mainEntityOfPage: url, inLanguage: post.locale, ...(post.imageUrl ? { image: resolveMediaUrl(post.imageUrl).startsWith("/") ? absoluteUrl(resolveMediaUrl(post.imageUrl)) : resolveMediaUrl(post.imageUrl) } : {}) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: t("journal"), item: journalUrl }, { "@type": "ListItem", position: 2, name: post.blogTitle, item: url }] },
    ] }) }} />
    <EditorialHero eyebrow={t("journal")} title={post.blogTitle} accent="" lead={post.description} parent={{ label: t("journal"), href: "/journal" }} image={post.imageUrl ? { src: resolveMediaUrl(post.imageUrl), alt: post.imageAlt ?? "" } : undefined} />
    <article className="section shell prose">
      <nav className="breadcrumbs"><Link href="/journal">{t("journal")}</Link><span>{post.blogTitle}</span></nav>
      <p>{t("by")} {post.author} · <time dateTime={post.publishedAt}>{new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(post.publishedAt))}</time></p>
      <p>{t("updated")}: <time dateTime={post.updatedAt}>{new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(post.updatedAt))}</time></p>
      {post.content.split(/\n\s*\n/).filter(Boolean).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      {post.category && <Link href={`/journal/category/${post.category.slug}`}>{post.category.name}</Link>}
    </article>
  </PageShell>;
}
