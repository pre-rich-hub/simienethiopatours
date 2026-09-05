import Image from "next/image";
import Link from "next/link";

export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`brand-mark ${inverse ? "brand-mark--inverse" : ""}`} href="/" aria-label="Gondar Simien Tours home">
      <Image
        className="brand-mark__image"
        src="/images/gondar-simien-tours-logo.png"
        alt=""
        width={1536}
        height={1024}
        sizes="(max-width: 720px) 86px, 112px"
        priority
      />
    </Link>
  );
}
