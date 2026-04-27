import { useIzziContent } from "@/components/providers/IzziProvider";
import { useThankYou } from "@/components/providers/ThankYouProvider";
import { ResumenData } from "@/types/ResumenCompra";
import { ThankyouCopys } from "@/types/ThankyouTypes";
import ResumenContent from "../resumenCompra/resumenContent";
import DetalleResumen from "../resumenCompra/detalleResumen";

export default function ResumenDesktop() {

    const { copys, copyResumen } = useThankYou();
    const { globalUserAnswers } = useIzziContent();

    const copy = copys as ThankyouCopys;
    const resumenCopys = copyResumen as ResumenData;

    return (
        <>
            <h1 className="font-normal text-base xl:text-lg">
                {copy.resumen}
            </h1>
            <ResumenContent
                copys={resumenCopys}
                userSelection={globalUserAnswers}
            />
            <div className="mt-[24px]">
                <DetalleResumen
                    copys={resumenCopys}
                    userSelection={globalUserAnswers}
                />
            </div>
        </>
    )
}