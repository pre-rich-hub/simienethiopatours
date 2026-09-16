import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Mail, Phone } from "@/components/Icon";
import Image from "@/components/Image";
import { BrandMark } from "./BrandMark";
import { NewsletterForm } from "./NewsletterForm";
import { FacebookBadge, InstagramBadge, TiktokBadge, XBadge, YoutubeBadge } from "./SocialBadges";
import { site, verifiedSocialLinks, type SocialNetwork } from "@/lib/site";

const trustedPlatforms = [
  { name: "Viator", src: "/images/partners/viator.png", width: 340, height: 145 },
  { name: "Tripadvisor", src: "/images/partners/tripadvisor.png", width: 428, height: 397 },
  { name: "SafariBookings", src: "/images/partners/safaribookings.png", width: 440, height: 170 },
  { name: "GetYourGuide", src: "/images/partners/getyourguide.png", width: 170, height: 152 },
];

const paymentMethods = [
  { name: "Visa", src: "/images/payments/visa.png", width: 614, height: 242 },
  { name: "Mastercard", src: "/images/payments/mastercard.png", width: 270, height: 190 },
  { name: "PayPal", src: "/images/payments/paypal.png", width: 270, height: 190 },
];

const socialBadges: Record<SocialNetwork, { label: string; Icon: typeof InstagramBadge }> = {
  instagram: { label: "Instagram", Icon: InstagramBadge },
  youtube: { label: "YouTube", Icon: YoutubeBadge },
  facebook: { label: "Facebook", Icon: FacebookBadge },
  tiktok: { label: "TikTok", Icon: TiktokBadge },
  x: { label: "X", Icon: XBadge },
};

// Display order for the footer's social row. Networks without a verified URL
// in site.social still render (href falls back to "#") as a visual
// placeholder until a real profile link is confirmed.
const socialDisplayOrder: SocialNetwork[] = ["instagram", "youtube", "facebook", "tiktok", "x"];

export async function Footer() {
  const t = await getTranslations("footer");
  const tCta = await getTranslations("cta");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const verified = new Map(verifiedSocialLinks().map(({ network, href }) => [network, href]));
  const socials = socialDisplayOrder.map((network) => ({ network, href: verified.get(network) ?? "#" }));

  return (
    <footer className="footer bg-ink text-[rgba(250,248,241,.75)]">
      <div className="shell grid grid-cols-[2fr_repeat(3,1fr)] gap-16 pt-[90px] pb-2 max-[1100px]:grid-cols-[1.5fr_repeat(2,1fr)] max-[720px]:grid-cols-2 max-[720px]:gap-x-6 max-[720px]:gap-y-[46px] max-[720px]:pt-[68px] max-[720px]:pb-2">
        <div className="max-[720px]:col-span-full">
          <BrandMark onDark label={tCommon("homeAria")} />
          <p className="my-7 max-w-[360px] font-serif text-[22px] leading-[1.4]">{t("tagline")}</p>
          <Link className="text-link text-link--light" href="/plan">{tCta("planWithTevan")} <ArrowUpRight /></Link>
          {socials.length > 0 && (
            <div className="mt-[30px] flex gap-3.5" role="group" aria-label={tCommon("followUs")}>
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
        <div className="flex flex-col items-start gap-5 text-[18px] leading-[1.4] [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a]:transition-colors hover:[&_a]:text-white">
          <h3 className="mb-4 font-sans text-[18px] font-semibold tracking-[0.15em] text-white uppercase">{t("discover")}</h3>
          <Link href="/simien-mountains">{t("theSimien")}</Link>
          <Link href="/treks">{tNav("journeys")}</Link>
          <Link href="/gondar">{tNav("gondar")}</Link>
          <Link href="/gallery">{tNav("gallery")}</Link>
          <Link href="/plan">{tCta("planAJourney")}</Link>
        </div>
        <div className="flex flex-col items-start gap-5 text-[18px] leading-[1.4] [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a]:transition-colors hover:[&_a]:text-white">
          <h3 className="mb-4 font-sans text-[18px] font-semibold tracking-[0.15em] text-white uppercase">{t("company")}</h3>
          <Link href="/about">{t("meetTevan")}</Link>
          <Link href="/about#local">{t("tevanLocal")}</Link>
          <a href={site.operatorSite} target="_blank" rel="noreferrer">{t("operatingCompany")} <ArrowUpRight size={16} /></a>
        </div>
        <div className="flex flex-col items-start gap-5 text-[18px] leading-[1.4] [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a]:transition-colors hover:[&_a]:text-white max-[1100px]:col-span-2 max-[1100px]:col-start-2 max-[720px]:col-span-full">
          <h3 className="mb-4 font-sans text-[18px] font-semibold tracking-[0.15em] text-white uppercase">{t("office")}</h3>
          <p className="mb-1 leading-[1.4]">{site.address}</p>
          <a className="inline-flex items-center gap-1.5" href={`tel:${site.phone}`}><Phone className="size-[18px]" />{site.phoneDisplay}</a>
          <a className="inline-flex items-center gap-1.5" href={`mailto:${site.email}`}><Mail className="size-[18px]" />{site.email}</a>
          <a className="inline-flex items-center gap-1.5" href={site.whatsapp} target="_blank" rel="noreferrer">{tCta("whatsappUs")} <ArrowUpRight size={18} /></a>
        </div>
      </div>
      <div className="shell">
        <div className="flex flex-wrap items-center gap-x-16 gap-y-3 pt-0 pb-5 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-y-4 max-[720px]:pt-0 max-[720px]:pb-5">
          <div className="w-fit shrink-0 max-[720px]:w-full">
            <h3 className="m-0 font-sans text-[15px] font-semibold tracking-[0.02em] text-white">{t("trustedTitle")}</h3>
            <p className="m-0 mt-1.5 text-[14px] leading-[1.5] whitespace-nowrap text-[rgba(250,248,241,.6)] max-[720px]:whitespace-normal">{t("trustedSubtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {trustedPlatforms.map((platform) => (
              <span
                key={platform.name}
                className="flex h-[52px] w-[110px] items-center justify-center rounded-xl bg-[#faf8f1] px-4 py-2.5 shadow-[0_6px_18px_rgba(0,0,0,.18)] transition-transform duration-300 hover:-translate-y-[3px]"
              >
                <Image
                  src={platform.src}
                  alt={platform.name}
                  width={platform.width}
                  height={platform.height}
                  className="h-full w-full object-contain"
                />
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-16 gap-y-3 py-5 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-y-4 max-[720px]:py-5">
          <div className="w-fit shrink-0 max-[720px]:w-full">
            <h3 className="m-0 font-sans text-[15px] font-semibold tracking-[0.02em] text-white">{t("acceptTitle")}</h3>
            <p className="m-0 mt-1.5 text-[14px] leading-[1.5] whitespace-nowrap text-[rgba(250,248,241,.6)] max-[720px]:whitespace-normal">{t("acceptSubtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {paymentMethods.map((method) => (
              <span
                key={method.name}
                className="flex h-[52px] w-[110px] items-center justify-center rounded-xl bg-[#faf8f1] px-4 py-2.5 shadow-[0_6px_18px_rgba(0,0,0,.18)] transition-transform duration-300 hover:-translate-y-[3px]"
              >
                <Image
                  src={method.src}
                  alt={method.name}
                  width={method.width}
                  height={method.height}
                  className="h-full w-full object-contain"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="shell flex items-center justify-between gap-10 py-[72px] text-left max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[26px] max-[720px]:gap-6 max-[720px]:pt-[60px] max-[720px]:pb-[54px]">
        <div>
          <h3 className="m-0 max-w-none font-serif text-[clamp(1.5rem,2.3vw,2.1rem)] font-normal leading-[1.22] tracking-[-0.01em] text-white max-[900px]:whitespace-normal whitespace-nowrap">{t("subscribeTitle")}</h3>
        </div>
        <NewsletterForm />
      </div>
      <div className="shell grid min-h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-white/12 text-[9px] tracking-[0.05em] max-[720px]:grid-cols-1 max-[720px]:justify-items-start max-[720px]:gap-3 max-[720px]:py-[22px] max-[720px]:text-[11px]">
        <p>{t("copyright", { year: new Date().getFullYear(), operator: site.legalOperator })}</p>
        <a className="justify-self-center text-[13px] font-bold text-copper! transition-colors hover:text-white!" href="https://melba.et" target="_blank" rel="noreferrer">Built by Melba Technology</a>
        <div className="flex justify-self-end gap-6"><Link href="/journal">{tNav("journal")}</Link><Link href="/privacy">{t("privacy")}</Link><Link href="/terms">{t("terms")}</Link></div>
      </div>
    </footer>
  );
}
