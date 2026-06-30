import { contentfulClient } from '@/services/contentful/client'
import { Asset, Entry, EntrySkeletonType } from 'contentful'
import React from 'react'
import RichTextComponent from '../molecules/RichTextComponent'
import { Document } from '@contentful/rich-text-types'
import { CarouselProvider } from '@/utils/CarouselProvider'
import Image from 'next/image'
import CarouselComponent from '../molecules/CarouselComponent'
import '@/styles/CarouselImagesComponent.css'

interface CarouselImagesProps {
  id: string;
}

interface CarouselImagesEntryFields {
  richTitle?: Document;
  images?: Asset[];
}

interface CarouselImagesEntrySkeleton extends EntrySkeletonType {
  contentTypeId: 'carouselImages';
  fields: CarouselImagesEntryFields;
}

const CarouselImagesComponent = async ({id}: CarouselImagesProps) => {

 const entriesChannels: Entry<CarouselImagesEntrySkeleton>[] | null = await contentfulClient.getEntries<CarouselImagesEntrySkeleton>({
    content_type: "carouselImages",
    'sys.id': id,
    select: ['fields.richTitle', 'fields.images'],
    include: 2
  }).then((entriesResponse) => {
    return entriesResponse.items
  })

  return (
    <div className='text-center my-16 CarouselImagesComponent 4xl:px-[200px] 2xl:px-[144px] xl:px-[80px] md:px-[80px] xsm:px-[16px] relative'>
        {
            entriesChannels?.[0]?.fields?.richTitle && (
                <RichTextComponent document={entriesChannels[0].fields.richTitle as unknown as Document} className='mb-[54px]' />
            )
        }

        <CarouselProvider 
                        qtyCarousels={1} 
                        colorArrow='black' 
                        carouselConfigs={[{ 
                        options: { 
                        align: 'start',
                     } 
                }]}
            >
            <CarouselComponent carouselIndex={0} buttons={true} dots={true}>
                {
                    entriesChannels?.[0]?.fields?.images && Array.isArray(entriesChannels[0].fields.images) && 
                    (entriesChannels[0].fields.images as Asset[]).map((image: Asset, index: number) => (
                        <Image
                            key={index}
                            src={`https:${image?.fields?.file?.url}` as string}
                            alt={image?.fields?.title as string}
                            width={(image?.fields?.file?.details as import("contentful").AssetDetails).image?.width || 600}
                            height={(image?.fields?.file?.details as import("contentful").AssetDetails).image?.height || 400}
                            className=""
                            priority
                            unoptimized
                        />
                    ))
                }   
            </CarouselComponent>
         
        </CarouselProvider>        
    </div>
  )
}

export default CarouselImagesComponent
