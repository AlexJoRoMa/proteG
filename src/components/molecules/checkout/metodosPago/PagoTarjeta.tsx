'use client'

import { Switch } from "@heroui/react";
import { useEffect, useState } from "react";
import { GetLigaPago } from "@/utils/GetLigaPago";

export default function PagoTarjeta() {
    const [isRecurrent, setIsRecurrent] = useState(false);
    const [urlFrame, setUrlFrame] = useState("");

    // useEffect(() => {
    //     const fetchPagoTarjetaConfig = async () => {
    //         try {
    //             const result = await GetLigaPago();

    //             if (result?.response) {

    //                 setUrlFrame(result.response.html);
    //             }

    //         } catch (err) {
    //             console.error("Error al obtener url de pagos:", err);
    //             throw new Error("Error al obtener url de pagos")
    //         }
    //     };

    //     fetchPagoTarjetaConfig();

    // }, [])

    return (
        <>
            <div className='flex flex-row w-full justify-between mt-[24px] xl:mt-[27px]'>
                <h1 className='font-normal text-lg leading-[24px]'>
                    Activa tu pago recurrente
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
                Acepto el cargo recurrente en mi pago y las condiciones de uso del servicio.
            </p>

            {/* {urlFrame && (
                <div>
                    <iframe
                        id="pago con tarjeta"
                        src={urlFrame}
                        width={300}
                        height={300}
                    />
                </div>
            )} */}

        </>
    )
}
