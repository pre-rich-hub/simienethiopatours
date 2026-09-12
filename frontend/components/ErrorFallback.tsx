import { buttonVariants } from "@/components/ui/button";

export function ErrorFallback({
  eyebrow,
  title,
  lead,
  retryLabel,
  onRetry,
  homeHref,
  homeLabel,
  secondaryHref,
  secondaryLabel,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  retryLabel: string;
  onRetry: () => void;
  homeHref: string;
  homeLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow eyebrow--copper">{eyebrow}</p>
          <h1 className="display">{title}</h1>
          <p className="lead">{lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className={buttonVariants({ variant: "ctaCopper", size: "cta" })} onClick={onRetry}>
              {retryLabel}
            </button>
            <a className={buttonVariants({ variant: "ctaDark", size: "cta" })} href={homeHref}>
              {homeLabel}
            </a>
            {secondaryHref && secondaryLabel ? (
              <a className={buttonVariants({ variant: "cta", size: "cta" })} href={secondaryHref}>
                {secondaryLabel}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
