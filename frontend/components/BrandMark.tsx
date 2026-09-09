import Link from "next/link";

export function BrandMark({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link className={`brand-mark ${onDark ? "brand-mark--on-dark" : ""}`} href="/" aria-label="Gondar Simien Tours home">
      <span className="brand-mark__image" aria-hidden="true" />
    </Link>
  );
}
