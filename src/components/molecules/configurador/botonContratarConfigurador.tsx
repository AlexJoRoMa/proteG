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

function hasData(obj: unknown): boolean {
    return !!obj && typeof obj === "object" && Object.keys(obj as object).length > 0;
}

export default function BotonContratarConfigurador({ loading, setLoading }: { loading: boolean, setLoading: (value: boolean) => void }) {
    const { configuradorEntry, izziSelection, copysResumen, userAnswers } = useContent();
    const { checkedPromotions, setCheckedPromotions, coberturaData, setRpt, setOffnetIzzi, setOffnetSky, setPromoData, globalIzziSelection, precioTotal } = useIzziContent();
    const router = useRouter();

    const [promoError, setPromoError] = useState(false);
    const [validComboCategories, setValidComboCategories] = useState<Set<string>>(new Set());

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

    return (
        <div>
            {
                !checkedPromotions ?
                    <Button
                        className="py-[12px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                        onPress={handleClick}
                        isDisabled={loading}
                    >
                        {resumenCopys.boton.comprobarPromociones}
                    </Button>
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