import ResumenPaquetes from "./resumenPaquetes";
import { FormatCurrency } from "@/utils/Currency";
import { ResumenContentProps } from "@/types/ResumenCompra";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { useEffect } from "react";

export default function ResumenContent({ copys, userSelection }: ResumenContentProps) {

    const resumenCopys = copys;
    const userAnswers = userSelection;

    const { promoData, globalIzziSelection, setPrecioTotal, setPrecioCombinado } = useIzziContent();
    const { globalCheckedPromotions } = useIzziContent();

    
    const ottPromos = promoData?.promos?.filter(promo =>
        globalIzziSelection?.extrasMap?.ott?.some(extra => extra.nombreSiebel === promo.product)
    );

    const totalOttPrice = globalIzziSelection?.extrasMap?.ott?.reduce(
        (acc, promo) => acc + Number(promo.costo),
        0
    );

    const totalOttPromoPrice = ottPromos?.reduce(
        (acc, promo) => acc + Number(promo.promoPrice),
        0
    );

    const izziAhorro = promoData?.promoPackage?.find(promo => promo.name.toLowerCase().includes('izzi ahorro'));
    const pagoAnticipado = promoData?.promos?.find(promo => promo.promoName.toLowerCase().includes('pago anticipado'));
    const totalAfterPromos = (Math.abs(Number(izziAhorro?.amount)) || 0 ) + Math.abs(Number((pagoAnticipado?.promoPrice || 0)));
    const descuentoInternet = Math.abs((Number(userSelection?.internet?.paquete?.precioTachado) - 50) - (Number(userSelection?.internet?.paquete?.precioPaquete)));
    const descuentoTv = Math.abs((Number(userSelection?.tv?.paquete?.precioPaquete)) - (Number(userSelection?.tv?.paquete?.precioTachado)));
    const descuentoMovil = Math.abs((Number(userSelection?.movil?.paquete?.precioPaquete)) - (Number(userSelection?.movil?.paquete?.precioTachado)));

    const ahorroCombinado = (descuentoInternet || 0) + (descuentoTv || 0) + (descuentoMovil || 0) - (totalOttPromoPrice || 0);

    const totalSinDescuento = Number(userSelection?.internet?.paquete?.precioTachado || 0) 
    + Number(userSelection?.movil?.paquete?.precioTachado || 0) 
    + Number(userSelection?.tv?.paquete?.precioTachado || userSelection?.tv?.paquete?.precioPaquete || 0)
    + (totalOttPrice || 0);
    const precioTotal = totalSinDescuento && ahorroCombinado ? totalSinDescuento - ahorroCombinado - (Number(izziAhorro?.amount) || 0) - (Math.abs(Number(pagoAnticipado?.promoPrice)) || 0) : Number(globalIzziSelection?.precioPaquete) + (totalOttPrice ? totalOttPrice : 0);
    
    useEffect(() => {
        setPrecioCombinado(ahorroCombinado as number);
        setPrecioTotal(precioTotal as number);
    }, [ahorroCombinado, precioTotal, setPrecioCombinado, setPrecioTotal]);

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
                    globalCheckedPromotions &&
                    <div className="flex flex-col gap-[8px] py-[24px] border-b-1 border-b-gray-150">
                        <h1 className="font-bold text-base leading-[24px] mb-[24px]">{resumenCopys.ahorro.titulo}</h1>
                        
                        <div className="w-full font-normal leading-[24px] text-lg space-y-2">
                        {izziAhorro && (
                            <div className="flex justify-between w-full">
                            <h5 className="text-left">Izzi Ahorro</h5>
                            <h5 className="text-right">-{FormatCurrency(izziAhorro.amount)}</h5>
                            </div>
                        )}
                        {pagoAnticipado && (
                            <div className="flex justify-between w-full">
                            <h5 className="text-left">{resumenCopys.ahorro.pagoAnticipado}</h5>
                            <h5 className="text-right">-{FormatCurrency(Math.abs(pagoAnticipado.promoPrice))}</h5>
                            </div>
                        )}
                        <div className="flex justify-between w-full">
                            <h5 className="text-left">{resumenCopys.ahorro.paquete}</h5>
                            <h5 className="text-right">-{FormatCurrency(ahorroCombinado)}</h5>
                        </div>
                        </div>
                    </div>
                }
                
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
                                ottPromos?.map((promo, index) => {
                                    return (
                                        <>
                                        {
                                            promo.permanente.toLowerCase() === 'no' ??
                                            <div key={index} className="flex justify-between w-full font-normal leading-[24px] text-lg">
                                                <h5>Después de {promo.meses} meses pagarás</h5>
                                                <h5>{FormatCurrency(precioTotal + (totalAfterPromos + Math.abs(Number(promo.promoPrice))))}</h5>
                                            </div>
                                        }
                                        </>
                                    )
                                })
                            }
                            {
                                totalAfterPromos &&
                                <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                                    <h5>Después del primer meses pagarás</h5>
                                    <h5>{FormatCurrency(precioTotal + totalAfterPromos)}</h5>
                                </div>
                            }
                        </div>
                    <div className="flex flex-col gap-[8px] mb-[32px]">
                        <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                            <h5>{resumenCopys.ahorro.domicilio}</h5>
                            <h5>-{FormatCurrency(Number(globalIzziSelection?.precioDomiciliacion !=="0" ? globalIzziSelection?.precioDomiciliacion : '50'))}</h5>
                        </div>
                        <h5 className="w-full font-normal leading-[24px] text-base text-gray-250">
                            {resumenCopys.ahorro.infoAdicional}
                        </h5>
                    </div>
                </>
            </div>
        </>
    )
}
