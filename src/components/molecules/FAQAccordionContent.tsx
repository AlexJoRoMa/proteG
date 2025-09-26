
import { Accordion, AccordionItem } from "@heroui/react";
import { CardSegmentoSkeleton } from "@/types/FAQTypes";
import { EntrySkeletonType, Entry } from "contentful";
import { Icon } from "@iconify/react";

const safeText = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

type FAQAccordionProps = {
  cards: Entry<CardSegmentoSkeleton>[];

};

export default function FAQAccordion({ cards }: FAQAccordionProps) {


  return (
    <>
      {cards.map((card) => {
        const cardData = card.fields;
        return (
          <div key={card.sys.id}>
            <Accordion variant="light" className="border-b border-gray-150">
              <AccordionItem
                key={card.sys.id}
                aria-label={"Pregunta"}
                title={
                  <span className="md:text-[20px] xsm:text-[16px] font-bold">
                    {safeText(cardData.pregunta, "Pregunta")}
                  </span>
                }
                indicator={({ isOpen }) => (
                  <Icon
                    icon={isOpen ? "gravity-ui:chevron-right" : "gravity-ui:chevron-down"}
                    className="text-gray-500"
                  />
                )}

              >
                <p className="md:text-[18px] xsm:text-[14px] font-[400]">
                  {safeText(cardData.respuesta)}
                </p>
              </AccordionItem>
            </Accordion>
          </div>
        );
      })}
    </>
  );
}
