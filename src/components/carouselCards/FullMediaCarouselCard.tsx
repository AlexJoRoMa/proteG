import React from "react";
import { CardPropType } from "@/types/CarouselCardsTypes";
import Image from "next/image";
import ButtonGhost from "../atoms/ButtonGhost";

interface FullMediaProps {
    mediaSrc: string;
    imageAltText: string;
    shouldPrioritize: boolean;
    card: CardPropType["card"];
    isVideo: boolean;
    useCompactPadding?: boolean;
}

export default function FullMediaCarouselCard({mediaSrc, imageAltText, shouldPrioritize, card, isVideo, useCompactPadding = false}: FullMediaProps): React.ReactElement {
    const linkUrl = typeof card?.fields?.urlBtn1 === 'string' && card.fields.urlBtn1.trim() !== '' && !card?.fields?.textBtn1
        ? card.fields.urlBtn1.trim()
        : null;
    const cardContent =
    <div className="h-[830] flex-col justify-center align-middle overflow-auto relative">
       { isVideo ? (
            <video
                src={mediaSrc}
                width={384}
                height={216}
                autoPlay
                loop
                muted
                className="w-full object-cover h-full rounded-t-md border-b"
            />
        ):(
            <Image
            src={mediaSrc}
            alt={imageAltText}
            width={384}
            height={216}
            priority={shouldPrioritize}
            fetchPriority={shouldPrioritize ? 'high' : 'auto'}
            loading={shouldPrioritize ? 'eager' : 'lazy'}
            className="w-full h-full object-cover rounded-t-md border-b border-orange-500"
            />
        )}
        <div className={`absolute bottom-0 left-0 right-0 py-8 min-w-0 box-border ${useCompactPadding ? 'px-3 md:px-4' : 'px-4 md:px-6'}`}>
            {card?.fields?.textBtn1 ? (
                <ButtonGhost classStyles='w-full mb-4 border h-[48px] border-[color:var(--color-gray-250)] rounded-md text-[color:var(--color-gray-100)] text-[16px] md:text-[18px] font-bold'
                text={card?.fields?.textBtn1 as string} href={card?.fields?.urlBtn1 as string} />

            ) : null}

            {card?.fields?.textBtn2 ? (
                 <ButtonGhost classStyles='w-full h-[48px] rounded-md bg-white text-black border-none font-bold text-[16px] md:text-[18px]'
                 text={card?.fields?.textBtn2 as string} href={`${card?.fields?.urlBtn2}?plan=${card.fields.nombreCodePlan ?? null}&movil=${card.fields.nombreCodeMovil ?? null}`} />

            ) : null}
        </div>

    </div>
    return linkUrl && !card?.fields?.textBtn1 && !card?.fields?.textBtn2 ?(
        <a href={linkUrl} target="_blank">
        {cardContent}
        </a>
    ):cardContent
}
