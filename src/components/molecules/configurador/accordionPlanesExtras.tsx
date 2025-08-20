import { OttProps, OttsImages } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { Accordion, AccordionItem, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { EntrySkeletonType } from "contentful";
import Image from "next/image";
import { useState } from "react";

const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const DropIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 9L12 15L5 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export const CheckIcon = (props: any) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="4px"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            width="4px"
            {...props}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
};


const DUMMY_OTTS = [
    {
        id: "Netflix",
        title: "Estándar con anuncios",
        description: "1 pantalla HD",
        price: 119,
        term: "al mes",
        promo: true
    },
    {
        id: "Netflix",
        title: "Estándar",
        description: "2 pantalla FHD",
        price: 249,
        term: "al mes",
        promo: false
    },
    {
        id: "Netflix",
        title: "Premium",
        description: "4 pantalla 4K + HDR",
        price: 329,
        term: "al mes",
        promo: false
    },
    {
        id: "Disney",
        title: "Estándar",
        description: "Video HD",
        price: 249,
        term: "al mes",
        promo: false
    },
    {
        id: "Disney",
        title: "Disney + Premium Video",
        description: "UHD HDR",
        price: 319,
        term: "al mes",
        promo: false
    },
];

export default function AccordionPlanesExtras() {

    const itemClasses = {
        indicator: "data-[open=true]:rotate-180",
        title: "leading-[24px] font-normal text-base",
    }

    const content = useContent();
    const ottsImages = content.ottsImages as unknown as EntrySkeletonType<OttsImages>[];

    const [selectedCard, setSelectedCard] = useState<OttProps[]>([]);

    function handleSelect(card: OttProps) {

        setSelectedCard((prev) => {
            const cardSelected = prev.find(item => item.id === card.id);

            if (cardSelected?.title === card.title) {
                return prev.filter(item => !(item.id === card.id && item.title === card.title))
            }

            const newSelection = prev.filter(item => item.id !== card.id);
            return [...newSelection, card];
        });

        content.setUserAnswers(prev => {

            const prevOTT = prev.tv?.ott?.planes ?? [];
            const isAlreadySelected = prevOTT.findIndex(item => item?.id === card?.id);

            let updateOTT: typeof prevOTT;

            if (isAlreadySelected !== -1 && prevOTT[isAlreadySelected].title === card.title) {
                updateOTT = prevOTT.filter((_, i) => i !== isAlreadySelected);
            } else if (isAlreadySelected !== -1) {
                updateOTT = prevOTT.map((item, i) => i === isAlreadySelected ? card : item);
            } else {
                updateOTT = [...prevOTT, card];
            }

            const complementTotal = updateOTT.reduce((acc, item) => acc + Number(item.price), 0)

            return {
                ...prev,
                tv: {
                    ...prev.tv,
                    ott: {
                        planes: updateOTT,
                        total: complementTotal,
                    }
                },
            }
        }
        )
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] md:gap-[24px] auto-rows-fr">

                    {DUMMY_OTTS.map((ott, index) => {
                        const isSelected = selectedCard.some(item => item.id === ott.id && item.title === ott.title);

                        return (
                            <Card
                                key={index}
                                isPressable
                                onPress={() => handleSelect(ott)}
                                classNames={{
                                    base: "flex flex-row gap-[8px] rounded-md shadow-none h-full w-full bg-[#F5F6F8] py-[17px] px-[16px] items-center justify-between",
                                    header: "p-0 w-[96px] h-auto",
                                    body: "p-0 w-auto",
                                    footer: "p-0 w-auto"
                                }}
                            >
                                <CardHeader>
                                    {ottsImages.map((icon, index) => (
                                        <div key={index}>
                                            {
                                                icon.fields.type === ott.id &&
                                                <Image
                                                    src={`https:${icon.fields.ottImage.fields.image.fields.file.url}`}
                                                    alt={icon.fields.ottImage.fields.altText}
                                                    width={96}
                                                    height={46}
                                                />
                                            }
                                        </div>
                                    ))
                                    }
                                </CardHeader>
                                <CardBody>
                                    <div className="flex flex-col gap-[4px] text-xs md:text-sm leading-[16px] text-start justify-start">
                                        <h3 className="font-bold">{ott.title}</h3>
                                        <p className="font-normal">{ott.description}</p>
                                    </div>
                                </CardBody>
                                <CardFooter>
                                    <div className="flex flex-row gap-[8px] items-center justify-end">
                                        {ott.promo && <span
                                            className="
                                                absolute top-0 right-0
                                                w-5 h-5
                                                bg-(--color--turquoise-450)
                                                rounded-bl-[6px]
                                                flex items-center justify-center
                                                text-white text-sm
                                                shadow-md">
                                            %
                                        </span>
                                        }
                                        <div className="flex flex-col gap-[4px]">
                                            <h3 className="font-bold text-base leading-[24px]">{`+$${ott.price}`}</h3>
                                            <p className="font-normal text-sm leading-[16px]">{ott.term}</p>
                                        </div>
                                        <div
                                            className={`flex items-center justify-center w-[24px] h-[24px] rounded-md p-[1px] ${isSelected ? 'bg-conic-custom' : 'bg-gray-150'}`}
                                        >
                                            <span
                                                className={`w-full h-full rounded-md flex items-center justify-center transition-colors ${isSelected ? 'bg-black-0' : 'bg-white-0'}`}
                                                aria-pressed={isSelected}
                                            >
                                                {isSelected && <CheckIcon className="w-[16px] h-[16px] text-white-0" />}
                                            </span>
                                        </div>
                                    </div>

                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </AccordionItem>
        </Accordion>
    )
}