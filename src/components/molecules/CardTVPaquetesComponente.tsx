import React from 'react'
import Image from 'next/image'
import ButtonGhost from '../atoms/ButtonGhost'
import { contentfulClient } from '@/services/contentful/client';
import { Entry, EntrySkeletonType, Asset } from 'contentful';
import { CardPropType } from '@/types/CarouselCardsTypes';



const CardTvPaquetesComponent = async({card}:CardPropType) => {

    //Obteniendo la imagen del card
    const imageAsset = card?.fields?.image as Asset;
    const imageUrl = imageAsset?.sys?.id ? await contentfulClient.getEntry(imageAsset.sys.id
    ).then(asset => {
        return asset.fields;
    }) : null;

  return (
    <div className='h-[497px] max-h-[497px] md:h-[497px] flex flex-col rounded-md relative border-[1px] border-cyan-400 overflow-hidden'>
        
        
        <div className='border-[1px] border-cyan-400 rounded-t-md w-auto md:h-auto xsm:h-[250px]  overflow-hidden'>
        <Image 
          src={`https:${(imageUrl?.image as Asset)?.fields?.file?.url}` as string}
          alt='imagen de card'
          loading='lazy'
          width={384}
          height={216}
          quality={100}
          className="w-full object-cover h-full rounded-t-md  "
        />
        </div>

        <div className=' px-4 md:px-6 py-8 bg-white h-[calc(600px-208px)] md:h-[calc(48px-216px)] flex flex-col text-black rounded-b-md'>
            <p className='font-bold text-2xl leading-8 mb-4  text-center'>
                   {card?.fields?.title as string || 'Título del Card'}
            </p>
            <p className=' md:mt-5 xsm:mt-4 text-center text-[16px]'>
                {card?.fields?.description as string || 'Descripción del Card'}
            </p>
            
            <div className='mt-auto mb-3'>
                <ButtonGhost classStyles='w-full  border-black bg-black rounded-md text-white text-[16px] md:text-[18px] xsm:text-[16 px] font-bold'
                 text={card?.fields?.textBtn1 as string} href={card?.fields?.urlBtn1 as string} />
            </div>
        </div>
    </div>
  )
}

export default CardTvPaquetesComponent
