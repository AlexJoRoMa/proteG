import { ResumenContentProps } from "@/types/ResumenCompra";
import ResumenPaquetes from "./resumenPaquetes";
import { Accordion, AccordionItem } from "@heroui/react";
import { DropIcon } from "@/constants/IconsConstants";

export default function DetalleResumen({ copys, userSelection }: ResumenContentProps) {

    const itemClasses = {
        indicator: "data-[open=true]:rotate-180",
        title: "leading-[24px] font-bold text-lg xl:text-xl",
        base: "py-[32px] data-[open=true]:pt-[32px] data-[open=true]:pb-0",
        content: "p-0",
        trigger: "p-0"
    }

    return (
        <Accordion
            isCompact
            itemClasses={itemClasses}
            defaultSelectedKeys={"all"}
        >
            <AccordionItem
                key="1"
                aria-label="Accordion 1"
                title={copys.detalleSeleccion}
                indicator={<DropIcon />}
            >

                <ResumenPaquetes
                    copys={copys}
                    userSelection={userSelection}
                />
            </AccordionItem>
        </Accordion>
    )
}