'use client'

import { internetComponentFields, movilComponentFields, ResumenData, tvComponentFields } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { Alert } from "@heroui/react";
import { useEffect, useState } from "react";

export const CloseIcon = (props: any) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6.00005L6 18M5.99995 6L17.9999 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function hasData(obj: unknown): boolean {
    return !!obj && typeof obj === "object" && Object.keys(obj as object).length > 0;
}

export default function ResumenInfo() {
    const { userAnswers, copysResumen, setInfoDrawerContent, cobertura } = useContent();
    const resumenCopys = copysResumen as ResumenData;

    const internet = userAnswers.internet as unknown as internetComponentFields | undefined;
    const tv = userAnswers.tv as unknown as tvComponentFields | undefined;
    const movil = userAnswers.movil as unknown as movilComponentFields | undefined;

    const [notificationContent, setNotificationContent] = useState<{ title: string, description: string }>({ title: "", description: "" });
    const [isFirstLoad, setIsFirstLoad] = useState({ configurador: true, tv: true, tvLight: true, movil: true });
    const [isVisible, setIsVisible] = useState(false);

    const showNotification = (title: string, description: string) => {
        setNotificationContent({ title, description });
        setIsVisible(true);

        setTimeout(() => setIsVisible(false), 4000);
    }

    useEffect(() => {
        if (isFirstLoad.configurador) {
            if (cobertura) {
                showNotification(resumenCopys.info.existeCobertura, "");
            } else {
                showNotification(
                    resumenCopys.info.sinCobertura.titulo,
                    resumenCopys.info.sinCobertura.subTitulo
                )
            }
            setIsFirstLoad((prev) => {
                return {
                    ...prev,
                    configurador: false
                }
            });
            return;
        }
        if (cobertura) {
            if (hasData(internet) && !hasData(tv) && !hasData(movil)) {
                setInfoDrawerContent(resumenCopys.infoDrawer.nuevoFlujo)
            }
            if (
                (!hasData(internet) && !hasData(movil) && hasData(tv)) || (hasData(internet) && hasData(tv) && !hasData(movil))
            ) {
                if (isFirstLoad.tv || isFirstLoad.tvLight) {
                    if (tv?.paquete.titulo.includes('light')) {
                        isFirstLoad.tvLight &&
                            showNotification(resumenCopys.info.tvLight, "");
                        setIsFirstLoad((prev) => {
                            return {
                                ...prev,
                                tvLight: false
                            }
                        });
                    } else {
                        isFirstLoad.tv &&
                            showNotification(`${resumenCopys.info.combinacion.prevPrice} $XXXX ${resumenCopys.info.combinacion.postPrice}`, "");
                        setIsFirstLoad((prev) => {
                            return {
                                ...prev,
                                tv: false
                            }
                        });
                    }
                }
                if (!(tv?.paquete.titulo.includes('light'))) {
                    setInfoDrawerContent(`${resumenCopys.infoDrawer.combinacion.prePrice} $XXXX ${resumenCopys.infoDrawer.combinacion.postPrice}`)
                } else {
                    setInfoDrawerContent(resumenCopys.infoDrawer.nuevoFlujo)
                }
            } else if (
                hasData(internet) && hasData(tv) && hasData(movil)
            ) {
                if (isFirstLoad.movil) {
                    showNotification(resumenCopys.info.portabilidad, "");
                    setIsFirstLoad((prev) => {
                        return {
                            ...prev,
                            movil: false
                        }
                    });
                }
                setInfoDrawerContent(`${resumenCopys.infoDrawer.combinacion.prePrice} $XXXX ${resumenCopys.infoDrawer.combinacion.postPrice}`)
            } else {
                setIsVisible(false);
            }
        } else {
            if ((!hasData(movil) && hasData(tv))) {
                if (isFirstLoad.tv || isFirstLoad.tvLight) {
                    if (tv?.paquete.titulo.includes('light')) {
                        isFirstLoad.tvLight &&
                            showNotification(resumenCopys.info.tvLight, "")
                        setIsFirstLoad((prev) => {
                            return {
                                ...prev,
                                tvLight: false
                            }
                        });
                        return;
                    } else {
                        isFirstLoad.tv &&
                        setIsFirstLoad((prev) => {
                            return {
                                ...prev,
                                tv: false
                            }
                        });
                    }
                }
                if (!(tv?.paquete.titulo.includes('light'))) {
                    setInfoDrawerContent(`${resumenCopys.infoDrawer.combinacion.prePrice} $XXXX ${resumenCopys.infoDrawer.combinacion.postPrice}`)
                } else {
                    setInfoDrawerContent(resumenCopys.infoDrawer.nuevoFlujo)
                }
            } else if ((hasData(tv) && hasData(movil)) || (!hasData(tv) && hasData(movil))) {
                if (isFirstLoad.movil) {
                    showNotification(resumenCopys.info.portabilidad, "");
                    setIsFirstLoad((prev) => {
                        return {
                            ...prev,
                            movil: false
                        }
                    });
                }
                setInfoDrawerContent(`${resumenCopys.infoDrawer.combinacion.prePrice} $XXXX ${resumenCopys.infoDrawer.combinacion.postPrice}`)
            }
        }

    }, [userAnswers])

    return (
        <>
            <div className="flex flex-col">
                {isVisible && (
                    <Alert
                        description={notificationContent.description}
                        isVisible={isVisible}
                        title={notificationContent.title}
                        variant="solid"
                        onClose={() => setIsVisible(false)}
                        radius="sm"
                        hideIcon={true}
                        endContent={
                            <div onClick={() => setIsVisible(false)}>
                                <CloseIcon />
                            </div>
                        }
                        classNames={{
                            base: "flex flex-row gap-[16px] w-full h-auto bg-blue-700 p-[16px] shadow-[0_4px_10px_0_rgba(0, 80, 179, 0.35)]",
                            title: "font-semibold text-lg text-white-0 leading-[24px]",
                            description: "font-normal text-sm text-white-0",
                            mainWrapper: "flex flex-col gap-[16px]",
                            closeButton: "hidden"
                        }}
                    />
                )}
            </div>
        </>
    );
}

