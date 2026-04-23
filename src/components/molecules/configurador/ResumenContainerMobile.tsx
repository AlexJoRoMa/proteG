'use client'

import { internetComponentFields, movilComponentFields, tvComponentFields } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider"
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from "@heroui/react";
import { Button } from '@heroui/react';
import { useEffect, useState } from "react";
import ResumenContainerDesktop from "./ResumenContainerDesktop";
import { ResumenData } from "@/types/ResumenCompra";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { FormatCurrency } from "@/utils/Currency";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "@/constants/IconsConstants";
import { getOttCategoriesFromContentful, isComboCategory } from "@/utils/OttCategoriesHelper";
import izziDataLayerHelpers from "@/utils/izzi-data-layer-helpers";
import { EVENTS, CURRENCY } from "@/lib/tracking/constants";

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

export default function ResumenContainerMobile() {

    const { userAnswers, copysResumen, configuradorEntry, izziSelection } = useContent();
    const { precioTotal, coberturaData, setPromoData, infoPaquetes, setInfoPaquetes, setCheckedPromotions, checkedPromotions, globalIzziSelection } = useIzziContent();;
    const [loading, setLoading] = useState<boolean>(false);
    const [promoError, setPromoError] = useState(false);
    const [validComboCategories, setValidComboCategories] = useState<Set<string>>(new Set());
    const router = useRouter();

    const resumenCopys = copysResumen as ResumenData;
    const internet = userAnswers.internet as unknown as internetComponentFields | undefined;
    const tv = userAnswers.tv as unknown as tvComponentFields | undefined;
    const movil = userAnswers.movil as unknown as movilComponentFields | undefined;

    const hasInternet = hasData(internet);
    const hasTv = hasData(tv);
    const hasMovil = hasData(movil);
    const hasAnyMainProduct = hasInternet || hasTv || hasMovil;

    const descuentoTv = Math.abs((Number(userAnswers?.tv?.paquete?.precioPaquete)) - (Number(userAnswers?.tv?.paquete?.precioTachado)));
    const totalOttDescuentoCombo = izziSelection?.extrasMap?.ott?.reduce(
        (acc, ott) => acc + Number(ott.descuentoCombo?.monto || 0),
        0
    ) || 0;

    const ahorroCombinado = (descuentoTv || 0) + totalOttDescuentoCombo;

    useEffect(() => {
        setCheckedPromotions(false);
        setPromoData({});

        // Cargar las categorías válidas de combo desde Contentful
        const loadCategories = async () => {
            const categories = await getOttCategoriesFromContentful();
            setValidComboCategories(categories);
        };
        loadCategories();

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
    }, [internet, movil, resumenCopys.infoDrawer.paquetes, setCheckedPromotions, setInfoPaquetes, tv, userAnswers, setPromoData])

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function CheckPromotions() {
        if (!hasAnyMainProduct) return;
        setCheckedPromotions(true);
        onOpen()
    }

    const handleClick = async () => {
        if (!hasAnyMainProduct) {
            return;
        }

        setLoading(true);
        const extrasBody = [];


        if (izziSelection?.extrasMap) {
            izziSelection?.extrasMap?.ott?.map((extra) => {
                const isCombo = isComboCategory(extra.categoriaExtra, validComboCategories);
                extrasBody.push({
                    "extId": extra.idExtra,
                    "nuevaCantidad": 1,
                    "combo": isCombo
                })
            })
        }
        if (izziSelection?.extras) {
            extrasBody.push({
                "extId": izziSelection.extras?.idExtra,
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
                    "offnet": configuradorEntry?.offnetIzzi || configuradorEntry?.offnetSky
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

    function handleContratar() {
        if (!hasAnyMainProduct) {
            return;
        }
        if (globalIzziSelection && globalIzziSelection.idPaquete && precioTotal) {
            const { buildEcommerceLineItems, normalizeEcommerceValue, pushEcommerceEvent } = izziDataLayerHelpers;
            const ecommerceValue = normalizeEcommerceValue(precioTotal);

            const items = buildEcommerceLineItems(globalIzziSelection, {
                precioTotal: ecommerceValue,
                mainListId: "configurador",
                mainListName: "Configurador - plan principal",
                extrasListId: "configurador",
                extrasListName: "Configurador - extras",
            });

            pushEcommerceEvent(
                EVENTS.ADD_TO_CART,
                {
                    currency: CURRENCY,
                    value: ecommerceValue,
                    items,
                }
            );
        }

        setLoading(true);
        router.push(`${resumenCopys.boton.contratar.url}`)
    }

    return (
        <>
            <div className="w-full px-[16px] pt-[24px] bg-gray-50 pb-[32px]">

                {
                    !hasAnyMainProduct ?
                        <button
                            className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-[48px] text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                            disabled
                        >
                            {resumenCopys.boton.comprobarPromociones}
                        </button>
                        :

                        <>
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

                                        {
                                            ((internet && tv) ?
                                                (
                                                    <div className="flex gap-[4px] font-bold">
                                                        <h5>
                                                            {resumenCopys.informacion.promociones}
                                                        </h5>
                                                        <p className="text-green-700">
                                                            {FormatCurrency(ahorroCombinado)}
                                                        </p>
                                                    </div>
                                                ) :
                                                (
                                                    <h5 className="font-bold">
                                                        {resumenCopys.informacion.combinaciones}
                                                    </h5>
                                                )
                                            )
                                        }
                                    </div>
                                    <button
                                        className="w-[40px] h-[40px] rounded-full border-2 border-black-0 flex items-center justify-center"
                                        onClick={onOpen}
                                    >
                                        <ArrowUpIcon />
                                    </button>
                                </div>

                                {
                                    !checkedPromotions ?
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
                                        <Button
                                            isDisabled={loading || promoError}
                                            className={"py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-[48px] text-white-0 font-semibold leading-[24px] text-lg text-center"}
                                            onPress={handleContratar}
                                        >
                                            {resumenCopys.boton.contratar.titulo}
                                        </Button>
                                }

                            </div>

                            {/* Drawer de mobile */}

                            <Drawer
                                isOpen={isOpen}
                                onOpenChange={onOpenChange}
                                size="2xl"
                                placement="bottom"
                                hideCloseButton
                                classNames={{
                                    header: "px-[16px] pt-[24px] pb-[32px]",
                                    body: "px-[16px] py-0 gap-0",
                                    footer: "w-full px-[16px] pb-[32px] pt-[5px]"
                                }}
                            >
                                <DrawerContent>
                                    {(onClose) => (
                                        <>
                                            {
                                                loading &&
                                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
                                                    <div className="w-[104px] h-[104px]">
                                                        <LoaderIcon />
                                                    </div>
                                                </div>
                                            }

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
                                                <ResumenContainerDesktop />
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
                                                        <Button
                                                            isDisabled={loading || promoError}
                                                            className={"py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-[48px] text-white-0 font-semibold leading-[24px] text-lg"}
                                                            onPress={handleContratar}
                                                        >
                                                            {resumenCopys.boton.contratar.titulo}
                                                        </Button>
                                                    }
                                                </div>
                                            </DrawerFooter>

                                        </>
                                    )}
                                </DrawerContent>

                            </Drawer>
                        </>
                }
            </div>
        </>
    )
}