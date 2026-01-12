import ResumenPaquetes from "./resumenPaquetes";
import { FormatCurrency, FormatPromotions } from "@/utils/Currency";
import { ResumenContentProps } from "@/types/ResumenCompra";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { useEffect, useState } from "react";
import { Promos } from "@/types/ConfiguradorTypes";
import { mesIds } from "@/constants/ResumenConstants";

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

    const { promoData, globalIzziSelection, setPrecioTotal, setPrecioCombinado, checkSwitch, setTotalSinDescuento } = useIzziContent();
    const { globalCheckedPromotions, setAhorroTotal } = useIzziContent();
    const [validateSwitch, setValidateSwitch] = useState(checkSwitch);
    const [ priceTotal, setPriceTotal] = useState(0);

    useEffect(() =>{
        setValidateSwitch(checkSwitch)
    }, [checkSwitch])

    useEffect(() =>{
        const handleSwitch = (e: Event)=> {
            const customEvent = e as CustomEvent<boolean>;
            setValidateSwitch(customEvent.detail)
        };
        
        window.addEventListener('switch-change', handleSwitch);
        return ()=> window.removeEventListener('switch-change', handleSwitch);
    },[])


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
    const promoVisible = promotions?.filter((promo) => promo.visible === true && promo.promoPrice !== 0);
    const pagoAnticipado = promoData?.promos?.find(promo => promo.promoName.toLowerCase().includes('pago anticipado'));
    const totalAfterPromos = Math.abs(Number((pagoAnticipado?.promoPrice || 0)));
    const descuentoTv = Math.abs((Number(userSelection?.tv?.paquete?.precioPaquete)) - (Number(userSelection?.tv?.paquete?.precioTachado)));

    const ahorroCombinado = (descuentoTv || 0);

    const totalSinDescuento = Number(userSelection?.internet?.paquete?.precioTachado || 0)
        + Number(userSelection?.movil?.paquete?.precioPaquete || 0)
        + Number(userSelection?.tv?.paquete?.precioTachado || userSelection?.tv?.paquete?.precioPaquete || 0)
        + (totalOttPrice || 0);
    setTotalSinDescuento(totalSinDescuento);
    const precioTotal = totalSinDescuento && promoData.promos ? totalSinDescuento - ahorroCombinado - (Math.abs(Number(totalPromoPrice)) || 0) : totalSinDescuento;
    const ahorroTotal = ((Number(ahorroCombinado) || 0) + (Number(pagoAnticipado) || 0)) + (Number(Math.abs(totalPromoPrice as number)) || 0);

    const promoMeses = calcularPromos(promotions);
    const descuentoMeses = obtenerArray(promoMeses);

    useEffect(() => {
        setAhorroTotal(ahorroTotal);
        setPrecioCombinado(ahorroCombinado as number);
        setPrecioTotal(priceTotal as number);
    }, [ahorroCombinado, ahorroTotal, priceTotal, setAhorroTotal, setPrecioCombinado, setPrecioTotal]);

    useEffect(() =>{
        if(validateSwitch){
            setPriceTotal(precioTotal-50)
        } else{
            setPriceTotal(precioTotal)
        }
    }, [validateSwitch, precioTotal])


    
    /* console.log('⛑️ ottPromos ', ottPromos) */






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
                    (globalCheckedPromotions && (ahorroCombinado !== 0 || (promoVisible && promoVisible?.length > 0)) || validateSwitch) && (
                        <div className="flex flex-col gap-[8px] py-[24px] border-b-1 border-b-gray-150">
                            <h1 className="font-bold text-base leading-[24px] mb-[24px]">{resumenCopys.ahorro.titulo}</h1>

                            <div className="w-full font-normal leading-[24px] text-lg space-y-2">
                                {(globalCheckedPromotions && (ahorroCombinado !== 0 || (promoVisible && promoVisible?.length > 0)) ) && (
                                    <div className="flex justify-between w-full">
                                    <h5 className="text-left mr-[8px]">{resumenCopys.ahorro.paquete}</h5>
                                    <h5 className="text-right">-{FormatPromotions(ahorroCombinado)}</h5>
                                </div>
                                )}
                                

                                {
                                    promoVisible?.map((promo, index) => {
                                        return (
                                            <div key={index} className="flex justify-between w-full">
                                                <h5 className="text-left mr-[8px]">{promo.promoName}</h5>
                                                <h5 className="text-right">-{FormatPromotions(Math.abs(Number(promo.promoPrice)))}</h5>
                                            </div>
                                        )
                                    })
                                }

                                { validateSwitch && (
                                    <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                                    <h5>{resumenCopys.ahorro.domicilio}</h5>
                                    <h5>-{FormatCurrency(Number(50))}</h5>
                                    </div>
                                )}
                                
                            </div>
                        </div>
                    )}

            </>

            <div className="flex flex-col gap-[32px]">

                <>
                    <div className="flex justify-between w-full font-bold leading-[32px] xl:leading-[40px] text-2xl xl:text-[32px] pt-[24px]">
                        <h2>{resumenCopys.total.titulo}</h2>
                        <h2>
                            {
                                globalCheckedPromotions ? (
                                    FormatPromotions(Number(priceTotal))
                                ) : (
                                    FormatCurrency(Number(priceTotal))
                                )
                            }
                        </h2>
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
                                        /* console.log('⛑️ precioDespues ', precioDespues) */
                                        return (
                                            <div key={item.mesNumero} className="flex justify-between w-full font-normal leading-[24px] text-lg space-y-2">
                                                <h5>{copyMes}</h5>
                                                <h5>{FormatPromotions(precioDespues)}</h5>
                                            </div>
                                        )
                                    })
                                }
                            </>
                        }
                    </div>

                    { !validateSwitch && (
                    <div className="flex flex-col gap-[8px] mb-[32px]">
                        <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                            <h5>{resumenCopys.ahorro.domicilio}</h5>
                            <h5>-{FormatCurrency(Number(50))}</h5>
                        </div>
                        <h5 className="w-full font-normal leading-[24px] text-base text-gray-250">
                            {resumenCopys.ahorro.infoAdicional}
                        </h5>
                    </div>
                    )}
                    
                </>
            </div >
        </>
    )
}
