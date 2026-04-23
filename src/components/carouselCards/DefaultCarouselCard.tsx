import React from "react";
import Image from "next/image";
import ButtonGhost from "../atoms/ButtonGhost";
import ButtonModal from "../atoms/ButtonModal";
import { CardPropType } from "@/types/CarouselCardsTypes";
import { Asset } from "contentful";
import { ColorOption } from "@/constants/ColorModalConstants";
import RichTextComponent from "../molecules/RichTextComponent";
import { Document } from "@contentful/rich-text-types";

interface DefaultCardProps {
  imageSrc: string;
  imageAltText: string;
  shouldPrioritize: boolean;
  card: CardPropType["card"];
  isVideo: boolean;
  useCompactPadding?: boolean;
}

export default function DefaultCarouselCard({
  imageSrc,
  imageAltText,
  shouldPrioritize,
  card,
  isVideo,
  useCompactPadding = false,
}: DefaultCardProps): React.ReactElement {
  return (
    <>
      {isVideo ? (
        <video
          src={imageSrc}
          width={384}
          height={216}
          autoPlay
          controls
          loop
          className={`w-full object-scale-down h-auto rounded-t-md border-b object-top shrink-0 ${useCompactPadding ? "max-h-36" : "max-h-56"}`}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={imageAltText}
          width={384}
          height={216}
          priority={shouldPrioritize}
          fetchPriority={shouldPrioritize ? "high" : "auto"}
          loading={shouldPrioritize ? "eager" : "lazy"}
          className="w-full object-cover h-auto max-h-[216px] rounded-t-md border-b border-orange-500 shrink-0"
        />
      )}
      <div
        className={`bg-[color:var(--color-gray-450)] flex flex-col text-white min-w-0 overflow-hidden ${useCompactPadding ? "px-3 md:px-4 py-4 md:py-5 h-[calc(100%-216px)]" : "px-4 md:px-6 py-5 md:py-8 flex-1 min-h-0"}`}
      >
        <p
          className={`font-bold text-2xl leading-8 ${useCompactPadding ? "mb-2" : "mb-3 md:mb-4"}`}
        >
          {(card?.fields?.title as string) || "Título del Card"}
        </p>
        <p className={useCompactPadding ? "mb-2" : "mb-3 md:mb-4"}>
          <span className=" ">{card?.fields?.textBeforePrice as string}</span>
          <span className="ml-[5px] font-bold text-[48px] xl:text-[56px] sm:text-[48px]">
            {card?.fields?.price as string}
          </span>
          <span className="ml-[4px] ">
            {card?.fields?.textAfterPrice as string}
          </span>
        </p>
        <div className={`overflow-y-auto p-0 ${useCompactPadding ? "mb-4" : "md:mb-6"}`}>
          {card?.fields?.richDescription ? (
            <RichTextComponent
              document={card.fields.richDescription as Document}
              style={card.fields.richDescriptionTextColor? { color: card.fields.richDescriptionTextColor.toString() as string }: undefined}
              hoverText={card.fields.hoverOnRichTextImages? (card.fields.hoverOnRichTextImages.toString() as string) : undefined}
            />
          ) : (
              <p>
                {(card?.fields?.description as string) || "Descripción del Card"}
              </p>
          )}
        </div>
        {!card?.fields?.richDescription && (<div
          className={`grid grid-cols-4 mb-1.5 md:mb-6 ${useCompactPadding ? "gap-2" : "gap-2 md:gap-4"}`}
        >
          {Array.isArray(card?.fields?.adds) &&
            card?.fields?.adds?.map((add, index: number) => {
              const assetAdd = add as Asset;
              return assetAdd?.fields?.file?.url ? (
                <Image
                  key={index}
                  src={`https:${assetAdd.fields?.file?.url}` as string}
                  alt={`Add ${index + 1}`}
                  width={100}
                  height={25}
                  title={assetAdd.fields.description? assetAdd.fields.description.toString() : 'Sin descripcion'}
                  loading="lazy"
                  className="object-contain w-full h-full max-w-[100] "
                />
              ) : null;
            })}
        </div>)}
        <div
          className={`mt-auto min-w-0 w-full ${useCompactPadding ? "space-y-2" : "space-y-3 md:space-y-4"}`}
        >
          {card?.fields?.textBtn1 ? (
            card?.fields.isModal == "si" ? (
              <ButtonModal
                classStyles="w-full border h-[48px] border-[color:var(--color-gray-250)] rounded-md text-[color:var(--color-gray-100)] text-[16px] md:text-[18px] font-bold bg-transparent"
                textBtn={card?.fields?.textBtn1 as string}
                idModal={
                  typeof card?.fields?.modal === "object" &&
                  card?.fields?.modal !== null &&
                  "sys" in card.fields.modal
                    ? (card.fields.modal as { sys: { id: string } }).sys.id
                    : ""
                }
                modalContentClassName="xl:h-auto h-full"
                hrColor={(card?.fields?.colorHr as ColorOption) || ""}
              />
            ) : (
              <ButtonGhost
                classStyles="w-full border h-[48px] border-[color:var(--color-gray-250)] rounded-md text-[color:var(--color-gray-100)] text-[16px] md:text-[18px] font-bold"
                text={card?.fields?.textBtn1 as string}
                external={card?.fields?.openLinkInNewTab as boolean}
                href={card?.fields?.urlBtn1 as string}
              />
            )
          ) : null}
          {card?.fields?.textBtn2 ? (
            <ButtonGhost
              classStyles="w-full h-[48px] rounded-md bg-white text-black border-none font-bold text-[16px] md:text-[18px]"
              text={card?.fields?.textBtn2 as string}
              external={card?.fields?.openLinkInNewTab as boolean}
              href={`${card?.fields?.urlBtn2}?plan=${card.fields.nombreCodePlan ?? null}&movil=${card.fields.nombreCodeMovil ?? null}`}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
