import React from 'react'
import Image from 'next/image'
import ButtonGhost from '../atoms/ButtonGhost'
import { contentfulClient } from '@/services/contentful/client';
import { Asset, AssetDetails } from 'contentful';
import { CardPropType } from '@/types/CarouselCardsTypes';
import ButtonModal from '../atoms/ButtonModal';



const CardHomeComponent = async({card}:CardPropType) => {

    //Obteniendo la imagen del card
    const imageAsset = card?.fields?.image as Asset;
    const imageUrl = imageAsset?.sys?.id ? await contentfulClient.getEntry(imageAsset.sys.id
    ).then(asset => {
        return asset.fields;
    }) : null;

  return (
    <div className='h-[740px] max-h-[785px] md:h-[785px] flex-col rounded-md relative'>
        {
            card?.fields?.tagPromotional? (
                <div className=' rounded-t-md px-6 py-1 absolute top-0 text-[18px] leading-6 w-full text-center text-white bg-[image:var(--gradient-card-tag-home)]'>
                {card.fields.tagPromotional as string}
                </div>
            ) : null
        }
        <Image 
          src={`https:${(imageUrl?.image as Asset)?.fields?.file?.url}` as string}
          alt={imageUrl?.altText as string}
          width={384}
          height={216}
          priority
          className="w-full object-cover h-auto rounded-t-md border-b border-orange-500"
        />
        <div className='px-4 md:px-6 py-8 bg-[color:var(--color-gray-450)] h-[calc(740px-208px)] md:h-[calc(785px-216px)] flex flex-col text-white'>
            <p className='font-bold text-2xl leading-8 mb-4 '>
                   {card?.fields?.title as string || 'Título del Card'}
            </p>
            <p className='mb-4'>
                <span className='align-bottom'>{card?.fields?.textBeforePrice as string}</span>
                <span className='font-bold text-[48px] xl:text-[56px] sm:text-[48px]'>{card?.fields?.price as string}</span>
                <span className='align-bottom'>{card?.fields?.textAfterPrice as string}</span>
            </p>
            <p className='mb-6'>
                {card?.fields?.description as string || 'Descripción del Card'}
            </p>
            <div className='grid grid-cols-4 grid-rows-2 gap-4'>
                {
                    Array.isArray(card?.fields?.adds) && card?.fields?.adds?.map((add, index: number) => {
                        const assetAdd = add as Asset;
                        return assetAdd?.fields?.file?.url ? (
                            <Image 
                                key={index}
                                src={`https:${assetAdd.fields?.file?.url}` as string}
                                alt={`Add ${index + 1}`}
                                width={assetAdd.fields?.file?.details && 'image' in assetAdd.fields.file.details ? (assetAdd.fields.file.details as AssetDetails).image?.width || 100 : 100}
                                height={assetAdd.fields?.file?.details && 'image' in assetAdd.fields.file.details ? (assetAdd.fields.file.details as AssetDetails).image?.height || 25 : 25}
                                priority
                                className='w-auto h-full'/>
                        ) : null;
                    })
                }
            </div>
            <div className='mt-auto'>
                {
                    card?.fields.isModal == 'si' ? (
                        <ButtonModal
                            classStyles='w-full mb-4 border h-[48px] border-[color:var(--color-gray-250)] rounded-md text-[color:var(--color-gray-100)] text-[16px] md:text-[18px] font-bold bg-transparent'
                            textBtn={card?.fields?.textBtn1 as string}
                            idModal={typeof card?.fields?.modal === 'object' && card?.fields?.modal !== null && 'sys' in card.fields.modal ? (card.fields.modal as { sys: { id: string } }).sys.id : ''}
                            modalContentClassName="h-full"
                        />
                    ) : <ButtonGhost classStyles='w-full mb-4 border h-[48px] border-[color:var(--color-gray-250)] rounded-md text-[color:var(--color-gray-100)] text-[16px] md:text-[18px] font-bold'
                        text={card?.fields?.textBtn1 as string} href={card?.fields?.urlBtn1 as string} />
                }

                <ButtonGhost classStyles='w-full h-[48px] rounded-md bg-white text-black border-none font-bold text-[16px] md:text-[18px]'
                text={card?.fields?.textBtn2 as string} href={card?.fields?.urlBtn2 as string} />
            </div>
        </div>
    </div>
  )
}

export default CardHomeComponent
