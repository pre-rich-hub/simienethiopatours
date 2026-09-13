import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";
import { localeFromParam, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale: localeFromParam(locale),
    title: "Privacy",
    description: "How Simien Ethio Tours handles inquiries, newsletter subscriptions, AI assistant conversations, cookies, and privacy requests.",
    path: "/privacy",
    index: false,
  });
}

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <div className="shell">
          <div className="breadcrumbs">
            <Link href="/">Home</Link><span>/</span><span>Privacy</span>
          </div>
          <h1 className="display">Privacy.</h1>
        </div>
      </section>
      <section className="section">
        <article className="legal-copy shell">
          <p>
            This notice explains how {site.legalOperator}, trading online as {site.name},
            handles personal information provided through this website.
          </p>

          <h2>Who is responsible</h2>
          <p>
            The data controller is {site.legalOperator}, {site.address}. Privacy
            questions and requests can be sent to <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>

          <h2>Journey-planning inquiries</h2>
          <p>
            The planner collects your name, email address, message, and any optional
            travel dates, group size, interests, trip duration, accommodation preferences,
            night counts, or budget guidance you provide. We use this information to
            answer your request and prepare a possible journey proposal.
          </p>
          <p>
            Delivery is attempted in this order: first, the inquiry is sent to our
            backend and stored in the contact database. The backend may also send a
            notification through our configured email service. If the contact service
            fails, the website may send the inquiry to a configured secure webhook. If
            neither service accepts it, the site asks your browser to open a prepared
            message in your own email application. In that last case, your email provider—not
            this website—sends and stores the message.
          </p>

          <h2>Newsletter subscriptions</h2>
          <p>
            If you subscribe, we store the email address you submit and the subscription
            date so the operator can manage requested updates. A duplicate submission does
            not create another record. The address remains stored until you withdraw or ask
            us to delete it. Until self-service unsubscribe is available, email
            <a href={`mailto:${site.email}`}> {site.email}</a> from the subscribed address.
          </p>

          <h2>AI travel assistant</h2>
          <p>
            When the assistant is enabled, we store the messages you send, its replies,
            a random conversation identifier, message and token counts, and a one-way
            HMAC hash of your IP address. The hash helps enforce usage limits without
            storing the raw IP address in the chat session. Your browser keeps the
            conversation identifier only in the current page session; it is not placed
            in local storage or a cookie.
          </p>
          <p>
            To produce a reply, recent conversation messages and relevant public catalogue
            content are sent to the configured AI provider, currently supported through
            Google Gemini or OpenAI. Do not enter passport, payment, medical, or other
            sensitive information in the assistant. The assistant provides general travel
            information and does not confirm bookings or make decisions about you.
          </p>

          <h2>Necessary cookies and technical records</h2>
          <p>
            The site uses a <code>NEXT_LOCALE</code> session cookie to keep the selected
            language. The private admin area uses an <code>admin_session</code> cookie for
            authentication. It is HTTP-only, SameSite=Lax, secure in production, and
            cleared on logout; the signed session has a configured validity period of
            seven days by default. These cookies are necessary for language or security
            functions and are not advertising cookies.
          </p>
          <p>
            Hosting and security systems may record IP address, browser information,
            timestamps, requested pages, and error or request logs to operate, protect,
            and diagnose the service. This application does not install advertising
            trackers or analytics cookies.
          </p>

          <h2>Service providers and transfers</h2>
          <p>
            Information may be processed by vendors used for website hosting, database
            hosting, email delivery (SMTP or Resend), a configured contact webhook, and
            the enabled AI provider. Their processing locations and retention may differ
            by the production services selected. We require the production configuration
            and provider terms to be reviewed before launch.
          </p>

          <h2>How long information is kept</h2>
          <ul>
            <li>Stored planner inquiries are eligible for automatic deletion after 730 days.</li>
            <li>Assistant sessions, their messages, and associated hashed IP are eligible for automatic deletion 30 days after the conversation was last active.</li>
            <li>Newsletter addresses remain until withdrawal or deletion.</li>
            <li>Aggregate daily assistant usage totals contain no transcript, session identifier, or IP hash and may be retained for service monitoring.</li>
            <li>Hosting, email, and webhook copies follow the configured provider’s reviewed retention settings.</li>
          </ul>
          <p>
            Information may be retained longer where reasonably required to establish,
            exercise, or defend legal claims or meet an applicable legal obligation.
          </p>

          <h2>Your choices and requests</h2>
          <p>
            You may ask whether we hold information about you and request access,
            correction, deletion, or withdrawal from the newsletter by emailing
            <a href={`mailto:${site.email}`}> {site.email}</a>. We may ask for enough
            information to verify that the request relates to you. Applicable law may
            permit or require us to retain some information. You may also use the same
            address to raise a concern about how your information is handled.
          </p>
          <p>
            Please do not include passport numbers, payment-card details, medical records,
            or other sensitive information in an initial planner inquiry, newsletter form,
            or assistant conversation.
          </p>

          <p><strong>Effective and last updated:</strong> 12 September 2026.</p>
        </article>
      </section>
    </PageShell>
  );
}
