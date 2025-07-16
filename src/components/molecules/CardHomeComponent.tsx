import React from 'react'
import Image from 'next/image'
import ButtonGhost from '../atoms/ButtonGhost'
import { contentfulClient } from '@/services/contentful/client';
import { Entry, EntrySkeletonType } from 'contentful';

type CardHomePropType = {
    card: Entry<EntrySkeletonType, undefined, string>;
}

const CardHomeComponent = async({card}:CardHomePropType) => {

    //Obteniendo la imagen del card
    const imageUrl = await contentfulClient.getEntry(card?.fields?.image?.sys?.id
    ).then(asset => {
        return asset.fields;
    })

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
          src={`https:${imageUrl?.image?.fields?.file.url}` as string}
          alt={imageUrl?.altText as string}
          width={384}
          height={216}
          priority
          className="w-full object-cover h-[208px] md:h-[216px] rounded-t-md border-b-[1px solid linear-gradient(#FF6C07, #4DA9A7)]"
        />
        <div className='px-4 md:px-6 py-8 bg-(--color-gray-450) h-[calc(740px-208px)] md:h-[calc(785px-216px)] flex flex-col text-white'>
            <p className='font-bold text-2xl leading-8 mb-4 '>
                   {card?.fields?.title as string || 'Título del Card'}
            </p>
            <p className='mb-4'>
                <span className='align-bottom'>Desde</span>
                <span className='font-bold text-[48px] xl:text-[56px] sm:text-[48px]'>$850</span>
                <span className='align-bottom'>al mes</span>
            </p>
            <p className='mb-6'>
                {card?.fields?.description as string || 'Descripción del Card'}
            </p>
            <div className='grid-cols-4 grid-rows-2 gap-4'>
                
            </div>
            <div className='mt-auto'>
                <ButtonGhost classStyles='w-full mb-4 border-[1px solid (--color-gray-250)] rounded-md text-(--color-gray-100) text-[16px] md:text-[18px] font-bold'
                 text={card?.fields?.textBtn1 as string} href={card?.fields?.urlBtn1 as string} />
                <ButtonGhost classStyles='w-full rounded-md bg-white text-black border-none font-bold text-[16px] md:text-[18px]'
                text={card?.fields?.textBtn2 as string} href={card?.fields?.urlBtn2 as string} />
            </div>
        </div>
    </div>
  )
}

export default CardHomeComponent
