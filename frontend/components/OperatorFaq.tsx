import { getTranslations } from "next-intl/server";
import { Faq, SectionIntro } from "@/components/Editorial";
import { getOperatorFaqItems } from "@/lib/operator-faq";

export async function OperatorFaq({ paper = false }: { paper?: boolean }) {
  const t = await getTranslations("operatorFaq");
  const items = await getOperatorFaqItems();
  return (
    <section className={`section ${paper ? "section--paper" : ""}`} id="operator-faq">
      <div className="shell editorial-grid">
        <SectionIntro tag={t("tag")} title={t("title")} accent={t("accent")} />
        <Faq items={items} id="operator-faq-list" />
      </div>
    </section>
  );
}
