'use client'

import InputCP from "@/components/molecules/configurador/inputCP";
import { CodigoPostalProps, ConfigDataFields, PlansCardProps } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { EntrySkeletonType } from "contentful";

const InfoIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.5" />
            <path d="M12 17V11" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="black" />
        </svg>
    )
}
export default function CoberturaCP({ data }: PlansCardProps) {

    const content = useContent();
    const entryContent = content.pageEntry?.fields.steps as unknown as EntrySkeletonType<ConfigDataFields>[];
    const plans = entryContent[0];


    const plansStep = plans?.fields.stepNumber;
    const plansTitle = plans?.fields.title;
    const plansDescription = plans?.fields.description;
    const entryCP = data as unknown as CodigoPostalProps;

    return (
        <div className="flex flex-col gap-[24px]">
            <div className='flex flex-row gap-[8px] items-center'>
                <p className='w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center'>{plansStep}</p>
                <h3 className='font-semibold text-xl leading-[24px]'>{plansTitle}</h3>
            </div>
            <div className="flex flex-row w-full">
                <InputCP />
            </div>
            <div className="flex flex-row gap-[16px] items-center">
                <h5 className="font-normal text-base leading-[24px]">{plansDescription}</h5>
                <button 
                    onClick={() => console.log('click!!!')}
                ><InfoIcon /></button>
            </div>
            {/* //TODO: campo imput codigo postal & copy "por que lo necesitamos" */}
            {/* //TODO:*icono de información del "porque lo necesitamos" abre un drawer */}

        </div>
    )
}