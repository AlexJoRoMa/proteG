'use client'

import { PlansCardProps } from "@/types/ConfiguradorTypes"

export default function CoberturaCP({ plans }: PlansCardProps) {

    const plansStep = plans?.fields.stepNumber;
    const plansTitle = plans?.fields.title;

    return (
        <div className="flex flex-col gap-[24px]">
            <div className='flex flex-row gap-[8px] items-center'>
                <p className='w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center'>{plansStep}</p>
                <h3 className='font-semibold text-xl leading-[24px]'>{plansTitle}</h3>
            </div>
            {/* //TODO: campo imput codigo postal & copy "por que lo necesitamos" */}
            {/* //TODO:*campo "porque lo necesitamos" abre un modal de pantalla completa */}

        </div>
    )
}