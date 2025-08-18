import { ResumenData } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { useState } from "react";
import ResumenPaquetes from "./resumenPaquetes";
import ButtonGhost from "@/components/atoms/ButtonGhost";
import Image from "next/image";

export const ArrowIcon = (props: any) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" >
            <path d="M19 15L12 9L5 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default function ResumenContent() {

    const content = useContent();
    const resumenCopys = content.copysResumen as ResumenData;


    return (
        <>
            <h1 className="hidden md:block font-bold leading-[24px] text-xl">{resumenCopys.titulo}</h1>

            {content.checkedPromotions &&
                <div className="flex gap-[16px] w-full rounded-md py-[24px] px-[16px] mt-[24px] bg-gray-450">
                    <div className="w-[31.7px] h-[50px]">
                        <Image
                            src={`https:${content.resumenIcon.fields.image.fields.file.url}`}
                            alt={content.resumenIcon.fields.altText}
                            width={31.7}
                            height={50}
                            loading="lazy"
                        />
                    </div>
                    <div className="flex flex-col gap-[16px]">
                        <div className="flex flex-col gap-[8px]">
                            <h3 className="font-bold text-xl text-white-0">{resumenCopys.promociones.titulo}</h3>
                            <div className="flex gap-[4px] font-normal text-lg leading-[24px] text-white-0">
                                <h4>{resumenCopys.promociones.textoAhorro}</h4>
                                <h4>$XXXX</h4>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <ResumenPaquetes />

            {content.checkedPromotions &&
                <>
                    <div className="py-[24px] border-b-1 border-b-gray-150">
                        <div className="flex justify-between items-center w-full font-normal leading-[24px] text-lg">
                            <h5>{resumenCopys.total.sinDescuentos}</h5>
                            <h5 className="font-bold">$XXXX</h5>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[8px] py-[24px] border-b-1 border-b-gray-150">
                        <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                            <h5>{resumenCopys.ahorro.paquete}</h5>
                            <h5>-$XXXX</h5>
                        </div>
                        <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                            <h5>{resumenCopys.ahorro.domicilio}</h5>
                            <h5>-$XXXX</h5>
                        </div>
                        <h5 className="w-full font-normal leading-[24px] text-base text-gray-250">
                            {resumenCopys.ahorro.infoAdicional}
                        </h5>
                    </div>
                </>
            }
            <div className="flex flex-col gap-[24px]">
                <div className="flex justify-between w-full font-bold leading-[32px] md:leading-[40px] text-2xl md:text-[32px] pt-[24px]">
                    <h2>{resumenCopys.total.titulo}</h2>
                    <h2>$XXXX</h2>
                </div>

                <div className="hidden md:block">
                    {!content.checkedPromotions ?
                        <button
                            className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                            onClick={() => content.setCheckedPromotions(true)}
                        >
                            {resumenCopys.boton.comprobarPromociones}
                        </button>
                        :
                        <ButtonGhost
                            classStyles={"py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg"}
                            text={resumenCopys.boton.contratar.titulo}
                            href={resumenCopys.boton.contratar.url}
                        />
                    }
                </div>
            </div>

        </>
    )
}
