import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { site } from "@/lib/site";
import type { JourneyDetail } from "@/lib/itineraries";

function fact(journey: JourneyDetail, label: string) {
  return journey.facts.find((item) => item.label === label)?.value;
}

export async function BookingCard({ journey }: { journey: JourneyDetail }) {
  const t = await getTranslations("booking");
  const rows = [
    { label: t("duration"), value: fact(journey, "Duration") || journey.duration },
    { label: t("groupSize"), value: fact(journey, "Travel style") || "Private or small group" },
    { label: t("difficulty"), value: fact(journey, "Walking") || "Adapted to your ability" },
    { label: t("startFinish"), value: fact(journey, "Start & finish") || "Gondar" },
  ];

  return (
    <div className="booking-card">
      <div className="booking-card__header">
        <p className="booking-card__eyebrow">{t("eyebrow")}</p>
        <h3>{t("title")}</h3>
      </div>
      <dl className="booking-card__facts">
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="booking-card__actions booking-card__actions--last">
        <Link className="booking-card__book" href={`/plan?journey=${journey.inquiry}`}>
          {t("book")} <ArrowUpRight size={16} />
        </Link>
        <a className="booking-card__ask" href={site.whatsapp} target="_blank" rel="noreferrer">
          {t("ask")}
        </a>
      </div>
    </div>
  );
}
