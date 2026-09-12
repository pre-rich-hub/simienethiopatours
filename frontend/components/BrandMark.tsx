import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";

export function BrandMark({ onDark = false, label }: { onDark?: boolean; label: string }) {
  return (
    <Link className={`brand-mark ${onDark ? "brand-mark--on-dark" : ""}`} href="/" aria-label={label}>
      <span
        className="brand-mark__image"
        aria-hidden="true"
        style={{ ["--brand-mark-image" as string]: `url("${site.brand.badge}")` }}
      />
    </Link>
  );
}
