'use client'

import ResumenContent from "../resumenCompra/resumenContent";
import { useContent } from "@/utils/ConfiguradorProvider";
import { ResumenData } from "@/types/ResumenCompra";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { useState } from "react";
import { LoaderIcon } from "@/constants/IconsConstants";
import BannerPromocionesResumen from "@/components/atoms/BannerPromocionesResumen";
import DetalleResumen from "../resumenCompra/detalleResumen";
import BotonContratarConfigurador from "./botonContratarConfigurador";
import { internetComponentFields, movilComponentFields, tvComponentFields } from "@/types/ConfiguradorTypes";

function hasData(obj: unknown): boolean {
    return !!obj && typeof obj === "object" && Object.keys(obj as object).length > 0;
}

export default function ResumenContainerDesktop() {

    const { copysResumen, userAnswers } = useContent();
    const resumenCopys = copysResumen as ResumenData;
    const [loading, setLoading] = useState<boolean>(false);
    const { checkedPromotions } = useIzziContent();

    const internet = userAnswers.internet as unknown as internetComponentFields | undefined;
    const tv = userAnswers.tv as unknown as tvComponentFields | undefined;
    const movil = userAnswers.movil as unknown as movilComponentFields | undefined;

    const hasInternet = hasData(internet);
    const hasTv = hasData(tv);
    const hasMovil = hasData(movil);
    const hasAnyMainProduct = hasInternet || hasTv || hasMovil;


    return (
        <>
            {
                !hasAnyMainProduct ?
                    <button
                        className="mb-[32px] py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-[48px] text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                        disabled
                    >
                        {resumenCopys.boton.comprobarPromociones}
                    </button>
                    :
                    <section>
                        {
                            loading &&

                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
                                <div className="w-[104px] h-[104px]">
                                    <LoaderIcon />
                                </div>
                            </div>
                        }
                        <h1 className="hidden xl:block font-bold leading-[24px] text-xl">
                            {resumenCopys.titulo}
                        </h1>

                        {
                            checkedPromotions &&
                            <BannerPromocionesResumen
                                copys={resumenCopys}
                            />
                        }

                        <ResumenContent
                            copys={resumenCopys}
                            userSelection={userAnswers}
                        />

                        <div className="py-[32px] hidden xl:block">
                            <BotonContratarConfigurador
                                loading={loading}
                                setLoading={setLoading}
                            />
                            {/* <ModalFechaInvalida isOpen={promoError} /> */}
                        </div>

                        <DetalleResumen
                            copys={resumenCopys}
                            userSelection={userAnswers}
                        />
                    </section>
            }

        </>
    )
}