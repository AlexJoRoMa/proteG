'use client'

import React from 'react';
import {Button} from '@heroui/react';
import Link from 'next/link';
import {GenericProductComponentProps, GenericProductCardType} from '@/types/GenericProductTypes';

export default function ProductCard({color, borderColor, icon, cardData}: GenericProductComponentProps) {

    const card = cardData?.fields as GenericProductCardType;

    return (
        <>
        <div className="flex flex-col xl:flex-row mt-4 mb-4">
<div className={`w-full max-w-[384px] bg-white border border-solid ${borderColor}`}>
    <div className={`flex w-full h-[144px] mt-0 ${color}`}>
        <div className='flex items-center px-[24px]'>
            <div className='pr-[16px]'>
                {icon}
            </div>
            <div className='border-b border-b-white-0'>
                <p className="text-[36px] text-white-0 align-middle text-center">{card?.productName}</p>
            </div>
        </div>
    </div>
    <div className="flex items-baseline text-gray-900 mx-[24px] mt-[32px] mb-[16px]">
        <span className="text-[24px] font-normal">{card.content}</span>
    </div>
    <div className="flex items-baseline text-gray-900 mx-[24px] mb-[16px]">
        <span className="text-[18px] font-normal">{card.pricePrefixCopy}</span>
        <span className="text-[56px] font-extrabold tracking-tight"> ${card.priceValue}</span>
        <span className="ms-1 text-[18px] font-normal text-gray-500">{card.priceSuffixCopy}</span>
    </div>
    <div className="flex items-baseline text-gray-900 mx-[24px] mb-[24px]">
        <span className="text-[18px] font-normal">Conéctate y navega fácil y rápido en miles de sitios.</span>
    </div>
    <Button as={Link} className="w-[80%] bg-color-trasparent h-[48px] border-[2px] border-solid rounded-md text-[18px] mx-[24px] mb-[16px]"
        href="#">
            saber más
    </Button>
    <Button as={Link} className="w-[80%] bg-black-0 h-[48px] border-[2px] border-solid rounded-md text-white-0 text-[18px] mx-[24px] mb-[32px]"
        href="#">
            contratar ahora
    </Button>
</div>
</div>
        </>
    )
}