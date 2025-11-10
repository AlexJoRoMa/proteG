/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Switch } from "@heroui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetLigaPago } from "@/utils/GetLigaPago";
import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { useIzziContent } from "@/components/providers/IzziProvider";

export default function PagoTarjeta() {

    const { rpt, precioTotal } = useIzziContent();
    const [isRecurrent, setIsRecurrent] = useState(false);
    const [urlFrame, setUrlFrame] = useState("");
    const { currentStep, setPaymentReference, processStatus, datosContratacion } = useCheckout();
    const { offnetSky } = useIzziContent();
    const { getValue } = useMicrocopies('contratacion-pago');

    const hasFetched = useRef(false);

    useEffect(() => {
        if (currentStep !== 6 || hasFetched.current) return;
        hasFetched.current = true;

        (async () => {
            try {
                const result = await GetLigaPago(rpt, precioTotal, processStatus, datosContratacion, offnetSky);

                if (result?.response) {

                    setUrlFrame(result.response.html);
                    setPaymentReference((prev) => ({
                        ...prev,
                        cardReference: result.response.reference,
                    }));
                }

            } catch (err) {
                console.error("Error al obtener url de pagos:", err);
                throw new Error("Error al obtener url de pagos")
            }
        })();

    }, [currentStep])

    return (
        <section className="w-full">
            <div className='flex flex-row w-full justify-between mt-[24px] xl:mt-[27px]'>
                <h1 className='font-normal text-lg leading-[24px]'>
                    {getValue('pago.pagoRecurrente.titulo')}
                </h1>
                <Switch
                    checked={isRecurrent}
                    onChange={(e) => setIsRecurrent(e.target.checked)}
                    classNames={{
                        wrapper: "bg-gray-100 group-data-[selected=true]:!bg-black-0",
                        thumb: "bg-white-0"
                    }}

                />
            </div>
            <p className='mt-[8px] w-full text-sm xl:text-base leading-[24px]'>
                {getValue('pago.pagoRecurrente.subTitulo')}
            </p>

            {urlFrame && (
                <div className="mt-[24px] xl:mt-[27px] w-full h-full">
                    <iframe
                        id="pago con tarjeta"
                        src={urlFrame}
                        width={300}
                        height={300}
                        className="w-full"
                    />
                </div>
            )}

            <div className='flex flex-col gap-[27px] text-center text-sm md:text-base leading-[24px] mt-[27px]'>
                <p className='font-bold'>
                    {getValue('pago.agradecimiento')}
                </p>
            </div>

        </section>
    )
}
