'use client'

import { ResumenData } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider"

export default function ResumenPedido() {

    const content = useContent();
    const resumenCopys = content.dataResumen as ResumenData;

    return (
        <div className="md:border md:rounded-md md:border-gray-150 w-full px-[16px] py-[24px] bg-gray-50 md:bg-white-0">
            <div className="block md:hidden">
                <h1>{resumenCopys.total.titulo}</h1>
            </div>
            <div className="hidden md:block">
                <h1>{resumenCopys.titulo}</h1>
            </div>
        </div>
    )
}