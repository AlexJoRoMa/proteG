'use client'

import { Switch } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { GetLigaPago } from "@/utils/GetLigaPago";
import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { PaymentLiga } from "@/types/Contratacion";
import { LoaderIcon } from "@/constants/IconsConstants";

export default function PagoTarjeta() {

    const { rpt, precioTotal, offnetSky, setCheckSwitch, checkSwitch } = useIzziContent();
    const { currentStep, totalSteps, setPaymentReference, processStatus, datosContratacion } = useCheckout();
    const { getValue } = useMicrocopies('contratacion-pago');

    const [urlFrame, setUrlFrame] = useState("");
    const [loadingLiga, setLoadingLiga] = useState(false);

    const processStatusRef = useRef(processStatus);
    const shouldRequestLiga = currentStep === totalSteps && Boolean(rpt) && Boolean(datosContratacion);

    useEffect(() => {
        processStatusRef.current = processStatus;
    }, [processStatus]);

    useEffect(() => {
        if (!shouldRequestLiga) return;

        setLoadingLiga(true);

        (async () => {
            try {
                const response: PaymentLiga = await GetLigaPago(rpt, precioTotal, processStatusRef.current, datosContratacion, offnetSky);

                const isValidResponse = response &&
                    response.response.error === "" &&
                    typeof response.response.html === "string" &&
                    typeof response.response.reference === "string";

                if (!isValidResponse) {
                    console.warn("Liga de pago inválida:", response);
                    return;
                }

                setUrlFrame(String(response.response.html));
                setPaymentReference((prev) => ({
                    ...prev,
                    cardReference: String(response.response.reference),
                }));

            } catch (err) {
                console.error("Error al obtener la liga de pagos:", err);
            } finally {
                setLoadingLiga(false);
            }

        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [precioTotal, shouldRequestLiga]);


    return (
        <section className="w-full">
            <div className='flex flex-row w-full justify-between mt-[24px] xl:mt-[27px]'>
                <h1 className='font-normal text-lg leading-[24px]'>
                    {getValue('pago.pagoRecurrente.titulo')}
                </h1>
                <Switch
                    checked={checkSwitch}
                    onValueChange={(checked) => {
                        setCheckSwitch(checked)
                        window.dispatchEvent(new CustomEvent('switch-change', { detail: checked }))
                    }}
                    classNames={{
                        wrapper: "bg-gray-100 group-data-[selected=true]:!bg-black-0",
                        thumb: "bg-white-0"
                    }}

                />
            </div>
            <p className='mt-[8px] w-full text-sm xl:text-base leading-[24px]'>
                {getValue('pago.pagoRecurrente.subTitulo')}
            </p>
            {loadingLiga && (
                <div className="mt-[24px] xl:mt-[27px] w-full h-[20vh] xl:h-[30vh] flex justify-center items-center">
                    <div className="!w-[80px] !h-[80px]">
                        <LoaderIcon />
                    </div>
                </div>
            )}

            {urlFrame && !loadingLiga && (
                <div className="mt-[24px] xl:mt-[27px] w-full h-full">
                    <iframe
                        id="pago con tarjeta"
                        src={urlFrame}
                        width={300}
                        height={300}
                        className="w-full h-[100vh] overflow-x-hidden"
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
