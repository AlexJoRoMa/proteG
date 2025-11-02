import ResumenPaquetes from "./resumenPaquetes";
import { FormatCurrency } from "@/utils/Currency";
import { ResumenContentProps } from "@/types/ResumenCompra";
import { useIzziContent } from "@/utils/IzziProvider";
import { useEffect } from "react";

export default function ResumenContent({ copys, userSelection }: ResumenContentProps) {

    const resumenCopys = copys;
    const userAnswers = userSelection;

    const { promoData, globalIzziSelection, setPrecioTotal, setPrecioCombinado } = useIzziContent();

    
    const ottPromos = promoData?.promos?.filter(promo =>
        globalIzziSelection?.extrasMap?.ott?.some(extra => extra.nombreSiebel === promo.product)
    );

    const totalOttPrice = globalIzziSelection?.extrasMap?.ott?.reduce(
        (acc, promo) => acc + Number(promo.costo),
        0
    );


    const totalPromoPrice = ottPromos?.reduce(
        (acc, promo) => acc + Number(promo.promoPrice),
        0
    );

    const precioTachadoTotal =
    Number(userSelection?.internet?.paquete?.precioPaquete || 0) +
    Number(userSelection?.tv?.paquete?.precioTachado || 0) +
    Number(userSelection?.movil?.paquete?.precioTachado || 0) +
    Number(totalOttPrice || 0);
  
    const precioPaqueteTotal =
        Number(userSelection?.internet?.paquete?.precioPaquete || 0) +
        Number(userSelection?.tv?.paquete?.precioPaquete || 0) +
        Number(userSelection?.movil?.paquete?.precioPaquete || 0) +
        Number(totalOttPrice || 0) -
        Math.abs(Number(totalPromoPrice || 0));
    
    const ahorroCombinado = precioTachadoTotal - precioPaqueteTotal;

    const totalSinDescuento = Number(userSelection?.internet?.paquete?.precioPaquete || 0) 
    + Number(userSelection?.movil?.paquete?.precioTachado || 0) 
    + Number(userSelection?.tv?.paquete?.precioTachado || 0)
    + (totalOttPrice || 0);

    const precioTotal = totalSinDescuento && ahorroCombinado ? totalSinDescuento - ahorroCombinado : globalIzziSelection?.precioPaquete;

    
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

                <div className="flex flex-col gap-[8px] py-[24px] border-b-1 border-b-gray-150">
                    <h1 className="font-bold text-base leading-[24px] mb-[24px]">{resumenCopys.ahorro.titulo}</h1>
                    <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                        <h5>{resumenCopys.ahorro.paquete}</h5>
                        <h5>-{FormatCurrency(ahorroCombinado)}</h5>
                    </div>

                    {/* {
                        ((userAnswers.internet && userAnswers.tv && !userAnswers.movil) || (userAnswers.internet && !userAnswers.tv && userAnswers.movil)) &&
                        <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                            <h5>{resumenCopys.ahorro.pagoAnticipado}</h5>
                            <h5>-${pagoAnticipado}</h5>
                        </div>
                    } */}

                </div>
            </>

            <div className="flex flex-col gap-[32px]">

                <>
                    <div className="flex justify-between w-full font-bold leading-[32px] xl:leading-[40px] text-2xl xl:text-[32px] pt-[24px]">
                        <h2>{resumenCopys.total.titulo}</h2>
                        <h2>${precioTotal}</h2>
                    </div>

                    {
                        ((userAnswers.internet && userAnswers.tv && !userAnswers.movil) || (userAnswers.internet && !userAnswers.tv && userAnswers.movil)) &&
                        <>
                            <div className="flex flex-col gap-[8px]">
                                {
                                    ottPromos?.map((promo, index) => {
                                        return (
                                            <>
                                            {
                                                promo.permanente.toLowerCase() === 'no' ?
                                                <div key={index} className="flex justify-between w-full font-normal leading-[24px] text-lg">
                                                    <h5>Después de {promo.meses} meses pagarás</h5>
                                                    <h5>{FormatCurrency(Number(precioTotal) + Math.abs(Number(promo.promoPrice)))}</h5>
                                                </div>
                                            :
                                            <></>
                                            }
                                            </>
                                        )
                                    })
                                }
                                
                                {/* <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                                    <h5>A partir del 7to mes pagarás</h5>
                                    <h5>$XXXX</h5>
                                </div> */}
                            </div>
                        </>
                    }

                    <div className="flex flex-col gap-[8px] mb-[32px]">
                        <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                            <h5>{resumenCopys.ahorro.domicilio}</h5>
                            <h5>-{FormatCurrency(Number(globalIzziSelection?.precioDomiciliacion))}</h5>
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
