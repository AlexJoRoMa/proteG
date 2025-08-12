'use client'

import ButtonGhost from "@/components/atoms/ButtonGhost";
import { ResumenData } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider"
import ResumenPaquetes from "./resumenPaquetes";

export default function ResumenPedido() {

    const content = useContent();
    const resumenCopys = content.dataResumen as ResumenData;

    // console.log('Respuestas', content.userAnswers)

    return (
        <div className="md:border md:rounded-md md:border-gray-150 w-full px-[16px] pt-[24px] pb-[32px] bg-gray-50 md:bg-white-0">
            <div className="block md:hidden">
                <h1>{resumenCopys.total.titulo}</h1>
            </div>

            <div className="hidden md:block">
                <h1 className="font-bold leading-[24px] text-xl">{resumenCopys.titulo}</h1>

                <div className="pt-[24px]">
                    <ResumenPaquetes />
                </div>

                <div className="py-[12px] border-b-1 border-b-gray-150">
                    <div className="flex justify-between items-center w-full font-normal leading-[24px] text-lg">
                        <h5>{resumenCopys.total.sinDescuentos}</h5>
                        <h5 className="font-bold">$XXXX</h5>
                    </div>
                </div>

                <div className="flex flex-col gap-[24px] py-[12px] border-b-1 border-b-gray-150">
                    <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                        <h5>{resumenCopys.ahorro.paquete}</h5>
                        <h5>-$XXXX</h5>
                    </div>
                    <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                        <h5>{resumenCopys.ahorro.domicilio}</h5>
                        <h5>-$XXXX</h5>
                    </div>
                    <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                        <h5>{resumenCopys.ahorro.pagoAnticipado}</h5>
                        <h5>-$XXXX</h5>
                    </div>
                </div>

                <div className="py-[12px] border-b-1 border-b-gray-150">
                    <div className="flex justify-between items-center w-full font-normal leading-[24px] text-lg">
                        <h5>{resumenCopys.pagoPosterior}</h5>
                        <h5 className="font-bold">-$XXXX</h5>
                    </div>
                </div>

                <div className="flex flex-col gap-[24px]">
                    <div className="flex justify-between w-full font-bold leading-[40px] text-[32px] pt-[24px]">
                        <h2>{resumenCopys.total.titulo}</h2>
                        <h2>$XXXX</h2>
                    </div>
                    <ButtonGhost
                        classStyles={"py-[14px] px-[16px] h-[48px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg"}
                        text={resumenCopys.boton.contratar.titulo}
                        href={resumenCopys.boton.contratar.url}
                    />
                </div>
            </div>
        </div>
    )
}