import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Mail, Phone } from "@/components/Icon";
import { BrandMark } from "./BrandMark";
import { NewsletterForm } from "./NewsletterForm";
import { FacebookBadge, InstagramBadge, TiktokBadge, XBadge, YoutubeBadge } from "./SocialBadges";
import { site, verifiedSocialLinks, type SocialNetwork } from "@/lib/site";

const socialBadges: Record<SocialNetwork, { label: string; Icon: typeof InstagramBadge }> = {
  instagram: { label: "Instagram", Icon: InstagramBadge },
  youtube: { label: "YouTube", Icon: YoutubeBadge },
  facebook: { label: "Facebook", Icon: FacebookBadge },
  tiktok: { label: "TikTok", Icon: TiktokBadge },
  x: { label: "X", Icon: XBadge },
};

export async function Footer() {
  const t = await getTranslations("footer");
  const tCta = await getTranslations("cta");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const socials = verifiedSocialLinks();

  return (
    <footer className="footer bg-ink text-[rgba(250,248,241,.75)]">
      <div className="trust-rail shell">
        <span>{t("owned")}</span>
        <span>{t("based")}</span>
        <span>{t("licensed")}</span>
        <span>{t("support")}</span>
      </div>
      <div className="shell grid grid-cols-[2fr_repeat(3,1fr)] gap-16 py-[90px] pb-[78px] max-[1100px]:grid-cols-[1.5fr_repeat(2,1fr)] max-[720px]:grid-cols-2 max-[720px]:gap-x-6 max-[720px]:gap-y-[46px] max-[720px]:py-[68px] max-[720px]:pb-[58px]">
        <div className="max-[720px]:col-span-full">
          <BrandMark onDark label={tCommon("homeAria")} />
          <p className="my-7 max-w-[360px] font-serif text-[22px] leading-[1.4]">{t("tagline")}</p>
          <Link className="text-link text-link--light" href="/plan">{tCta("planWithTevan")} <ArrowUpRight /></Link>
          {socials.length > 0 && (
            <div className="mt-[30px] flex gap-3.5" aria-label={tCommon("followUs")}>
              {socials.map(({ network, href }) => {
                const { label, Icon } = socialBadges[network];
                return (
                  <a
                    key={network}
                    className="inline-flex size-10 rounded-full transition-transform hover:-translate-y-[3px] hover:brightness-110"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={tCommon("followOn", { network: label })}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-3.5 text-xs [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a]:transition-colors hover:[&_a]:text-white max-[720px]:text-sm">
          <h3 className="mb-3 font-sans text-[10px] font-semibold tracking-[0.15em] text-white uppercase max-[720px]:text-[11px]">{t("discover")}</h3>
          <Link href="/simien-mountains">{t("theSimien")}</Link>
          <Link href="/treks">{tNav("journeys")}</Link>
          <Link href="/gondar">{tNav("gondar")}</Link>
          <Link href="/gallery">{tNav("gallery")}</Link>
          <Link href="/plan">{tCta("planAJourney")}</Link>
        </div>
        <div className="flex flex-col items-start gap-3.5 text-xs [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a]:transition-colors hover:[&_a]:text-white max-[720px]:text-sm">
          <h3 className="mb-3 font-sans text-[10px] font-semibold tracking-[0.15em] text-white uppercase max-[720px]:text-[11px]">{t("company")}</h3>
          <Link href="/about">{t("meetTevan")}</Link>
          <Link href="/about#local">{t("tevanLocal")}</Link>
          <a href={site.operatorSite} target="_blank" rel="noreferrer">{t("operatingCompany")} <ArrowUpRight size={12} /></a>
        </div>
        <div className="flex flex-col items-start gap-3.5 text-xs [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a]:transition-colors hover:[&_a]:text-white max-[1100px]:col-span-2 max-[1100px]:col-start-2 max-[720px]:col-span-full max-[720px]:text-sm">
          <h3 className="mb-3 font-sans text-[10px] font-semibold tracking-[0.15em] text-white uppercase max-[720px]:text-[11px]">{t("office")}</h3>
          <p className="mb-1 leading-[1.7]">{site.address}</p>
          <a className="inline-flex items-center gap-1.5" href={`tel:${site.phone}`}><Phone className="size-[13px]" />{site.phoneDisplay}</a>
          <a className="inline-flex items-center gap-1.5" href={`mailto:${site.email}`}><Mail className="size-[13px]" />{site.email}</a>
          <a className="inline-flex items-center gap-1.5" href={site.whatsapp} target="_blank" rel="noreferrer">{tCta("whatsappUs")} <ArrowUpRight size={14} /></a>
        </div>
      </div>
      <div className="shell flex items-center justify-between gap-10 py-[72px] text-left max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[26px] max-[720px]:gap-6 max-[720px]:pt-[60px] max-[720px]:pb-[54px]">
        <div>
          <h3 className="m-0 max-w-none font-serif text-[clamp(1.5rem,2.3vw,2.1rem)] font-normal leading-[1.22] tracking-[-0.01em] text-white max-[900px]:whitespace-normal whitespace-nowrap">{t("subscribeTitle")}</h3>
        </div>
        <NewsletterForm />
      </div>
      <div className="shell flex min-h-[72px] items-center justify-between border-t border-white/12 text-[9px] tracking-[0.05em] max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-5 max-[720px]:py-[22px] max-[720px]:text-[11px]">
        <p>{t("copyright", { year: new Date().getFullYear(), operator: site.legalOperator })}</p>
        <div className="flex gap-6"><Link href="/journal">{tNav("journal")}</Link><Link href="/privacy">{t("privacy")}</Link><Link href="/terms">{t("terms")}</Link></div>
      </div>
    </footer>
  );
}
