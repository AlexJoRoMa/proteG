import { useIzziContent } from "@/components/providers/IzziProvider";
import { Button } from "@heroui/react";
import { getOttCategoriesFromContentful, isComboCategory } from "@/utils/OttCategoriesHelper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useContent } from "@/utils/ConfiguradorProvider";
import { ResumenData } from "@/types/ResumenCompra";
import { internetComponentFields, movilComponentFields, tvComponentFields } from "@/types/ConfiguradorTypes";
import izziDataLayerHelpers from "@/utils/izzi-data-layer-helpers";
import { EVENTS, CURRENCY } from "@/lib/tracking/constants";
import { motion, useTime, useTransform } from "framer-motion";

function hasData(obj: unknown): boolean {
    return !!obj && typeof obj === "object" && Object.keys(obj as object).length > 0;
}

export default function BotonContratarConfigurador({ loading, setLoading }: { loading: boolean, setLoading: (value: boolean) => void }) {
    const { configuradorEntry, izziSelection, copysResumen, userAnswers } = useContent();
    const { checkedPromotions, setCheckedPromotions, coberturaData, setRpt, setOffnetIzzi, setOffnetSky, setPromoData, globalIzziSelection, precioTotal, globalUserAnswers } = useIzziContent();
    const router = useRouter();

    const [promoError, setPromoError] = useState(false);
    const [validComboCategories, setValidComboCategories] = useState<Set<string>>(new Set());
    const [newSelection, setNewSelection] = useState<boolean>(false);

    const resumenCopys = copysResumen as ResumenData;

    const internet = userAnswers.internet as unknown as internetComponentFields | undefined;
    const tv = userAnswers.tv as unknown as tvComponentFields | undefined;
    const movil = userAnswers.movil as unknown as movilComponentFields | undefined;

    const hasInternet = hasData(internet);
    const hasTv = hasData(tv);
    const hasMovil = hasData(movil);
    const hasAnyMainProduct = hasInternet || hasTv || hasMovil;


    useEffect(() => {
        // Cargar las categorías válidas de combo desde Contentful
        const loadCategories = async () => {
            const categories = await getOttCategoriesFromContentful();
            setValidComboCategories(categories);
        };
        loadCategories();
    }, []);

    useEffect(() => {

        setNewSelection(true);

        const timer = setTimeout(() => {
            setNewSelection(false);
        }, 3000);

        return () => clearTimeout(timer);

    }, [globalUserAnswers]);

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
            setRpt(configuradorEntry?.rptCode as string);
            setOffnetIzzi(configuradorEntry?.offnetIzzi as boolean);
            setOffnetSky(configuradorEntry?.offnetSky as boolean);
            setCheckedPromotions(true);
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

    const time = useTime();

    /* time cuenta en milisegundos, tiempo que tarda en dar un ciclo, cuantos giros hacer, clamp permite el loop de la animacion */
    const rotate = useTransform(time, [0, 1000], [0, 360], {
        clamp: false
    });

    /* se le puede agregar o quitar la cantidad de colores que se quiera, esto para ayudar al bucle visual */
    const rotatingBG = useTransform(rotate, (r) => {
        return `conic-gradient(from ${r}deg, #ff6c07, #CE32A3, #3CB594, #ff6c07)`;
    })

    const shouldAnimate = newSelection && !loading;

    return (
        <div>
            {
                !checkedPromotions ?
                    <div className=" w-full flex flex-col items-center justify-center">
                        <div className="relative w-full">
                            <Button
                                className={`relative z-10 py-[12px] px-[16px] bg-black-0 border-black-0 ${newSelection ? "rounded-sm" : "rounded-md"} w-full h-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50`}
                                onPress={handleClick}
                                isDisabled={loading}
                            >
                                {resumenCopys.boton.comprobarPromociones}
                            </Button>

                            {/* fondo animado , inset es el ancho del borde */}
                            {
                                shouldAnimate && (
                                    <motion.div
                                        className={`absolute -inset-1 rounded-md z-0`}
                                        style={{
                                            background: newSelection ? rotatingBG : "#000"
                                        }}
                                    />
                                )}
                        </div>
                    </div>

                    :
                    <Button
                        className={"py-[12px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"}
                        onPress={handleContratar}
                        isDisabled={loading && promoError}
                    >
                        {resumenCopys.boton.contratar.titulo}
                    </Button>
            }
        </div>
    )
}