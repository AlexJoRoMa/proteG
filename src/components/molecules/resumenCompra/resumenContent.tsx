import { FormatCurrency, FormatPromotions } from "@/utils/Currency";
import { ResumenContentProps, ResumenData } from "@/types/ResumenCompra";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { useEffect, useMemo, useState } from "react";
import { internetComponentFields, Promos, tvComponentFields } from "@/types/ConfiguradorTypes";
import { mesIds } from "@/constants/ResumenConstants";
import { CircleCheckGreen } from "@/constants/IconsConstants";

function calcularPromos(promos: Promos[] | undefined) {
    const maxMeses = mesIds.length;
    const meses = Array.from({ length: maxMeses }, () => ({
        totalPromo: 0,
        promos: [] as Promos[],
    }));

    if (!promos) return [];

    promos.forEach((promo) => {
        const inicio = Number(promo.mesInicio) - 1;
        const duracion = Number(promo.meses);
        const esPermanante = promo.permanente === "SI" || duracion === 0;

        let hasta = esPermanante ? maxMeses : inicio + duracion;
        if (hasta > maxMeses) hasta = maxMeses;

        for (let i = inicio; i < hasta; i++) {
            meses[i].totalPromo += Number(promo.promoPrice);
            meses[i].promos.push(promo);
        }
    });
    return meses;
}

function obtenerArray(
    mesesPromos: { totalPromo: number }[],
    totalSinDescuento: number,
    ahorroCombinado: number,
    validateSwitch: boolean,
    precioTotal: number,
    resumenCopys: ResumenData
) {

    let ultimoMes = 0;
    mesesPromos.forEach((mes, index) => {
        if (mes.totalPromo !== 0) {
            ultimoMes = index + 1;
        }
    });

    if (ultimoMes === 0) ultimoMes = 1;

    let primerMesCero = null;

    for (let i = ultimoMes; i < mesesPromos.length; i++) {
        if (mesesPromos[i].totalPromo === 0) {
            primerMesCero = i + 1;
            break;
        }
    }

    const tope = primerMesCero ?? ultimoMes;
    const relevantes = mesesPromos.slice(0, tope);
    const resultado: { mesNumero: number; mesId: string; totalPromo: number; }[] = [];
    let ultimoValor: number | null = null;
    const descuentoMeses: { proximoMes: string; precioPago: number; }[] = [];

    relevantes.forEach((mes, index) => {
        const valorActual = mes.totalPromo;

        if (index !== 0 && valorActual !== ultimoValor) {
            resultado.push({
                mesNumero: index + 1,
                mesId: mesIds[index],
                totalPromo: valorActual,
            });
            ultimoValor = valorActual;
        }
    });

    resultado.forEach((item) => {
        const precioMes = validateSwitch
            ? totalSinDescuento - ahorroCombinado + item.totalPromo - 50
            : totalSinDescuento - ahorroCombinado + item.totalPromo;

        const copyMes = resumenCopys.ahorro.meses[item.mesId];

        descuentoMeses.push({
            proximoMes: copyMes,
            precioPago: precioMes,
        })
    });

    const filtrado = descuentoMeses.filter((item, index) => {
        const esPrimerItem = index === 0;
        const esSimilarTotal = item.precioPago === precioTotal;

        if (esPrimerItem && esSimilarTotal) return false

        return true;
    });

    return filtrado;

}

export default function ResumenContent({ copys, userSelection }: ResumenContentProps) {

    const resumenCopys = copys;

    const { promoData, globalIzziSelection, setPrecioTotal, setPrecioCombinado, checkSwitch, setTotalSinDescuento, checkedPromotions, setAhorroTotal, globalUserAnswers } = useIzziContent();
    const [validateSwitch, setValidateSwitch] = useState(checkSwitch);
    const [priceTotal, setPriceTotal] = useState(0);

    const internet = globalUserAnswers.internet as unknown as internetComponentFields | undefined;
    const tv = globalUserAnswers.tv as unknown as tvComponentFields | undefined;

    useEffect(() => {
        setValidateSwitch(checkSwitch)
    }, [checkSwitch])

    useEffect(() => {
        const handleSwitch = (e: Event) => {
            const customEvent = e as CustomEvent<boolean>;
            setValidateSwitch(customEvent.detail)
        };

        window.addEventListener('switch-change', handleSwitch);
        return () => window.removeEventListener('switch-change', handleSwitch);
    }, [])


    /* const ottPromos = promoData?.promos?.filter(promo =>
        globalIzziSelection?.extrasMap?.ott?.some(extra => extra.nombreSiebel === promo.product)
    ); */

    const totalOttPrice = globalIzziSelection?.extrasMap?.ott?.reduce(
        (acc, promo) => acc + Number(promo.costo),
        0
    );

    const totalPromoPrice = promoData?.promos?.filter((promo) => promo.visible === true).reduce(
        (acc, promo) => acc + Number(promo.promoPrice),
        0
    );

    const promotions = promoData?.promos;
    const promoVisible = promotions?.filter((promo) => promo.visible === true && promo.promoPrice !== 0);
    const descuentoTv = Math.abs((Number(userSelection?.tv?.paquete?.precioPaquete)) - (Number(userSelection?.tv?.paquete?.precioTachado)));
    const totalOttDescuentoCombo = globalIzziSelection?.extrasMap?.ott?.reduce(
        (acc, ott) => acc + Number(ott.descuentoCombo?.monto || 0),
        0
    ) || 0;

    const ahorroCombinado = (descuentoTv || 0) + totalOttDescuentoCombo;

    const totalSinDescuento = Number(userSelection?.internet?.paquete?.precioTachado || 0)
        + Number(userSelection?.movil?.paquete?.precioPaquete || 0)
        + Number(userSelection?.tv?.paquete?.precioTachado || userSelection?.tv?.paquete?.precioPaquete || 0)
        + (totalOttPrice || 0);

    const precioTotal = checkedPromotions ?
        promoData.promos ?
            totalSinDescuento - ahorroCombinado - (Math.abs(Number(totalPromoPrice)) || 0) :
            totalSinDescuento - ahorroCombinado :
        totalSinDescuento;

    const ahorroTotal = totalSinDescuento - precioTotal;

    const promoMeses = calcularPromos(promotions);
    const descuentoMeses = useMemo(() => {
        return obtenerArray(
            promoMeses,
            totalSinDescuento,
            ahorroCombinado,
            validateSwitch,
            priceTotal,
            resumenCopys
        );
    }, [promoMeses, totalSinDescuento, ahorroCombinado, validateSwitch, priceTotal, resumenCopys]);
    useEffect(() => {
        setTotalSinDescuento(totalSinDescuento);
        setAhorroTotal(ahorroTotal);
        setPrecioCombinado(ahorroCombinado as number);
        setPrecioTotal(priceTotal as number);
    }, [ahorroCombinado, ahorroTotal, priceTotal, totalSinDescuento, setAhorroTotal, setPrecioCombinado, setPrecioTotal, setTotalSinDescuento]);

    useEffect(() => {
        if (validateSwitch) {
            setPriceTotal(precioTotal - 50)
        } else {
            setPriceTotal(precioTotal)
        }
    }, [validateSwitch, precioTotal])


    return (
        <section className="flex flex-col gap-[32px] pb-[20px] pt-0 xl:pb-0">

            <div className="flex flex-col">
                <div className={`flex justify-between w-full ${checkedPromotions ? "mt-[24px]" : "mt-0"}`}>
                    <h2 className="font-bold text-lg leading-[24px] xl:text-xl xl:leading-[40px]">
                        {resumenCopys.total.titulo}
                    </h2>
                    <div className="flex flex-col items-end">
                        <h2 className="leading-[40px] text-[32px] font-bold">
                            {
                                checkedPromotions ? (
                                    FormatPromotions(Number(priceTotal))
                                ) : (
                                    FormatCurrency(Number(priceTotal))
                                )
                            }
                        </h2>
                        {
                            checkedPromotions && (
                                <h1 className="font-normal text-sm leading-[16px] text-gray-200">
                                    {resumenCopys.total.primerMes}
                                </h1>
                            )
                        }
                    </div>
                </div>

                {
                    checkedPromotions && (

                        <div className="flex flex-col gap-[20px]">

                            <div className="flex justify-between items-center w-full mt-[12px]">
                                <div className="flex gap-[8px] items-baseline">
                                    <h2 className="font-bold text-lg leading-[24px]">
                                        {resumenCopys.total.sinDescuentos}
                                    </h2>
                                    <p className="font-normal text-lg leading-[24px] line-through text-gray-200">
                                        {FormatPromotions(Number(totalSinDescuento))}
                                    </p>
                                </div>

                                <div className="flex gap-[8px] rounded-md bg-yellow-100 py-[8px] px-[12px] font-bold text-lg leading-[24px]">
                                    <h2>
                                        {resumenCopys.ahorro.titulo}
                                    </h2>
                                    <p>
                                        {
                                            FormatPromotions(Number(ahorroTotal))
                                        }
                                    </p>
                                </div>
                            </div>

                            {
                                (checkedPromotions && (ahorroCombinado !== 0 || (promoVisible && promoVisible?.length > 0)) || validateSwitch) && (
                                    <div className="flex flex-col gap-[20px] py-[16px] px-[12px] rounded-md border-1 border-green-700">

                                        <div className="w-full font-bold leading-[24px] text-base space-y-5">
                                            {
                                                (checkedPromotions && (ahorroCombinado !== 0 || (promoVisible && promoVisible?.length > 0))) && (
                                                    <div className="flex flex-row justify-between w-full">
                                                        <div className="flex gap-[4px]">
                                                            <div className="w-[24px] h-[24px]">
                                                                <CircleCheckGreen />
                                                            </div>
                                                            <h5>{resumenCopys.ahorro.paquete}</h5>
                                                        </div>
                                                        <h5 className="text-right text-green-700">-{FormatPromotions(ahorroCombinado)}</h5>
                                                    </div>
                                                )
                                            }

                                            {
                                                promoVisible?.map((promo, index) => {
                                                    return (
                                                        <div key={index} className="flex justify-between w-full">
                                                            <div className="flex gap-[4px]">
                                                                <div className="w-[24px] h-[24px]">
                                                                    <CircleCheckGreen />
                                                                </div>
                                                                <h5 className="text-left mr-[8px]">{promo.promoName}</h5>
                                                            </div>
                                                            {/* <h5 className="text-right">-{FormatPromotions(Math.abs(Number(promo.promoPrice)))}</h5> */}
                                                            <h5 className="text-right text-green-700">{FormatPromotions(promo.promoPrice)}</h5>
                                                        </div>
                                                    )
                                                })
                                            }

                                            {
                                                validateSwitch &&
                                                (
                                                    <div className="flex justify-between w-full">
                                                        <div className="flex gap-[4px]">
                                                            <div className="w-[24px] h-[24px]">
                                                                <CircleCheckGreen />
                                                            </div>
                                                            <h5 className="text-left mr-[8px]">
                                                                {resumenCopys.ahorro.domiciliacion.descuento}
                                                            </h5>
                                                        </div>

                                                        <h5 className="text-right text-green-700">-{FormatPromotions(Number(50))}</h5>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>

            {
                !checkedPromotions && ((internet && tv) ?
                    (
                        <div className="flex gap-[4px] py-[16px] px-[12px] rounded-md border-1 border-green-700">
                            <h1 className="font-bold text-base leading-[24px]">
                                {resumenCopys.informacion.promociones}
                            </h1>
                            <p className="font-bold text-base leading-[24px] text-green-700">
                                {FormatCurrency(ahorroCombinado)}
                            </p>
                        </div>
                    ) :
                    (
                        <div className="py-[16px] px-[12px] rounded-md border-1 border-green-700">
                            <h1 className="font-bold text-base leading-[24px]">
                                {resumenCopys.informacion.combinaciones}
                            </h1>
                        </div>
                    )
                )
            }


            {
                (descuentoMeses.length > 0 && checkedPromotions) &&
                <div className="flex flex-col py-[16px] px-[12px] rounded-md gap-[20px] bg-gray-50">
                    <h1 className="font-bold text-base xl:text-lg leading-[24px]">
                        {resumenCopys.ahorro.proximosPagos}
                    </h1>
                    {
                        descuentoMeses.map((item, index) => {

                            return (
                                <div key={index} className="flex justify-between w-full font-normal leading-[24px] text-base space-y-2">
                                    <h5>{item.proximoMes}</h5>
                                    <h5>{FormatPromotions(item.precioPago)}</h5>
                                </div>
                            )
                        })
                    }
                </div>
            }

        </section>
    )
}
