import { contentfulClient } from '@/services/contentful/client';
import { ResumenIcon } from '@/types/ConfiguradorTypes';
import { EntrySkeletonType } from 'contentful';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const ThankYouHeader = async () => {

    const IzziIcon = await contentfulClient.getEntries({
        content_type: 'media',
        'fields.internalName': 'Izzi Logo',
        include: 5,
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    }) as unknown as EntrySkeletonType<ResumenIcon>;


    return (
        <header className='w-full'>
            <div className='flex justify-between md:justify-around items-center py-4 px-4 md:px-0 md:pb-6 md:pt-[52px] border-b border-gray-150 w-full'>
                <div className='text-transparent w-[32px]'>Izzi</div>
                {IzziIcon && (
                    <div className="relative w-[81px] h-[32px] flex-shrink-0">
                        <Image
                            className="object-contain"
                            src={`https:${IzziIcon?.fields.image.fields.file.url}`}
                            alt={IzziIcon?.fields.altText || "logo Izzi"}
                            width={81}
                            height={32}
                        />
                    </div>
                )}

                <Link href={'/'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className='cursor-pointer'>
                        <path d="M23.9999 8.00006L8 24M7.99993 8L23.9999 23.9999" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </Link>
            </div>
        </header>
    )
}

export default ThankYouHeader
