'use client'

import ResumenContent from "../resumenCompra/resumenContent";
import Image from "next/image";
import { useContent } from "@/utils/ConfiguradorProvider";
import { ResumenData } from "@/types/ResumenCompra";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { useState } from "react";
import ButtonGhost from "@/components/atoms/ButtonGhost";
// import ModalFechaInvalida from "../checkout/modals/ModalFechaInvalida";

export default function ResumenContainerConfigurador() {

    const { copysResumen, checkedPromotions, setCheckedPromotions, resumenIcon, userAnswers, configuradorEntry, izziSelection } = useContent();
    const { promoData, setPromoData } = useIzziContent();
    const resumenCopys = copysResumen as ResumenData;
    const [loading, setLoading] = useState(false);
    const [promoError, setPromoError] = useState(false);
    const { coberturaData, setRpt, setOffnetIzzi, setOffnetSky } = useIzziContent();

    let totalDiscount = 0;
    
    const handleClick = async () => {
        setLoading(true);
        const extrasBody = [];

        
            if(izziSelection?.extrasMap){
                izziSelection?.extrasMap?.ott?.map((extra) => {
                    extrasBody.push({
                        "extId": extra.idExtra, 
                        "nuevaCantidad": 1, 
                        "combo": true
                    })
                })
            }
            if(izziSelection?.extras){
                extrasBody.push({
                    "extId":  izziSelection.extras?.idExtra, 
                    "nuevaCantidad": 1, 
                    "combo": false, 
                    "tipoEntrega": "DOMICILIO", 
                    "sucursalId": "N/A", 
                    "portabilidadMovil": "N"
                })
            }

        try {
        const res = await fetch("/api/configurador/resumen", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                    "rpt": configuradorEntry?.rptCode,
                    "postalCode": coberturaData.zipCode,
                    "hub": configuradorEntry?.hub,
                    "coverageType": configuradorEntry?.coverageType,
                    "requestedServices": {
                        "extras": extrasBody,
                        "product": izziSelection?.idPaquete
                    },
                    "offnet": configuradorEntry?.offnetIzzi && configuradorEntry?.offnetSky
                }
            ),
        });
    
        const data = await res.json();
        setPromoData(data);
        setRpt(configuradorEntry?.rptCode as string);
        setOffnetIzzi(configuradorEntry?.offnetIzzi as boolean);
        setOffnetSky(configuradorEntry?.offnetSky as boolean);
        } catch (error) {
            setCheckedPromotions(false);
            setPromoError(true);
            console.error("Error al obtener el token:", error);
        } finally {
            setLoading(false);
        }
    };

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
                                {
                                    promoData?.promoPackage?.map((promo, index) => {
                                        if(promo.amount !== '0'){
                                            totalDiscount = totalDiscount + Number(promo.amount);
                                        }
                                        return (<h4 key={index}>${totalDiscount}</h4>)
                                    })
                                }
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
                        onClick={() => {
                            setCheckedPromotions(true);
                            handleClick();
                        }}
                    >
                        {resumenCopys.boton.comprobarPromociones}
                    </button>
                    :
                    // <button
                    //     disabled={loading}
                    //     className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                    // >
                    //     {resumenCopys.boton.contratar.titulo}
                    // </button>
                    <ButtonGhost
                        disabled={loading && promoError}
                        classStyles={"py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg text-center"}
                        text={resumenCopys.boton.contratar.titulo}
                        href={resumenCopys.boton.contratar.url}
                    />
                }
                {/* <ModalFechaInvalida isOpen={promoError} /> */}
            </div>

        </>
    )
}