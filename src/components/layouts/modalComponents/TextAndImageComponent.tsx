
import React from 'react'
import Image from 'next/image';
import { AssetDetails } from 'contentful';
import { TextAndImageComponentProps } from '@/types/ModalComponentTypes';


const TextAndImageComponent = ({text, image, fontSize}:TextAndImageComponentProps) => {

  return (
    <div className='flex w-fit mr-4 mb-1 xl:mb-0'>
        {
            image && (
                <div className="flex-shrink-0 mr-2 ">
                    <Image
                    src={image?.fields?.file?.url ? `https:${image.fields.file.url}` : ''}
                    alt={image?.fields?.title as string}
                    width={image?.fields?.file?.details && 'image' in image.fields.file.details ? (image.fields.file.details as AssetDetails).image?.width || 25 : 25}
                    height={image?.fields?.file?.details && 'image' in image.fields.file.details ? (image.fields.file.details as AssetDetails).image?.height || 25 : 25}
                    className="object-contain w-8 h-8 lg:w-auto lg:h-auto"
                    loading='lazy'
                    unoptimized
                    />
                </div>
            )
        }

        {
            text && (
                <span 
                    className='text-lg sm:text-xl md:text-2xl' 
                    style={fontSize ? { fontSize: fontSize } : undefined}
                >
                    {text}
                </span>
            )
        }
        
        
    </div>
  )
}

export default TextAndImageComponent
