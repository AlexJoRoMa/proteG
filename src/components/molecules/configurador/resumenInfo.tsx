'use client'

import { CloseIcon } from "@/constants/IconsConstants";
import { internetComponentFields, movilComponentFields, tvComponentFields } from "@/types/ConfiguradorTypes";
import { ResumenData } from "@/types/ResumenCompra";
import { useContent } from "@/utils/ConfiguradorProvider";
import { FormatCurrency } from "@/utils/Currency";
import { Alert } from "@heroui/react";
import { useEffect, useState } from "react";

function hasData(obj: unknown): boolean {
    return !!obj && typeof obj === "object" && Object.keys(obj as object).length > 0;
}

type Escenarios =
    "COBERTURA" |
    "SIN_COBERTURA" |
    "TV_NORMAL" |
    "TV_LIGHT" |
    "TRIPLE_PLAY" |
    "PORTABILIDAD"

function getEscenarios({ cobertura, internet, tv, movil }: { cobertura: boolean, internet?: internetComponentFields, tv?: tvComponentFields, movil?: movilComponentFields }): Escenarios {
    if (!cobertura) {
        if (hasData(tv) && !hasData(movil)) {
            if (tv?.paquete.titulo.includes("light")) {
                return "TV_LIGHT";
            } else {
                return "TV_NORMAL";
            }
        }

        if ((hasData(movil) && !hasData(tv)) || (hasData(tv) && hasData(movil))) {
            return "PORTABILIDAD";
        }

        return "SIN_COBERTURA";

    } else {

        if (hasData(tv) && !hasData(movil) && !hasData(internet)) {
            if (tv?.paquete.titulo.includes("light")) {
                return "TV_LIGHT";
            } else {
                return "TV_NORMAL";
            }
        }

        if (hasData(internet) && hasData(tv) && !hasData(movil)) {
            return "TRIPLE_PLAY";
        }

        if ((hasData(movil) && !hasData(tv) && !hasData(internet)) || (hasData(tv) && hasData(movil) && hasData(internet)) || (hasData(movil) && hasData(internet) && !hasData(tv))) {
            return "PORTABILIDAD";
        }

        return "COBERTURA";
    }
}

export default function ResumenInfo() {

    // Componente de popups - notificaciones

    const { userAnswers, copysResumen, setInfoDrawerContent, cobertura } = useContent();
    const resumenCopys = copysResumen as ResumenData;

    const internet = userAnswers.internet as unknown as internetComponentFields | undefined;
    const tv = userAnswers.tv as unknown as tvComponentFields | undefined;
    const movil = userAnswers.movil as unknown as movilComponentFields | undefined;
    const ahorroTv = Math.abs((Number(tv?.paquete?.precioPaquete)) - (Number(tv?.paquete?.precioTachado)));
    const precioCombinado = (ahorroTv || 0);


    const [notificationContent, setNotificationContent] = useState<{ title: string, description: string }>({ title: "", description: "" });
    const [isVisible, setIsVisible] = useState(false);
    const [seenEscenarios, setSeenEscenarios] = useState<Set<Escenarios>>(new Set());

    const escenario = getEscenarios({ cobertura, internet, tv, movil });

    const isFirstTime = (escenario: Escenarios) => escenario && !seenEscenarios.has(escenario);
    const markAsSeen = (escenario: Escenarios) => {
        if (!escenario) return;
        setSeenEscenarios(prev => new Set(prev).add(escenario));
    }

    const showNotification = (title: string, description: string) => {
        setNotificationContent({ title, description });
        setIsVisible(true);

        setTimeout(() => setIsVisible(false), 4000);
    }

    useEffect(() => {
        if (!escenario) return;

        // NOTIFICACIONES - POP UP
        if (isFirstTime(escenario)) {
            switch (escenario) {
                case "COBERTURA":
                    showNotification(resumenCopys.info.existeCobertura, "");
                    break;

                case "SIN_COBERTURA":
                    showNotification(
                        resumenCopys.info.sinCobertura.titulo,
                        resumenCopys.info.sinCobertura.subTitulo
                    );
                    break;

                case "TV_LIGHT":
                    showNotification(resumenCopys.info.tvLight, "");
                    break;

                case "TRIPLE_PLAY":
                    if (precioCombinado) {
                        showNotification(
                            `${resumenCopys.info.combinacion.prevPrice} ${FormatCurrency(precioCombinado)} ${resumenCopys.info.combinacion.postPrice}`,
                            ""
                        );
                    }
                    break;

                case "PORTABILIDAD":
                    showNotification(resumenCopys.info.portabilidad, "");
                    break;
            }

            markAsSeen(escenario);
        }

        // COPYS DRAWER - MOBILE
        switch (escenario) {
            case "COBERTURA":
            case "TV_NORMAL":
                setInfoDrawerContent(resumenCopys.infoDrawer.nuevoFlujo);
                break;

            case "TRIPLE_PLAY":
            case "PORTABILIDAD":
                if (precioCombinado) {
                    setInfoDrawerContent(
                        `${resumenCopys.infoDrawer.combinacion.prePrice} ${FormatCurrency(precioCombinado)} ${resumenCopys.infoDrawer.combinacion.postPrice}`
                    );
                }
                break;
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [escenario, precioCombinado]);

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

