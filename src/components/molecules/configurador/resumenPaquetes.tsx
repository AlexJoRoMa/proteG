import { ComponentsFields, internetComponentFields, movilComponentFields, ResumenData, tvComponentFields } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider"
import { useEffect, useState } from "react";

export default function ResumenPaquetes() {

    const content = useContent();
    const [seleccionUsuario, setSeleccionUsuario] = useState("");
    const [precioSeleccion, setPrecioSeleccion] = useState<number | undefined>(undefined)

    const paquetes = content.userAnswers as unknown as Record<string, ComponentsFields>;
    console.log('paquetes', paquetes)

    const resumenCopys = content.copysResumen as ResumenData;
    const internet = paquetes.internet as unknown as internetComponentFields;
    const tv = paquetes.tv as unknown as tvComponentFields;
    const movil = paquetes.movil as unknown as movilComponentFields;

    useEffect(() => {
        setSeleccionUsuario(seleccionPaquetes(paquetes));
        setPrecioSeleccion(
            (internet?.total || 0) + (tv?.total || 0) + (tv?.ott?.total || 0) + (movil?.total || 0)
        )
    }, [paquetes])

    function seleccionPaquetes(obj: any) {
        switch (true) {
            case !!obj?.internet && !!obj.tv && !!obj.movil:
                return resumenCopys.seleccionPaquetes["4p"]

            case !!obj?.internet && !!obj?.tv:
                return resumenCopys.seleccionPaquetes["internet&tv"]

            case !!obj?.internet && !!obj?.movil:
                return resumenCopys.seleccionPaquetes["internet&movil"]

            case !!obj?.tv && !!obj?.movil:
                return resumenCopys.seleccionPaquetes["tv&movil"]

            case !!obj?.internet:
                return resumenCopys.seleccionPaquetes.internet

            case !!obj?.tv:
                return resumenCopys.seleccionPaquetes.tv

            case !!obj?.movil:
                return resumenCopys.seleccionPaquetes.movil

            default:
                return ""
        }
    }

    // console.log('seleccion', seleccionUsuario)


    return (
        <>
            {
                <div className="flex justify-between w-full font-bold leading-[24px] text-lg pt-[24px]">
                    <h5>{seleccionUsuario}</h5>
                    <h5>{`$${precioSeleccion}`}</h5>
                </div>
            }
            {
                (internet && internet !== null && Object.keys(internet).length > 0) &&
                <div className="flex flex-col gap-[24px] border-b-1 border-b-gray-150 pt-[24px]">
                    <div className="flex justify-between w-full font-bold leading-[24px] text-lg">
                        <h5>{resumenCopys.paquetes.internet.titulo}</h5>
                        <h5>
                            {`$${internet.total}`}
                        </h5>
                    </div>

                    <div className="flex-flex-col gap-[8px] mb-[24px] w-[90%] font-normal leading-[24px] text-base text-gray-250">
                        <p>
                            {`${resumenCopys.paquetes.internet.prevCapacidad} ${internet.paquete.fields.minCapacityInternet}${resumenCopys.paquetes.internet.postCapacidad}`}
                        </p>
                        <p>
                            {`${resumenCopys.paquetes.internet.infoAdicional} ${internet.paquete.fields.maxCapacityInternet.trim()}`}
                        </p>
                        <p>
                            {internet.paquete.fields.subTitle}
                        </p>
                    </div>
                </div>
            }

            {
                (tv && tv !== null && Object.keys(tv).length > 0) &&
                <div className="flex flex-col">
                    <div className="flex flex-col gap-[8px] border-b-1 border-b-gray-150 pt-[24px]">
                        <div className="flex justify-between w-full font-bold leading-[24px] text-lg">
                            <h5>{tv.paquete.fields.title}</h5>
                            <h5>{`$${tv.paquete.fields.discountPrice ? tv.paquete.fields.discountPrice : tv.paquete.fields.price}`}</h5>
                        </div>

                        <p className="mb-[24px] w-full font-normal leading-[24px] text-base text-gray-250">
                            {`${resumenCopys.paquetes.tv.preCanales} ${tv.paquete.fields.subTitle} ${resumenCopys.paquetes.tv.postCanales}`}
                        </p>
                    </div>

                    {(tv.ott?.planes && tv.ott?.planes.length > 0) &&
                        <div className="flex flex-col gap-[8px] pt-[24px] border-b-1 border-b-gray-150">
                            <div className="flex justify-between items-center w-full font-bold leading-[24px] text-lg">
                                <h5>{resumenCopys.paquetes.tv.ott.titulo}</h5>
                                <h5>{`$${tv.ott?.total}`}</h5>
                            </div>
                            <div className="flex flex-col gap-[8px] pb-[24px]">
                                {tv.ott?.planes.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between w-full font-normal leading-[24px] text-lg"
                                    >
                                        <h5>
                                            {`+ ${item.id} (${item.title})`}
                                        </h5>
                                        <h5>
                                            {`$${item.price}`}
                                        </h5>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </div>
            }

            {
                (movil && movil !== null && Object.keys(movil).length > 0) &&
                <div className="flex flex-col gap-[8px] border-b-1 border-b-gray-150 pt-[24px]">
                    <div className="flex justify-between w-full font-bold leading-[24px] text-lg">
                        <h5>{resumenCopys.paquetes.movil.titulo}</h5>
                        <h5>{`$${movil.paquete.fields.discountPrice ? movil.paquete.fields.discountPrice : movil.paquete.fields.price}`}</h5>
                    </div>

                    <div className="flex-flex-col gap-[8px] pb-[24px] w-full font-normal leading-[24px] text-base text-gray-250">
                        <p>
                            {movil.paquete.fields.title.toLowerCase()}
                        </p>
                        <p>
                            {movil.contrato}
                        </p>
                    </div>
                </div>
            }

        </>
    )
}