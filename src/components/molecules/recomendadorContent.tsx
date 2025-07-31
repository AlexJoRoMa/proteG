'use client'

import { RecomendadorContentProps, StepsDataFields } from "@/types/Recomendador";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { EntrySkeletonType } from "contentful";

export default function RecomendadorContent({ data }: RecomendadorContentProps) {

    const cardsInfo = data as unknown as EntrySkeletonType<StepsDataFields>[];

    return (
        <div className="flex flex-col gap-[40px] md:mx-md 2xl:mx-xl">
            <div className="grid grid-cols-3 gap-[24px]">
                <Card
                    isPressable
                    classNames={{
                        base: "w-full h-auto bg-transparent rounded-md border-1 border-gray-150 p-[6px] shadow-none",
                        header: "pb-[16px]"
                    }}
                >
                    <CardBody>
                        <h1 className="font-normal leading-[24px] text-base">Solo yo</h1>
                    </CardBody>
                    <CardFooter>
                        <span
                            className='w-[24px] h-[24px] rounded-full border flex items-center justify-end transition-colors bg-transparent border-gray-150'
                        >
                        </span>
                    </CardFooter>
                </Card>

                <Card
                    isPressable
                    classNames={{
                        base: "w-full h-auto bg-transparent rounded-md border-1 border-gray-150 p-[6px] shadow-none",
                        header: "pb-[16px]"
                    }}
                >
                    <CardBody>
                        <h1 className="font-normal leading-[24px] text-base">2 a 3 personas</h1>
                    </CardBody>
                    <CardFooter>
                        <span
                            className='w-[24px] h-[24px] rounded-full border flex items-center justify-end transition-colors bg-transparent border-gray-150'
                        >
                        </span>
                    </CardFooter>
                </Card>

                <Card
                    isPressable
                    classNames={{
                        base: "w-full h-auto bg-transparent rounded-md border-1 border-gray-150 p-[6px] shadow-none",
                        header: "pb-[16px]"
                    }}
                >
                    <CardBody>
                        <h1 className="font-normal leading-[24px] text-base">más de 4 personas</h1>
                    </CardBody>
                    <CardFooter>
                        <span
                            className='w-[24px] h-[24px] rounded-full border flex items-center justify-end transition-colors bg-transparent border-gray-150'
                        >
                        </span>
                    </CardFooter>
                </Card>
            </div>
            <button className="py-[14px] px-[16px] border-1 border-black-0 rounded-md w-[320px] h-auto font-bold leading-[24px] text-lg self-center">continuar</button>
        </div>
    )
}