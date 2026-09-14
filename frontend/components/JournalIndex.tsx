import Image from "@/components/Image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageShell } from "./PageShell";
import { getPosts, resolveMediaUrl } from "@/lib/catalogue";
import { cardBlurb } from "@/lib/card-blurb";
import { notFound } from "next/navigation";
export async function JournalIndex({ locale, categorySlug }: { locale: string; categorySlug?: string }) {
  const posts = await getPosts(locale);
  const t = await getTranslations("journal");
  const categories = [...new Map(posts.flatMap(p => p.category ? [[p.category.slug, p.category] as const] : [])).values()];
  const category = categories.find(c => c.slug === categorySlug);
  if (categorySlug && !category) notFound();
  const visible = posts.filter(p => !categorySlug || p.category?.slug === categorySlug);
  return <PageShell lightHeader>
    <section className="page-hero editorial-hero"><div className="shell">
      <nav className="breadcrumbs"><Link href="/journal">{t("journal")}</Link>{category && <span>{category.name}</span>}</nav>
      <h1 className="display">{category?.name ?? t("journal")}</h1><p className="lead">{t("journalIntro")}</p>
    </div></section>
    <section className="section shell">
      {categories.length > 0 && <nav className="page-links" aria-label={t("categories")}>{categories.map(c => <Link key={c.slug} href={`/journal/category/${c.slug}`}>{c.name}</Link>)}</nav>}
      {visible.length === 0 && <p>{t("emptyJournal")}</p>}
      <div className="simien-photo-grid simien-photo-grid--3">{visible.map(post => <article key={post.slug} className="simien-photo-card dest-card">
        <Link href={post.path} locale={post.locale}>
          {post.imageUrl && <div className="simien-photo-card__image"><Image src={resolveMediaUrl(post.imageUrl)} alt={post.imageAlt ?? ""} fill sizes="(max-width: 720px) 100vw, 33vw" /></div>}
          <div className="simien-photo-card__body"><h2>{post.blogTitle}</h2><p>{cardBlurb(post.description, 140)}</p><p>{post.author} · <time dateTime={post.publishedAt}>{new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(post.publishedAt))}</time></p><span>{t("readArticle")}</span></div>
        </Link>
      </article>)}</div>
    </section>
  </PageShell>;
}
