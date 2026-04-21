import { useIzziContent } from "@/components/providers/IzziProvider";
import { Button } from "@heroui/react";
import { getOttCategoriesFromContentful, isComboCategory } from "@/utils/OttCategoriesHelper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useContent } from "@/utils/ConfiguradorProvider";
import { ResumenData } from "@/types/ResumenCompra";

export default function BotonContratarConfigurador({loading, setLoading}: {loading: boolean, setLoading: (value:boolean) => void}) {
    const { configuradorEntry, izziSelection, copysResumen } = useContent();
    const { checkedPromotions, setCheckedPromotions, coberturaData, setRpt, setOffnetIzzi, setOffnetSky, setPromoData, } = useIzziContent();
    const router = useRouter();

    const [promoError, setPromoError] = useState(false);
    const [validComboCategories, setValidComboCategories] = useState<Set<string>>(new Set());

    const resumenCopys = copysResumen as ResumenData;

    useEffect(() => {
        // Cargar las categorías válidas de combo desde Contentful
        const loadCategories = async () => {
            const categories = await getOttCategoriesFromContentful();
            setValidComboCategories(categories);
        };
        loadCategories();
    }, []);

    const handleClick = async () => {
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
                    "offnet": configuradorEntry?.offnetIzzi && configuradorEntry?.offnetSky
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
        setLoading(true);
        router.push(`${resumenCopys.boton.contratar.url}`)
    }

    return (
        <div>
            {
                !checkedPromotions ?
                    <Button
                        className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                        onPress={handleClick}
                        isDisabled={loading}
                    >
                        {resumenCopys.boton.comprobarPromociones}
                    </Button>
                    :
                    <Button
                        className={"py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"}
                        onPress={handleContratar}
                        isDisabled={loading && promoError}
                    >
                        {resumenCopys.boton.contratar.titulo}
                    </Button>
            }
        </div>
    )
}