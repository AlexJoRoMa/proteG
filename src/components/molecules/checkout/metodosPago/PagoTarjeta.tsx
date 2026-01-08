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

    const { rpt, precioTotal, offnetSky } = useIzziContent();
    const { currentStep, totalSteps, setPaymentReference, processStatus, datosContratacion, setCardRecurrent } = useCheckout();
    const { getValue } = useMicrocopies('contratacion-pago');

    const [isRecurrent, setIsRecurrent] = useState<boolean>(false);
    const [urlFrame, setUrlFrame] = useState("");
    const [montoDomiciliado, setMontoDomiciliado] = useState<number>(precioTotal);
    const [loadingLiga, setLoadingLiga] = useState(false);

    const processStatusRef = useRef(processStatus);

    useEffect(() => {
        processStatusRef.current = processStatus;
    }, [processStatus]);


    useEffect(() => {
        setMontoDomiciliado(isRecurrent ? precioTotal - 50 : precioTotal);
    }, [isRecurrent, precioTotal]);

    useEffect(() => {
        if (currentStep !== totalSteps) return;

        let isMounted = true;
        setLoadingLiga(true);

        (async () => {
            try {
                const response: PaymentLiga = await GetLigaPago(rpt, precioTotal, processStatusRef.current, datosContratacion, offnetSky, isRecurrent, montoDomiciliado);

                if (!isMounted) return;

                if (response?.response) {
                    setUrlFrame(response.response.html);
                    setPaymentReference((prev) => ({
                        ...prev,
                        cardReference: response.response.reference,
                    }));
                }
            } catch (err) {
                console.error("Error al obtener la liga de pagos:", err);
            } finally {
                if (isMounted) setLoadingLiga(false);
            }
        })();

        return () => { isMounted = false };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRecurrent, /* montoDomiciliado, */ precioTotal, currentStep, totalSteps]);

    /* console.log('🐋🐋  isRecurrent', isRecurrent) */
    /* console.log('🐦  cardRecurrent', montoDomiciliado) */

    return (
        <section className="w-full">
            <div className='flex flex-row w-full justify-between mt-[24px] xl:mt-[27px]'>
                <h1 className='font-normal text-lg leading-[24px]'>
                    {getValue('pago.pagoRecurrente.titulo')}
                </h1>
                <Switch
                    checked={isRecurrent}
                    onValueChange={(checked) => {
                        setIsRecurrent(checked)
                        setCardRecurrent(checked)
                        window.dispatchEvent(new CustomEvent('switch-change', {detail: checked}))
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
