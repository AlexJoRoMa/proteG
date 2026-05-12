import { useIzziContent } from "@/components/providers/IzziProvider";
import ResumenContent from "../resumenCompra/resumenContent";
import { ResumenData } from "@/types/ResumenCompra";
import DetalleResumen from "../resumenCompra/detalleResumen";
import BannerPromocionesResumen from "@/components/atoms/BannerPromocionesResumen";
import BannerDomiciliacion from "@/components/atoms/bannerDomiciliacion";

export default function ResumenDesktop({ resumenCopys, children }: { resumenCopys: ResumenData, children: () => React.ReactNode }) {

    const { globalUserAnswers, checkSwitch, checkedPromotions } = useIzziContent();

    return (
        <section className="flex flex-col h-full min-h-0">

            <h1 className="font-bold leading-[24px] text-xl px-[16px] mb-[32px]">
                {resumenCopys.titulo}
            </h1>

            <div className="px-[16px] overflow-y-auto custom-scroll flex-1 min-h-0">
                <BannerPromocionesResumen
                    copys={resumenCopys}
                />
                <ResumenContent
                    copys={resumenCopys}
                    userSelection={globalUserAnswers}
                />

                {
                    (checkedPromotions && !checkSwitch) && (
                        <div className="mt-[24px] mb-[32px]">
                            <BannerDomiciliacion
                                copys={resumenCopys}
                            />
                        </div>
                    )
                }

                <div className={`${(checkedPromotions && !checkSwitch) && "border-t-1 border-t-gray-150"}`}>
                    <DetalleResumen
                        copys={resumenCopys}
                        userSelection={globalUserAnswers}
                    />
                </div>
            </div>

            <div className="z-50 shadow-[0_-2px_20px_-4px_rgba(0,0,0,0.12)] pt-[32px] pb-[24px] px-[16px]">
                {children()}
            </div>

        </section>
    )
}