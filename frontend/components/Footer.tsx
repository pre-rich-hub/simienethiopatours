import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "@/components/Icon";
import { BrandMark } from "./BrandMark";
import { NewsletterForm } from "./NewsletterForm";
import { FacebookBadge, InstagramBadge, TiktokBadge, XBadge, YoutubeBadge } from "./SocialBadges";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer bg-ink text-[rgba(250,248,241,.75)]">
      <div className="trust-rail shell">
        <span>100% locally owned</span>
        <span>Based in Gondar</span>
        <span>Licensed operator</span>
        <span>Direct local support</span>
      </div>
      <div className="shell grid grid-cols-[2fr_repeat(3,1fr)] gap-16 py-[90px] pb-[78px] max-[1100px]:grid-cols-[1.5fr_repeat(2,1fr)] max-[720px]:grid-cols-2 max-[720px]:gap-x-6 max-[720px]:gap-y-[46px] max-[720px]:py-[68px] max-[720px]:pb-[58px]">
        <div className="max-[720px]:col-span-full">
          <BrandMark onDark />
          <p className="my-7 max-w-[360px] font-serif text-[22px] leading-[1.4]">Locally planned journeys from Gondar into the wild highlands of the Simien Mountains.</p>
          <Link className="text-link text-link--light" href="/plan">Plan with Tevan <ArrowUpRight /></Link>
          <div className="mt-[30px] flex gap-3.5" aria-label="Follow us on social media">
            <a className="inline-flex size-10 rounded-full transition-transform hover:-translate-y-[3px] hover:brightness-110" href={site.social.instagram} target="_blank" rel="noreferrer" aria-label="Follow on Instagram"><InstagramBadge /></a>
            <a className="inline-flex size-10 rounded-full transition-transform hover:-translate-y-[3px] hover:brightness-110" href={site.social.youtube} target="_blank" rel="noreferrer" aria-label="Follow on YouTube"><YoutubeBadge /></a>
            <a className="inline-flex size-10 rounded-full transition-transform hover:-translate-y-[3px] hover:brightness-110" href={site.social.facebook} target="_blank" rel="noreferrer" aria-label="Follow on Facebook"><FacebookBadge /></a>
            <a className="inline-flex size-10 rounded-full transition-transform hover:-translate-y-[3px] hover:brightness-110" href={site.social.tiktok} target="_blank" rel="noreferrer" aria-label="Follow on TikTok"><TiktokBadge /></a>
            <a className="inline-flex size-10 rounded-full transition-transform hover:-translate-y-[3px] hover:brightness-110" href={site.social.x} target="_blank" rel="noreferrer" aria-label="Follow on X"><XBadge /></a>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3.5 text-xs [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a]:transition-colors hover:[&_a]:text-white max-[720px]:text-sm">
          <h3 className="mb-3 font-sans text-[10px] font-semibold tracking-[0.15em] text-white uppercase max-[720px]:text-[11px]">Discover</h3>
          <Link href="/simien-mountains">The Simien</Link>
          <Link href="/treks">Journeys</Link>
          <Link href="/ras-dashen">Ras Dashen</Link>
          <Link href="/gondar">Gondar</Link>
          <Link href="/beyond-the-trail">Beyond the trail</Link>
          <Link href="/festival-journeys">Festival journeys</Link>
          <Link href="/where-to-stay-gondar-simien">Where to stay</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/travel-guide">Field notes</Link>
        </div>
        <div className="flex flex-col items-start gap-3.5 text-xs [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a]:transition-colors hover:[&_a]:text-white max-[720px]:text-sm">
          <h3 className="mb-3 font-sans text-[10px] font-semibold tracking-[0.15em] text-white uppercase max-[720px]:text-[11px]">Company</h3>
          <Link href="/about">Meet Tevan</Link>
          <Link href="/reviews">Traveler reviews</Link>
          <Link href="/about#local">Tevan Local</Link>
          <Link href="/whats-included">What's included</Link>
          <Link href="/photo-credits">Photo credits</Link>
          <a href={site.operatorSite} target="_blank" rel="noreferrer">Operating company <ArrowUpRight size={12} /></a>
        </div>
        <div className="flex flex-col items-start gap-3.5 text-xs [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a]:transition-colors hover:[&_a]:text-white max-[1100px]:col-span-2 max-[1100px]:col-start-2 max-[720px]:col-span-full max-[720px]:text-sm">
          <h3 className="mb-3 font-sans text-[10px] font-semibold tracking-[0.15em] text-white uppercase max-[720px]:text-[11px]">Gondar office</h3>
          <p className="mb-1 leading-[1.7]">{site.address}</p>
          <a className="inline-flex items-center gap-1.5" href={`tel:${site.phone}`}><Phone className="size-[13px]" />{site.phoneDisplay}</a>
          <a className="inline-flex items-center gap-1.5" href={`mailto:${site.email}`}><Mail className="size-[13px]" />{site.email}</a>
          <a className="inline-flex items-center gap-1.5" href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp us <ArrowUpRight size={14} /></a>
        </div>
      </div>
      <div className="shell flex items-center justify-between gap-10 py-[72px] text-left max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[26px] max-[720px]:gap-6 max-[720px]:pt-[60px] max-[720px]:pb-[54px]">
        <div>
          <h3 className="m-0 max-w-none font-serif text-[clamp(1.5rem,2.3vw,2.1rem)] font-normal leading-[1.22] tracking-[-0.01em] text-white max-[900px]:whitespace-normal whitespace-nowrap">Subscribe to our newsletter for curated travel stories</h3>
        </div>
        <NewsletterForm />
      </div>
      <div className="shell flex min-h-[72px] items-center justify-between border-t border-white/12 text-[9px] tracking-[0.05em] max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-5 max-[720px]:py-[22px] max-[720px]:text-[11px]">
        <p>© {new Date().getFullYear()} Gondar Simien Tours. Operated by {site.legalOperator}.</p>
        <div className="flex gap-6"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div>
    </footer>
  );
}
