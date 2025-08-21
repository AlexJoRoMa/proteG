'use client'

import { internetComponentFields, movilComponentFields, ResumenData, tvComponentFields } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider"
import ResumenContent from "./resumenContent";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from "@heroui/react";
import ButtonGhost from "@/components/atoms/ButtonGhost";
import { useEffect, useState } from "react";

export const ArrowUpIcon = (props: any) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" >
            <path d="M19 15L12 9L5 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export const ArrowDownIcon = (props: any) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 9L12 15L5 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function hasData(obj: unknown): boolean {
    return !!obj && typeof obj === "object" && Object.keys(obj as object).length > 0;
}

export default function ResumenPedido() {

    const { userAnswers, copysResumen, setCheckedPromotions, checkedPromotions, infoDrawerContent } = useContent();
    const [infoPaquetes, setInfoPaquetes] = useState<string>("");

    const resumenCopys = copysResumen as ResumenData;
    const internet = userAnswers.internet as unknown as internetComponentFields | undefined;
    const tv = userAnswers.tv as unknown as tvComponentFields | undefined;
    const movil = userAnswers.movil as unknown as movilComponentFields | undefined;

    const newSelection = (userAnswers && userAnswers !== null && Object.keys(userAnswers).length > 0)
    console.log('newSelection', newSelection)
    console.log('user', userAnswers)

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
    }, [userAnswers])

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function CheckPromotions() {
        setCheckedPromotions(true);
        onOpen()
    }


    return (
        <div className="md:border md:rounded-md md:border-gray-150 w-full px-[16px] pt-[24px] pb-[32px] bg-gray-50 md:bg-white-0">

            {!newSelection ?
                <button
                    className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-[48px] text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                    disabled
                >
                    {resumenCopys.boton.comprobarPromociones}
                </button>
                :

                <>
                    <div className="block md:hidden">
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between mb-[16px]">
                                <div className="flex flex-col gap-[8px]">
                                    <div className="flex gap-[4px] font-normal text-base leading-[24px] text-gray-500 items-baseline">
                                        <h3 className="font-extrabold text-[32px] leading-[32px] text-black-0">
                                            $XXXX
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
                                    onClick={() => CheckPromotions()}
                                >
                                    {resumenCopys.boton.comprobarPromociones}
                                </button>
                                :
                                <ButtonGhost
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
                                        <ResumenContent />
                                    </DrawerBody>

                                    <DrawerFooter>
                                        <div className="flex flex-col w-full">
                                            {!checkedPromotions ?
                                                <button
                                                    className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-[48px] text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                                                    onClick={() => CheckPromotions()}
                                                >
                                                    {resumenCopys.boton.comprobarPromociones}
                                                </button>
                                                :
                                                <ButtonGhost
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

                    <div className="hidden md:block">
                        <ResumenContent />
                    </div>
                </>
            }
        </div>
    )
}