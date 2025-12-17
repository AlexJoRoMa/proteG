import ResumenPaquetes from "./resumenPaquetes";
import { FormatCurrency } from "@/utils/Currency";
import { ResumenContentProps } from "@/types/ResumenCompra";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { useEffect } from "react";
import { Promos } from "@/types/ConfiguradorTypes";
import { mesIds } from "@/constants/ResumenConstants";

function calcularPromos(promos: Promos[] | undefined) {
    const meses = Array.from({ length: 12 }, () => ({
        totalPromo: 0,
        promos: [] as Promos[],
    }));

    if (!promos) return [];

    promos.forEach((promo) => {
        const inicio = Number(promo.mesInicio) - 1;
        const duracion = Number(promo.meses);
        const esPermanante = promo.permanente === "SI" || duracion === 0;

        const desde = inicio;
        let hasta = esPermanante ? 12 : inicio + duracion;
        if (hasta > 12) hasta = 12;

        for (let i = desde; i < hasta; i++) {
            meses[i].totalPromo += Number(promo.promoPrice);
            meses[i].promos.push(promo);
        }
    });
    return meses;
}

function obtenerArray(mesesPromos: { totalPromo: number }[]) {

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

    return resultado;
}

export default function ResumenContent({ copys, userSelection }: ResumenContentProps) {

    const resumenCopys = copys;
    const userAnswers = userSelection;

    const { promoData, globalIzziSelection, setPrecioTotal, setPrecioCombinado } = useIzziContent();
    const { globalCheckedPromotions, setAhorroTotal } = useIzziContent();


    const ottPromos = promoData?.promos?.filter(promo =>
        globalIzziSelection?.extrasMap?.ott?.some(extra => extra.nombreSiebel === promo.product)
    );

    const totalOttPrice = globalIzziSelection?.extrasMap?.ott?.reduce(
        (acc, promo) => acc + Number(promo.costo),
        0
    );

    const totalPromoPrice = promoData?.promos?.filter((promo) => promo.visible === true).reduce(
        (acc, promo) => acc + Number(promo.promoPrice),
        0
    );

    const promotions = promoData?.promos;
    const promoVisible = promotions?.filter((promo) => promo.visible === true && promo.promoPrice !== "0");
    const pagoAnticipado = promoData?.promos?.find(promo => promo.promoName.toLowerCase().includes('pago anticipado'));
    const totalAfterPromos = Math.abs(Number((pagoAnticipado?.promoPrice || 0)));
    const descuentoTv = Math.abs((Number(userSelection?.tv?.paquete?.precioPaquete)) - (Number(userSelection?.tv?.paquete?.precioTachado)));

    const ahorroCombinado = (descuentoTv || 0);

    const totalSinDescuento = Number(userSelection?.internet?.paquete?.precioTachado || 0)
        + Number(userSelection?.movil?.paquete?.precioPaquete || 0)
        + Number(userSelection?.tv?.paquete?.precioTachado || userSelection?.tv?.paquete?.precioPaquete || 0)
        + (totalOttPrice || 0);
    const precioTotal = totalSinDescuento && promoData.promos ? totalSinDescuento - ahorroCombinado - (Math.abs(Number(totalPromoPrice)) || 0) : totalSinDescuento;
    const ahorroTotal = ((Number(ahorroCombinado) || 0) + (Number(pagoAnticipado) || 0)) + (Number(Math.abs(totalPromoPrice as number)) || 0);

    const promoMeses = calcularPromos(promotions);
    const descuentoMeses = obtenerArray(promoMeses);

    useEffect(() => {
        setAhorroTotal(ahorroTotal);
        setPrecioCombinado(ahorroCombinado as number);
        setPrecioTotal(precioTotal as number);
    }, [ahorroCombinado, ahorroTotal, precioTotal, setAhorroTotal, setPrecioCombinado, setPrecioTotal]);

    return (
        <>

            <ResumenPaquetes copys={resumenCopys} userSelection={userAnswers} />

            <>
                <div className="py-[24px] border-b-1 border-b-gray-150">
                    <div className="flex justify-between items-center w-full font-normal leading-[24px] text-lg">
                        <h5>{resumenCopys.total.sinDescuentos}</h5>
                        <h5 className="font-bold">{FormatCurrency(Number(totalSinDescuento))}</h5>
                    </div>
                </div>
                {
                    (globalCheckedPromotions && (pagoAnticipado !== undefined || ahorroCombinado !== 0 || (promoVisible && promoVisible?.length > 0))) && (
                        <div className="flex flex-col gap-[8px] py-[24px] border-b-1 border-b-gray-150">
                            <h1 className="font-bold text-base leading-[24px] mb-[24px]">{resumenCopys.ahorro.titulo}</h1>

                            <div className="w-full font-normal leading-[24px] text-lg space-y-2">
                                <div className="flex justify-between w-full">
                                    <h5 className="text-left">{resumenCopys.ahorro.paquete}</h5>
                                    <h5 className="text-right">-{FormatCurrency(ahorroCombinado)}</h5>
                                </div>
                                {
                                    promoVisible?.map((promo, index) => {
                                        return (
                                            <div key={index} className="flex justify-between w-full">
                                                <h5 className="text-left">{promo.promoName}</h5>
                                                <h5 className="text-right">-{FormatCurrency(Math.abs(Number(promo.promoPrice)))}</h5>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )}

            </>

            <div className="flex flex-col gap-[32px]">

                <>
                    <div className="flex justify-between w-full font-bold leading-[32px] xl:leading-[40px] text-2xl xl:text-[32px] pt-[24px]">
                        <h2>{resumenCopys.total.titulo}</h2>
                        <h2>{FormatCurrency(Number(precioTotal))}</h2>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        {
                            ottPromos &&
                            ottPromos?.filter(promo => promo.permanente.toLowerCase() === 'no')
                                .map((promo, index) => (
                                    <div key={index} className="flex justify-between w-full font-normal leading-[24px] text-lg">
                                        <h5>Después de {promo.meses} meses pagarás</h5>
                                        <h5>{FormatCurrency(precioTotal + (totalAfterPromos + Math.abs(Number(promo.promoPrice))))}</h5>
                                    </div>
                                ))
                        }
                        {
                            (descuentoMeses.length > 0) &&
                            <>
                                {
                                    descuentoMeses.map((item) => {
                                        const precioDespues = totalSinDescuento - Number(ahorroCombinado) + item.totalPromo;
                                        const copyMes = resumenCopys.ahorro.meses[item.mesId];

                                        if (precioDespues === precioTotal) {
                                            return null;
                                        }
                                        return (
                                            <div key={item.mesNumero} className="flex justify-between w-full font-normal leading-[24px] text-lg space-y-2">
                                                <h5>{copyMes}</h5>
                                                <h5>{FormatCurrency(precioDespues)}</h5>
                                            </div>
                                        )
                                    })
                                }
                            </>
                        }
                    </div>
                    <div className="flex flex-col gap-[8px] mb-[32px]">
                        <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                            <h5>{resumenCopys.ahorro.domicilio}</h5>
                            <h5>-{FormatCurrency(Number(globalIzziSelection?.precioDomiciliacion && globalIzziSelection?.precioDomiciliacion !== "0" ? globalIzziSelection?.precioDomiciliacion : '50'))}</h5>
                        </div>
                        <h5 className="w-full font-normal leading-[24px] text-base text-gray-250">
                            {resumenCopys.ahorro.infoAdicional}
                        </h5>
                    </div>
                </>
            </div >
        </>
    )
}
