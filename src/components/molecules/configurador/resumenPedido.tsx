'use client'

import { internetComponentFields, movilComponentFields, tvComponentFields } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider"
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from "@heroui/react";
import ButtonGhost from "@/components/atoms/ButtonGhost";
import { useEffect, useState } from "react";
import ResumenContainerConfigurador from "./resumenContainerConfigurador";
import { ResumenData } from "@/types/ResumenCompra";
import { useIzziContent } from "@/utils/IzziProvider";
import { FormatCurrency } from "@/utils/Currency";

export const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M19 15L12 9L5 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M19 9L12 15L5 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function hasData(obj: unknown): boolean {
    return !!obj && typeof obj === "object" && Object.keys(obj as object).length > 0;
}

export default function ResumenPedido() {

    const { userAnswers, copysResumen, setCheckedPromotions, checkedPromotions, infoDrawerContent, configuradorEntry, izziSelection } = useContent();
    const { precioTotal, coberturaData, setPromoData, infoPaquetes, setInfoPaquetes } = useIzziContent();;
    const [loading, setLoading] = useState(false);
    const [promoError, setPromoError] = useState(false);

    const resumenCopys = copysResumen as ResumenData;
    const internet = userAnswers.internet as unknown as internetComponentFields | undefined;
    const tv = userAnswers.tv as unknown as tvComponentFields | undefined;
    const movil = userAnswers.movil as unknown as movilComponentFields | undefined;

    const newSelection = (userAnswers && userAnswers !== null && Object.keys(userAnswers).length > 0)

    useEffect(() => {
        setCheckedPromotions(false);

        if (hasData(internet) && !hasData(tv) && !hasData(movil)) {
            setInfoPaquetes(resumenCopys.infoDrawer.paquetes.internet);
        }
        if (!hasData(internet) && !hasData(movil) && hasData(tv)) {
            setInfoPaquetes(resumenCopys.infoDrawer.paquetes.tv);
        }
        if (!hasData(internet) && hasData(movil) && !hasData(tv)) {
            setInfoPaquetes(resumenCopys.infoDrawer.paquetes.movil);
        }
        if (hasData(internet) && !hasData(movil) && hasData(tv)) {
            setInfoPaquetes(resumenCopys.infoDrawer.paquetes["internet&tv"]);
        }
        if (hasData(internet) && hasData(movil) && !hasData(tv)) {
            setInfoPaquetes(resumenCopys.infoDrawer.paquetes["internet&movil"]);
        }
        if (!hasData(internet) && hasData(movil) && hasData(tv)) {
            setInfoPaquetes(resumenCopys.infoDrawer.paquetes["tv&movil"]);
        }
        if (hasData(internet) && hasData(movil) && hasData(tv)) {
            setInfoPaquetes(resumenCopys.infoDrawer.paquetes["internet&tv&movil"]);
        }
    }, [internet, movil, resumenCopys.infoDrawer.paquetes, setCheckedPromotions, setInfoPaquetes, tv, userAnswers])

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function CheckPromotions() {
        setCheckedPromotions(true);
        onOpen()
    }

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
        } catch (error) {
            setCheckedPromotions(false);
            setPromoError(true);
            console.error("Error al obtener el token:", error);
        } finally {
        setLoading(false);
        }
    };


    return (
        <div className="xl:border xl:rounded-md xl:border-gray-150 w-full px-[16px] pt-[24px] pb-[32px] bg-gray-50 xl:bg-white-0">

            {!newSelection ?
                <button
                    className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-[48px] text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                    disabled
                >
                    {resumenCopys.boton.comprobarPromociones}
                </button>
                :

                <>
                    <div className="block xl:hidden">
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between mb-[16px]">
                                <div className="flex flex-col gap-[8px]">
                                    <div className="flex gap-[4px] font-normal text-base leading-[24px] text-gray-500 items-baseline">
                                        <h3 className="font-extrabold text-[32px] leading-[32px] text-black-0">
                                            {FormatCurrency(precioTotal)}
                                        </h3>
                                        <h5>{resumenCopys.infoDrawer.plazo}</h5>
                                        <p>|</p>
                                        <h5 className="font-bold">{infoPaquetes}</h5>
                                    </div>
                                    <div className="font-bold">{infoDrawerContent}</div>
                                </div>
                                <button
                                    className="w-[40px] h-[40px] rounded-full border-2 border-black-0 flex items-center justify-center"
                                    onClick={onOpen}
                                >
                                    <ArrowUpIcon />
                                </button>
                            </div>
                            {!checkedPromotions ?
                                <button
                                    className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-[48px] text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                                    onClick={() => {
                                            handleClick();
                                            CheckPromotions();
                                        }
                                    }
                                >
                                    {resumenCopys.boton.comprobarPromociones}
                                </button>
                                :
                                <ButtonGhost
                                    disabled={loading && promoError}
                                    classStyles={"py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-[48px] text-white-0 font-semibold leading-[24px] text-lg text-center"}
                                    text={resumenCopys.boton.contratar.titulo}
                                    href={resumenCopys.boton.contratar.url}
                                />
                            }
                        </div>
                    </div>
                    <Drawer
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        size="full"
                        placement="bottom"
                        hideCloseButton
                        classNames={{
                            header: "px-[16px] py-[24px]",
                            body: "px-[16px] py-0 gap-0",
                            footer: "w-full px-[16px] pt-[32px]"
                        }}
                    >
                        <DrawerContent>
                            {(onClose) => (
                                <>
                                    <DrawerHeader
                                        className="flex flex-row justify-between items-center"
                                    >
                                        <h3 className="font-bold text-xl leading-[24px] text-[#11181C]">{resumenCopys.titulo}</h3>
                                        <button
                                            className="w-[40px] h-[40px] rounded-full border-2 border-black-0 flex items-center justify-center"
                                            onClick={onClose}
                                        >
                                            <ArrowDownIcon />
                                        </button>
                                    </DrawerHeader>

                                    <DrawerBody>
                                        <ResumenContainerConfigurador />
                                    </DrawerBody>

                                    <DrawerFooter>
                                        <div className="flex flex-col w-full">
                                            {!checkedPromotions ?
                                                <button
                                                    className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-[48px] text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                                                    onClick={() => {
                                                        handleClick();
                                                        CheckPromotions();
                                                    }
                                                }
                                                >
                                                    {resumenCopys.boton.comprobarPromociones}
                                                </button>
                                                :
                                                <ButtonGhost
                                                    disabled={loading && promoError}
                                                    classStyles={"py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-[48px] text-white-0 font-semibold leading-[24px] text-lg"}
                                                    text={resumenCopys.boton.contratar.titulo}
                                                    href={resumenCopys.boton.contratar.url}
                                                />
                                            }
                                        </div>

                                    </DrawerFooter>
                                </>
                            )}
                        </DrawerContent>
                    </Drawer>

                    <div className="hidden xl:block">
                        <ResumenContainerConfigurador />
                    </div>
                </>
            }
        </div>
    )
}