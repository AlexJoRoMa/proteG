'use client'

import { BenefitsContentProps, CardDataFields } from "@/types/BenefitsTypes";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { Entry, EntrySkeletonType } from "contentful";
import Image from "next/image";
import ButtonGhost from "../atoms/ButtonGhost";
import ButtonModal from "../atoms/ButtonModal";

export default function BenefitsCardContent({ cards }: BenefitsContentProps) {

    const cardInfo = cards as unknown as EntrySkeletonType<CardDataFields>[];
    

    return (
        <div className="overflow-x-auto lg:overflow-visible w-full">
            <div className="flex lg:grid lg:grid-cols-3 gap-[24px] mx-[16px] h-fit md:mx-md 2xl:mx-xl min-w-max lg:min-w-0
            ">
                {cardInfo.map((card) => {

                    const cardId = card as unknown as Entry<EntrySkeletonType<CardDataFields>>;

                    let cssClasses = "";
                    switch (card.fields.type) {
                        case "Internet":
                            cssClasses = "#FF6C07"
                            break;
                        case "Tv":
                            cssClasses = "#00C1B5"
                            break;
                        case "Movil":
                            cssClasses = "#D60270"
                            break;
                        case "Canales":
                            cssClasses = "#3F3F45"
                            break;
                    }

                    return (
                        <div key={cardId.sys.id} className="shrink-0 lg:shrink">
                            <Card
                                className="flex flex-col w-[280px] lg:w-full h-full rounded-sm border-1"
                                style={{borderColor: cssClasses}}
                            >
                                <CardHeader
                                    className="px-[24px] pt-[32px]">
                                    <div className="flex justify-center w-full pb-[24px] border-b-1"
                                        style={{borderBottomColor: cssClasses}}
                                    >
                                        <Image
                                            src={`https:${card.fields.image.fields.image.fields.file.url}`}
                                            alt={card.fields.image.fields.altText || 'icon'}
                                            loading="eager"
                                            width={72}
                                            height={72}
                                            className="w-[72px] h-[72px]"
                                        />
                                    </div>
                                </CardHeader>
                                <CardBody className={`px-[24px] flex-1 flex flex-col justify-between ${!card.fields.ctaText ? 'pb-[32px]' : ''}`}>
                                    <div className="flex flex-col gap-[24px] items-center">
                                        <h2 className="font-bold text-[32px] text-center text-black-0">{card.fields.title}</h2>
                                        <p className="font-normal text-lg leading-[24px] text-center text-black-0 ">{card.fields.description}</p>
                                    </div>
                                </CardBody>
                                {card.fields.ctaText &&
                                    <CardFooter className="px-[24px] pb-[32px]">
                                        {
                                            card.fields.isModal ? (
                                                <ButtonModal
                                                    textBtn={card.fields.ctaText}
                                                    classStyles={`py-[14px] px-[16px] rounded-md w-full h-auto border-1 border-black-0  font-semibold leading-[24px] text-lg
                                                        ${!card.fields.colorBtn === true ? 'bg-black text-white' : 'bg-transparent text-black-0'}`}
                                                    idModal={typeof card.fields?.modal === 'object' && card.fields?.modal !== null && 'sys' in card.fields.modal ? card.fields.modal.sys.id : ''}
                                                    modalContentClassName="h-full xl:h-[70vh]  benefits-modal"
                                                    closeButtonStroke="black"
                                                />
                                            ) : (
                                                <ButtonGhost
                                                    text={card.fields.ctaText}
                                                    href={card.fields.ctaLink}
                                                    classStyles={`py-[14px] px-[16px] rounded-md w-full h-auto border-1 border-black-0 font-semibold leading-[24px] text-lg
                                                        ${!card.fields.colorBtn === true ? 'bg-black text-white' : 'bg-transparent text-black-0'}`}
                                                />
                                            )
                                        }
                                    </CardFooter>
                                }
                            </Card>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}