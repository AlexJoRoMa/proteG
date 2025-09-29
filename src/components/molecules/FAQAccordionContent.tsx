
import { Accordion, AccordionItem } from "@heroui/react";
import { CardSegmentoSkeleton, FAQAccordionProps } from "@/types/FAQTypes";
import { EntrySkeletonType, Entry } from "contentful";
import { SAFETEXT } from '@/constants/FAQConstants';
import { DropIcon } from '@/components/atoms/FAQicons';

export default function FAQAccordion({ cards }: FAQAccordionProps) {

  const itemClasses = {
        indicator: "data-[open=true]:-rotate-180"
    }

  return (
    <>
      {cards.map((card) => {
        const cardData = card.fields;
        return (
          <div key={card.sys.id}>
            <Accordion itemClasses={itemClasses} variant="light" className="border-b border-gray-150">
              <AccordionItem
                key={card.sys.id}
                aria-label={"Pregunta"}
                title={
                  <span className="md:text-[20px] xsm:text-[16px] font-bold">
                    {SAFETEXT(cardData.pregunta, "Pregunta")}
                  </span>
                }
                indicator={<DropIcon />}
              >
                <p className="md:text-[18px] xsm:text-[14px] font-[400]">
                  {SAFETEXT(cardData.respuesta)}
                </p>
              </AccordionItem>
            </Accordion>
          </div>
        );
      })}
    </>
  );
}
