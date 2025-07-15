import { Accordion, AccordionItem } from "@heroui/react";

const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const DropIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 9L12 15L5 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
export default function AccordionPlanesExtras() {

    const itemClasses = {
        indicator: "data-[open=true]:rotate-180",
        title: "leading-[24px] font-normal text-base",
    }

    return (
        <Accordion
            showDivider={false}
            isCompact
            itemClasses={itemClasses}
            defaultSelectedKeys={"all"}
        >
            <AccordionItem
                key="1"
                aria-label="Accordion 1"
                title="Añade más diversión"
                indicator={<DropIcon />}
            >
                {defaultContent}
            </AccordionItem>
            <AccordionItem
                key="2"
                aria-label="Accordion 2"
                title="Incluye canales a la carta"
                indicator={<DropIcon />}
            >
                {defaultContent}
            </AccordionItem>
        </Accordion>
        //TODO: **agregar tarjetas de canales a los selectores */ 

    )
}