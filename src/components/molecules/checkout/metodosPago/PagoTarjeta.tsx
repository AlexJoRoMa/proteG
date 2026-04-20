'use client'

import { Switch } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { GetLigaPago } from "@/utils/GetLigaPago";
import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { PaymentLiga } from "@/types/Contratacion";
import { LoaderIcon, PiggyBank } from "@/constants/IconsConstants";

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
        <section className="w-full flex flex-col items-center">
            <div className="w-[97%] bg-gray-50 mx-3">
            <div className='flex flex-row w-[96%] justify-between items-start bg-white rounded-xl border border-gray-100 p-3 mt-6 mx-3'>
                <h1 className='flex flex-1 items-center font-normal text-[18px] leading-[24px]'>
                    <span className="flex items-center gap-1 flex-wrap">
                        <PiggyBank />
                        <b>{getValue('pago.pagoRecurrente.titulo.negrillas')}</b>
                        
                        {getValue('pago.pagoRecurrente.titulo')}
                    </span>
                    
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
            <div className="mt-4 w-full text-[16px] leading-[24px] mb-5 pl-7">
                <p>
                    {getValue('pago.pagoRecurrente.subTitulo')}{' '}
                    <a
                    href={getValue('pago.pagoRecurrente.subTitulo.url')}
                    className="font-bold underline"
                    target='_blank'
                    rel='noopener noreferrer'
                    >
                        {getValue('pago.pagoRecurrente.subTitulo.terminos')}
                    </a>
                </p>
            </div>
            </div>
            {loadingLiga && (
                <div className="mt-[24px] xl:mt-[27px] w-full h-[20vh] xl:h-[30vh] flex justify-center items-center">
                    <div className="!w-[80px] !h-[80px]">
                        <LoaderIcon />
                    </div>
                </div>
            )}

            {urlFrame && !loadingLiga && (
                <div className="mt-[24px] xl:mt-[27px] w-full h-full">
                    <iframe sandbox="allow-forms allow-scripts allow-popups allow-top-navigation-by-user-activation allow-same-origin"
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
