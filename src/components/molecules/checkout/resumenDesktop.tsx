import { useIzziContent } from "@/components/providers/IzziProvider";
import ResumenContent from "../resumenCompra/resumenContent";
import { ResumenData } from "@/types/ResumenCompra";
import DetalleResumen from "../resumenCompra/detalleResumen";
import BannerPromocionesResumen from "@/components/atoms/BannerPromocionesResumen";
import BannerDomiciliacion from "@/components/atoms/bannerDomiciliacion";

export default function ResumenDesktop({ resumenCopys, children }: { resumenCopys: ResumenData, children: () => React.ReactNode }) {

    const { globalUserAnswers, checkSwitch, checkedPromotions } = useIzziContent();

    return (
        <>
            <h1 className="font-bold leading-[24px] text-xl mb-[32px]">
                {resumenCopys.titulo}
            </h1>

            <BannerPromocionesResumen
                copys={resumenCopys}
            />

            <ResumenContent
                copys={resumenCopys}
                userSelection={globalUserAnswers}
            />

            {
                (checkedPromotions && !checkSwitch) && (
                    <div className="mt-[24px]">
                        <BannerDomiciliacion
                            copys={resumenCopys}
                        />
                    </div>
                )
            }
            <div className="py-[32px] z-50">
                {children()}
            </div>

            <DetalleResumen
                copys={resumenCopys}
                userSelection={globalUserAnswers}
            />
        </>
    )
}