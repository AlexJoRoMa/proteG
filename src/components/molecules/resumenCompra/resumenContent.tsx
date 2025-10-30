import ResumenPaquetes from "./resumenPaquetes";
import { FormatCurrency } from "@/utils/Currency";
import { ResumenContentProps } from "@/types/ResumenCompra";
import { useIzziContent } from "@/utils/IzziProvider";

export default function ResumenContent({ copys, userSelection }: ResumenContentProps) {

    const resumenCopys = copys;
    const userAnswers = userSelection;

    const { promoData, globalIzziSelection } = useIzziContent();

    
    const pagoAnticipado = Math.abs(promoData?.promos?.find(promo => promo.promoName?.toLowerCase().includes("anticipado"))?.promoPrice || 0);

    // const ahorroCombinado = globalIzziSelection.

    return (
        <>

            <ResumenPaquetes copys={resumenCopys} userSelection={userAnswers} />

            <>
                <div className="py-[24px] border-b-1 border-b-gray-150">
                    <div className="flex justify-between items-center w-full font-normal leading-[24px] text-lg">
                        <h5>{resumenCopys.total.sinDescuentos}</h5>
                        <h5 className="font-bold">{FormatCurrency(Number(userAnswers.total))}</h5>
                    </div>
                </div>

                <div className="flex flex-col gap-[8px] py-[24px] border-b-1 border-b-gray-150">
                    <h1 className="font-bold text-base leading-[24px] mb-[24px]">{resumenCopys.ahorro.titulo}</h1>
                    <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                        <h5>{resumenCopys.ahorro.paquete}</h5>
                        <h5>-$XXXX</h5>
                    </div>

                    {
                        ((userAnswers.internet && userAnswers.tv && !userAnswers.movil) || (userAnswers.internet && !userAnswers.tv && userAnswers.movil)) &&
                        <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                            <h5>{resumenCopys.ahorro.pagoAnticipado}</h5>
                            <h5>-${pagoAnticipado}</h5>
                        </div>
                    }

                </div>
            </>

            <div className="flex flex-col gap-[32px]">

                <>
                    <div className="flex justify-between w-full font-bold leading-[32px] xl:leading-[40px] text-2xl xl:text-[32px] pt-[24px]">
                        <h2>{resumenCopys.total.titulo}</h2>
                        <h2>{FormatCurrency(Number(globalIzziSelection?.precioPaquete))}</h2>
                    </div>

                    {
                        ((userAnswers.internet && userAnswers.tv && !userAnswers.movil) || (userAnswers.internet && !userAnswers.tv && userAnswers.movil)) &&
                        <>
                            <div className="flex flex-col gap-[8px]">
                                <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                                    <h5>A partir del 2do mes pagarás</h5>
                                    <h5>$XXXX</h5>
                                </div>
                                <div className="flex justify-between w-full font-normal leading-[24px] text-lg">
                                    <h5>A partir del 7to mes pagarás</h5>
                                    <h5>$XXXX</h5>
                                </div>
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
