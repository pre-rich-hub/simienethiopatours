import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";

export type OperatorFaqItem = { q: string; a: string };

/** Visible operator Q&A grounded in NAP + inquiry-only booking model. */
export async function getOperatorFaqItems(): Promise<OperatorFaqItem[]> {
  const t = await getTranslations("operatorFaq");
  return [
    {
      q: t("whoQ"),
      a: t("whoA", { name: site.name, operator: site.legalOperator }),
    },
    {
      q: t("whereQ"),
      a: t("whereA", { address: site.address }),
    },
    {
      q: t("bookingQ"),
      a: t("bookingA"),
    },
  ];
}

export function operatorFaqForJsonLd(items: OperatorFaqItem[]) {
  return items.map((item) => ({ question: item.q, answer: item.a }));
}
