'use client'

import React from 'react';
import {Button} from '@heroui/react';
import Link from 'next/link';
import {GenericProductComponentProps} from '@/types/GenericProductTypes';

export default function ProductCard({color, borderColor, icon, cardData}: GenericProductComponentProps) {

    const card = cardData.fields;

    return (
        <>
        <div className="flex mt-8 mb-8">
            <div className={`xl:w-full max-w-[402px] xl:max-w-[284px] 2xl:max-w-[384px] bg-white border border-solid ${borderColor}`}>
                <div className={`flex w-full h-[144px] mt-0 ${color}`}>
                    <div className='flex items-center px-[24px]'>
                        <div className='pr-[16px]'>
                            {icon}
                        </div>
                        <div className='border-b border-b-white-0'>
                            <p className="text-[36px] xl:text-[32px] 2xl:text-[36px] text-white-0 align-middle text-center">{card?.productName}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-baseline text-gray-900 mx-[24px] mt-[32px] mb-[16px]">
                    <span className="text-[24px] xl:text-[20px] 2xl:text-[24px] font-normal">{card.content}</span>
                </div>
                <div className="flex items-baseline text-gray-900 mx-[24px] mb-[16px]">
                    <span className="text-[18px] xl:text-[14px] 2xl:text-[18px] font-normal">{card.pricePrefixCopy}</span>
                    <span className="text-[56px] xl:text-[52px] 2xl:text-[56px] font-extrabold tracking-tight"> ${card.priceValue}</span>
                    <span className="ms-1 text-[18px] xl:text-[14px] 2xl:text-[18px] font-normal text-gray-500">{card.priceSuffixCopy}</span>
                </div>
                <div className="flex items-baseline text-gray-900 mx-[24px] mb-[24px]">
                    <span className="text-[18px] xl:text-[14px] 2xl:text-[16px] font-normal">{card.advertisingCopy}</span>
                </div>
                <Button as={Link} className="w-[90%] bg-color-trasparent h-[48px] border-[2px] border-solid rounded-md text-[18px] xl:text-[16px] xl:mx-[16px] 2xl:text-[18px] mx-[20px] mb-[16px]"
                    href={card.secondaryButtonUrl}>
                        {card.secondaryButtonCopy}
                </Button>
                <Button as={Link} className="w-[90%] bg-black-0 h-[48px] border-[2px] border-solid rounded-md text-white-0 text-[18px] xl:mx-[16px] xl:text-[16px] 2xl:text-[18px] mx-[20px] mb-[32px]"
                    href={card.primaryButtonUrl}>
                        {card.primaryButtonCopy}
                </Button>
            </div>
        </div>
        </>
    )
}