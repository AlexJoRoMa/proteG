
import React from 'react'
import Image from 'next/image';
import { AssetDetails } from 'contentful';
import { TextAndImageComponentProps } from '@/types/ModalComponentTypes';


const TextAndImageComponent = ({text, image, fontSize}:TextAndImageComponentProps) => {

  return (
    <div className='flex w-fit mr-4 mb-1 xl:mb-0'>
        {
            image && (
                <Image
                src={image?.fields?.file?.url ? `https:${image.fields.file.url}` : ''}
                alt={image?.fields?.title as string}
                width={image?.fields?.file?.details && 'image' in image.fields.file.details ? (image.fields.file.details as AssetDetails).image?.width || 25 : 25}
                height={image?.fields?.file?.details && 'image' in image.fields.file.details ? (image.fields.file.details as AssetDetails).image?.height || 25 : 25}
                className="mr-2 object-contain"
                />
            )
        }

        {
            text && (
                <span className='text-2xl' style={{fontSize: fontSize}}>{text}</span>
                )

        }
        
        
    </div>
  )
}

export default TextAndImageComponent
