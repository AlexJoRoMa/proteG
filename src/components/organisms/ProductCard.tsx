'use client'

import React from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import Link from 'next/link';
import {GenericProductComponentProps} from '@/types/GenericProductTypes';
import Image from 'next/image';

export default function ProductCard({color, borderColor, icon, altIcon, cardData}: GenericProductComponentProps) {

    const card = cardData.fields;
// 3xl:max-w-[344px]
    return (
        <>
        <div className="flex mt-8 mb-8 ">
        <Card className='xl:w-auto max-w-[402px] lg:max-w-[264px] xl:max-w-[270px]
         2xl:w-[calc(100%_-_1rem)] 2xl:max-w-[340px] 2xl:min-w-[250px] 
         3xl:w-[calc(100%_-_2rem)] 3xl:max-w-[390px] 3xl:min-w-[300px] 
         4xl:max-w-[384px] bg-white border-1 border-solid rounded-md' 
         style={{borderColor: `${borderColor}`}}>
            <CardHeader className='flex w-full h-[144px] mt-0 rounded-t-md' style={{background: `${color}`}}>
                <div className='flex items-center px-[24px]'>
                    <div className='pr-[16px]'>
                        <Image src={`https:${icon}`} width={72} height={72} alt={altIcon} loading='lazy'/>
                    </div>
                    <div className='border-b border-b-white-0'>
                        <p className="text-[36px] lg:text-[30px] xl:text-[32px] 3xl:text-[36px] text-white-0 align-middle text-center">{card?.productName}</p>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
            <div className="flex items-baseline text-gray-900 mx-[12px] mt-[32px] mb-[16px]">
                <span className="text-[24px] lg:text-[18px] xl:text-[20px] 3xl:text-[24px] font-extrabold">{card.content}</span>
            </div>
            <div className="flex items-baseline text-gray-900 mx-[12px] mb-[16px]">
                <span className="text-[18px] lg:text-[12px] xl:text-[14px] 3xl:text-[18px] font-normal">{card.pricePrefixCopy}</span>
                <span className="text-[56px] lg:text-[50px] xl:text-[52px] 3xl:text-[56px] ml-[5px] font-extrabold tracking-tight"> ${card.priceValue}</span>
                <span className="ms-1 text-[18px] lg:text-[12px] xl:text-[14px] 3xl:text-[18px] ml-[5px] font-normal text-gray-500">{card.priceSuffixCopy}</span>
            </div>
            <div className="flex items-baseline text-gray-900 mx-[12px] mb-[24px]">
                <span className="text-[18px] lg:text-[12px] xl:text-[14px] 3xl:text-[16px] font-normal">{card.advertisingCopy}</span>
            </div>
            </CardBody>
            <CardFooter>
                <div className='flex flex-col w-full'>
                    <Button as={Link} className="w-[92%] bg-color-trasparent h-[48px] border-[1px] border-solid rounded-md text-[18px] lg:text-[16px] xl:mx-[12px] 3xl:text-[18px] mx-[15px] mb-[16px]"
                        href={card.secondaryButtonUrl}>
                            {card.secondaryButtonCopy}
                    </Button>
                    <Button as={Link} className="w-[92%] bg-black-0 h-[48px] border-[2px] border-solid rounded-md text-white-0 text-[18px] xl:mx-[12px] lg:text-[16px] 3xl:text-[18px] mx-[15px] mb-[32px]"
                        href={card.primaryButtonUrl}>
                            {card.primaryButtonCopy}
                    </Button>
                </div>
            </CardFooter>
        </Card>
        </div>
        </>
    )
}