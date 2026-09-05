import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "@/components/Icon";
import { BrandMark } from "./BrandMark";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="trust-rail shell">
        <span>100% locally owned</span>
        <span>Based in Gondar</span>
        <span>Licensed operator</span>
        <span>Direct local support</span>
      </div>
      <div className="footer__main shell">
        <div className="footer__intro">
          <BrandMark inverse />
          <p>Locally planned journeys from Gondar into the wild highlands of the Simien Mountains.</p>
          <Link className="text-link text-link--light" href="/plan">Plan with Tevan <ArrowUpRight /></Link>
        </div>
        <div className="footer__column">
          <h3>Discover</h3>
          <Link href="/simien-mountains">The Simien</Link>
          <Link href="/treks">Journeys</Link>
          <Link href="/gondar">Gondar</Link>
          <Link href="/beyond-the-trail">Beyond the trail</Link>
          <Link href="/festival-journeys">Festival journeys</Link>
          <Link href="/where-to-stay-gondar-simien">Where to stay</Link>
          <Link href="/travel-guide">Field notes</Link>
        </div>
        <div className="footer__column">
          <h3>Company</h3>
          <Link href="/about">Meet Tevan</Link>
          <Link href="/about#local">Tevan Local</Link>
          <Link href="/photo-credits">Photo credits</Link>
          <a href={site.operatorSite} target="_blank" rel="noreferrer">Operating company <ArrowUpRight size={12} /></a>
        </div>
        <div className="footer__column footer__contact">
          <h3>Gondar office</h3>
          <p>{site.address}</p>
          <a href={`tel:${site.phone}`}><Phone />{site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`}><Mail />{site.email}</a>
          <a href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp us <ArrowUpRight size={14} /></a>
        </div>
      </div>
      <div className="footer__bottom shell">
        <p>© {new Date().getFullYear()} Gondar Simien Tours. Operated by {site.legalOperator}.</p>
        <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div>
    </footer>
  );
}
