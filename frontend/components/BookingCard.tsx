import Link from "next/link";
import { ArrowUpRight } from "@/components/Icon";
import { site } from "@/lib/site";
import type { JourneyDetail } from "@/lib/itineraries";

function fact(journey: JourneyDetail, label: string) {
  return journey.facts.find((item) => item.label === label)?.value;
}

export function BookingCard({ journey }: { journey: JourneyDetail }) {
  const rows = [
    { label: "Duration", value: fact(journey, "Duration") || journey.duration },
    { label: "Group size", value: fact(journey, "Travel style") || "Private or small group" },
    { label: "Difficulty", value: fact(journey, "Walking") || "Adapted to your ability" },
    { label: "Start & finish", value: fact(journey, "Start & finish") || "Gondar" },
  ];

  return (
    <div className="booking-card">
      <div className="booking-card__header">
        <p className="booking-card__eyebrow">Pricing</p>
        <h3>Custom quote</h3>
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
          Book this tour <ArrowUpRight size={16} />
        </Link>
        <a className="booking-card__ask" href={site.whatsapp} target="_blank" rel="noreferrer">
          Ask a question
        </a>
      </div>
    </div>
  );
}
