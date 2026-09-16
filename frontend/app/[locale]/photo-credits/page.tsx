import Image from "@/components/Image";
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { localeFromParam, pageMetadata } from "@/lib/seo";
import { photoCredits, verifiedPhotoCreditCount } from "@/lib/photo-credits";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale: localeFromParam(locale),
    title: "Photo credits",
    description: "Source, authorship, licensing and attribution records for photographs used by Gondar Simien Tours.",
    path: "/photo-credits",
  });
}

export default function PhotoCreditsPage() {
  return (
    <PageShell>
      <section className="page-hero" aria-labelledby="photo-credits-heading">
        <div className="shell">
          <div className="breadcrumbs"><span>Home</span><span>/</span><span>Photo credits</span></div>
          <p className="eyebrow eyebrow--copper">Transparency</p>
          <h1 id="photo-credits-heading" className="display">Every image has<br /><em>a record.</em></h1>
          <p className="lead">The local filenames, subjects, source records and usage status for photographs used across this site.</p>
        </div>
      </section>

      <section className="section" aria-labelledby="credits-status-heading">
        <div className="shell">
          <div className="credits-status" role="note">
            <p className="eyebrow eyebrow--copper">Launch check · {verifiedPhotoCreditCount}/{photoCredits.length} fully verified</p>
            <h2 id="credits-status-heading">Attribution is complete for every shipped photograph.</h2>
            <p>Scenic files are Wikimedia Commons originals with exact File pages, authors and licenses. Operator portraits are supplied by Simien Ethio Tours for site use. Required attribution strings below must accompany any reuse of a photograph.</p>
            <p>If you own or supplied an image and need a correction, contact <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
          </div>

          <div className="credits-records" role="region" aria-label="Photo credit records">
            {photoCredits.map((photo, index) => (
              <article className="credits-record" key={photo.file}>
                <div className="credits-record__image">
                  <Image src={`/images/${photo.file}`} alt={photo.subject} fill sizes="(max-width: 720px) 100vw, 220px" />
                </div>
                <div className="credits-record__body">
                  <div className="credits-record__heading"><span className="eyebrow eyebrow--copper">{String(index + 1).padStart(2, "0")}</span><span className={`credit-status credit-status--${photo.status}`}>{photo.status === "verified" ? "Verified" : "Verification required"}</span></div>
                  <h2>{photo.subject}</h2>
                  <dl>
                    <div><dt>Local file</dt><dd><code>{photo.file}</code></dd></div>
                    <div><dt>Dimensions</dt><dd>{photo.dimensions}</dd></div>
                    <div><dt>Author</dt><dd>{photo.author}</dd></div>
                    <div><dt>License / permission</dt><dd>{photo.license}</dd></div>
                    <div><dt>Required attribution</dt><dd>{photo.attribution}</dd></div>
                  </dl>
                  <a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.sourceLabel} <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            ))}
          </div>

          <p className="credits-note">Images illustrate real places but do not represent a guaranteed view, season or specific departure. Logos and interface graphics are excluded from this photograph manifest.</p>
        </div>
      </section>
    </PageShell>
  );
}
