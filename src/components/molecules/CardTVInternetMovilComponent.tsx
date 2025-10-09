import React from 'react'
import Image from 'next/image'
import ButtonGhost from '../atoms/ButtonGhost'
import { CardPropType } from '@/types/CarouselCardsTypes'
import { Asset } from 'contentful'
import { INTERNETCOLOR, MOVILCOLOR, TVCOLOR } from '@/constants/CardComponent'
import ButtonModal from '../atoms/ButtonModal'
import { ColorOption } from '@/constants/ColorModalConstants'
import RichTextComponent from './RichTextComponent'
import { Document } from '@contentful/rich-text-types'

const CardTVInternetMovilComponent = ({card}:CardPropType) => {

    const type = card?.fields?.type as string;
    const color = type === 'internet' ? INTERNETCOLOR : type === 'tv' ? TVCOLOR : type === 'movil' ? MOVILCOLOR : '#000000';

  return (
    <div className='px-[16px] md:px-[24px] py-[32px] bg-white h-[650px] rounded-md relative flex-col flex'>
      {
        card?.fields?.alternativeDescription ? (
          <>
            {card?.fields?.tituloRich && (
              <RichTextComponent document={card?.fields?.tituloRich as Document} className='!h-min'/>
            )}

            <hr className={`mt-6 mb-6 flex-shrink-0 ${
              card?.fields?.colorHr 
                ? `border-none h-[1px] rich-text-hr-${(card.fields.colorHr as ColorOption).toLowerCase()}`
                : "border-t-2 border-gray-400 h-0"
            }`} />

            <RichTextComponent document={card?.fields?.alternativeDescription as Document}/>
          </>
        ) : (
          <>
            {card?.fields?.tagPromo ? (
              <div
                className="rounded-t-md px-6 py-1 mb-[32px] text-[20px] -mt-[32px] -mx-[16px] md:-mx-[24px] leading-6 w-(calc(100% + 32px)) text-center text-white"
                style={{ backgroundColor: color }}
              >
                {card.fields.tagPromo as string}
              </div>
            ) : null}

            <div className='flex mb-[24px] items-center'>

              {
                card?.fields?.tituloRich && (
                  <RichTextComponent document={card?.fields?.tituloRich as Document}/>
                )
              }
              
            </div>
            <hr className={`mb-[24px] flex-shrink-0 ${
              card?.fields?.colorHr 
                ? `border-none h-[1px] rich-text-hr-${(card.fields.colorHr as ColorOption).toLowerCase()}`
                : "border-t-2 border-gray-400 h-0"
            }`} />
            {
              card?.fields?.priceBefore ? (
                <p className='line-through text-(--color-gray-200) text-[24px] leading-[32px]'>{card.fields.priceBefore as string}</p>
              ) : null
            }
            <p className='mb-4'>
              <span className='text-[16px] leading-[24px]'>{card.fields.textBeforePrice as string}</span>
              <span className='text-[56px] font-bold '>{card.fields.price as string}</span>
              <span className='text-[16px] leading-[24px]'>{card.fields.textAfterPrice as string}</span>
            </p>
            {
              card?.fields?.description && !card?.fields?.descriptionRich ? (
                <p className='text-[16px] leading-[24px] mb-[24px]'>{card.fields.description as string}</p>
              ) : null
            }

            {
              card?.fields?.descriptionRich && (
                <RichTextComponent document={card?.fields?.descriptionRich as Document}/>
              )
            }
            <div className='grid grid-cols-4 grid-rows-2  '>
                {
                    Array.isArray(card?.fields?.adds) && card?.fields?.adds?.map((add, index: number) => {
                            const assetAdd = add as Asset;
                        return assetAdd?.fields?.file?.url ? (
                            <Image 
                                key={index}
                                src={`https:${assetAdd.fields?.file?.url}` as string}
                                alt={`Add ${index + 1}`}
                                width={56}
                                height={14}
                                priority
                                className='w-auto'/>
                        ) : null;
                    })
                }
            </div>
            { card?.fields?.textoContratacin && (
              <p className='md:text-[18px] xsm:text-[16px] font-bold  text-black gap-4 mb-[32px]'>{card?.fields?.textoContratacin as string}</p>
            )}
          </>
        )
      }          
        <div className='mt-auto'>
            {
                card?.fields.isModal == 'si' ? (
                    <ButtonModal
                        classStyles='w-full mb-4 border-[1px solid black] rounded-md text-black text-[16px] md:text-[18px] font-bold'
                        textBtn={card?.fields?.textBtn1 as string}
                        idModal={typeof card?.fields?.modal === 'object' && card?.fields?.modal !== null && 'sys' in card.fields.modal ? (card.fields.modal as { sys: { id: string } }).sys.id : ''}
                        modalContentClassName="xl:h-auto h-full"
                        hrColor={card?.fields?.colorHr as ColorOption}
                    />
                ) : (
                    <ButtonGhost classStyles='w-full mb-4 border-[1px solid black] rounded-md text-black text-[16px] md:text-[18px] font-bold'
                        text={card?.fields?.textBtn1 as string} href={card?.fields?.urlBtn1 as string} />
                )
            }
            <ButtonGhost classStyles='w-full rounded-md bg-black text-white border-none font-bold text-[16px] md:text-[18px]'
                text={card?.fields?.textBtn2 as string} href={card?.fields?.urlBtn2 as string} />
        </div>
    </div>
  )
}

export default CardTVInternetMovilComponent
