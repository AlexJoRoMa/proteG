'use client'

import { BenefitsContentProps, CardDataFields } from "@/types/BenefitsTypes";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Entry, EntrySkeletonType } from "contentful";
import Image from "next/image";
import ButtonGhost from "../atoms/ButtonGhost";

export default function BenefitsCardContent({ cards }: BenefitsContentProps) {

    const cardInfo = cards as unknown as EntrySkeletonType<CardDataFields>[];

    return (
        <div className="overflow-x-auto lg:overflow-visible w-full">
            <div className="flex lg:grid lg:grid-cols-3 gap-[24px] mx-[16px] h-fit md:mx-md 3xl:mx-xl min-w-max lg:min-w-0">
                {cardInfo.map((card) => {

                    const cardId = card as unknown as Entry<EntrySkeletonType<CardDataFields>>;

                    let cssClasses = "";
                    switch (card.fields.type) {
                        case "Internet":
                            cssClasses = "orange-400"
                            break;
                        case "Tv":
                            cssClasses = "cyan-400"
                            break;
                        case "Movil":
                            cssClasses = "magenta-400"
                            break;
                    }

                    return (
                        <div key={cardId.sys.id} className="shrink-0 lg:shrink">
                            <Card 
                                className={`flex flex-col w-[280px] lg:w-full h-full rounded-sm border-1 border-${cssClasses}`}>
                                <CardHeader 
                                    className="px-[24px] pt-[32px]">
                                    <div className={`flex justify-center w-full pb-[24px] border-b-1 border-b-${cssClasses}`}>
                                        <Image
                                            src={`https:${card.fields.image.fields.image.fields.file.url}`}
                                            alt={card.fields.image.fields.altText}
                                            loading="eager"
                                            width={72}
                                            height={72}
                                            className="w-[72px] h-[72px]"
                                        />
                                    </div>
                                </CardHeader>
                                <CardBody className="px-[24px] pb-[32px] flex-1 flex flex-col justify-between">
                                    <div className="flex flex-col gap-[24px] items-center">
                                        <h2 className="font-bold text-[32px] text-center line-clamp-2 min-h-[96px] xl:min-h-[48px]">{card.fields.title}</h2>
                                        <p className="font-normal text-lg leading-[24px] text-center line-clamp-9 min-h-[120px]">{card.fields.description}</p>
                                        {card.fields.ctaText &&
                                            <ButtonGhost
                                                text={card.fields.ctaText}
                                                classStyles="py-[14px] px-[16px] rounded-md w-full h-auto border-1 border-black-0 text-black-0 font-bold leading-[24px] text-lg"
                                            />
                                        }
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}