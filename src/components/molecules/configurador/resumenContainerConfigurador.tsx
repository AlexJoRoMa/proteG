'use client'

import ResumenContent from "../resumenCompra/resumenContent";
import Image from "next/image";
import { useContent } from "@/utils/ConfiguradorProvider";
import { ResumenData } from "@/types/ResumenCompra";

export default function ResumenContainerConfigurador() {

    const { copysResumen, checkedPromotions, setCheckedPromotions, resumenIcon, userAnswers } = useContent();
    const resumenCopys = copysResumen as ResumenData;

    return (
        <>
            <h1 className="hidden xl:block font-bold leading-[24px] text-xl">{resumenCopys.titulo}</h1>

            {checkedPromotions &&
                <div className="flex gap-[16px] w-full rounded-md py-[24px] px-[16px] mt-[24px] bg-gray-450">
                    <div className="w-[31.7px] h-[50px]">
                        <Image
                            src={`https:${resumenIcon.fields.image.fields.file.url}`}
                            alt={resumenIcon.fields.altText}
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

            <ResumenContent copys={resumenCopys} userSelection={userAnswers}/>

            <div className="hidden xl:block">
                {!checkedPromotions ?
                    <button
                        className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                        onClick={() => setCheckedPromotions(true)}
                    >
                        {resumenCopys.boton.comprobarPromociones}
                    </button>
                    :
                    <button
                        disabled
                        className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                    >
                        {resumenCopys.boton.contratar.titulo}
                    </button>
                    // <ButtonGhost
                    //     classStyles={"py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg text-center"}
                    //     text={resumenCopys.boton.contratar.titulo}
                    //     href={resumenCopys.boton.contratar.url}
                    // />
                }
            </div>

        </>
    )
}