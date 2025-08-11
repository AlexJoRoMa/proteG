import React from 'react'
import Image from 'next/image';
import { AssetDetails } from 'contentful';
import { FeatureListItemComponentProps } from '@/types/ModalComponentTypes';

const FeatureListItemComponent = ({title, description, image}:FeatureListItemComponentProps) => {
  return (
    <div className='flex w-full'>
        {
            image && (
                <Image
                src={image?.fields?.file?.url ? `https:${image.fields.file.url}` : ''}
                alt={image?.fields?.title as string}
                width={image?.fields?.file?.details && 'image' in image.fields.file.details ? (image.fields.file.details as AssetDetails).image?.width || 25 : 25}
                height={image?.fields?.file?.details && 'image' in image.fields.file.details ? (image.fields.file.details as AssetDetails).image?.height || 25 : 25}
                className="mr-2 h-fit min-h-8"
                />
            )

        }
    
        <div>
            {
            title && (
                <span className='text-base font-bold block w-full'>
                    {title}
                </span>)
            }
            {
            description && (
                <span className='text-base w-full'>
                    {description}
                </span>)
            }

        </div>
    </div>
  )
}

export default FeatureListItemComponent
