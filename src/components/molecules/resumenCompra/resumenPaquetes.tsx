import { internetComponentFields, movilComponentFields, OfferItem, tvComponentFields } from "@/types/ConfiguradorTypes";
import { ResumenContentProps } from "@/types/ResumenCompra";
import { FormatCurrency } from "@/utils/Currency";

export default function ResumenPaquetes({ userSelection, copys }: ResumenContentProps) {

    const paquetes = userSelection as unknown as Record<string, OfferItem>;
    const resumenCopys = copys;
    const internet = paquetes.internet as unknown as internetComponentFields;
    const tv = paquetes.tv as unknown as tvComponentFields;
    const movil = paquetes.movil as unknown as movilComponentFields;


    return (
        <>

            {/* Selección Internet - Doble Play */}

            {
                (internet && internet !== null && Object.keys(internet).length > 0) &&
                <div className="flex flex-col gap-[8px] border-b-1 border-b-gray-150 pt-[24px]">
                    <div className="flex justify-between w-full font-bold leading-[24px] text-lg">
                        <h5>{resumenCopys.paquetes.internet.titulo}</h5>
                        <h5>
                            {FormatCurrency(Number(internet.paquete.precioTachado))}
                        </h5>
                    </div>

                    <div className="flex-flex-col gap-[8px] mb-[24px] w-[90%] font-normal leading-[24px] text-base text-gray-250">
                        <p>
                            {`
                            ${resumenCopys.paquetes.internet.prevCapacidad} ${internet.paquete.velocidadMinima}${resumenCopys.paquetes.internet.postCapacidad}`}
                        </p>
                        <p>
                            {`${resumenCopys.paquetes.internet.textoContratacion} ${internet.paquete.velocidadMaxima}${resumenCopys.paquetes.internet.postCapacidad}`}
                        </p>
                        <p>
                            {`${resumenCopys.paquetes.internet.extrasIncluidos} ${internet.paquete.extrasIncluidos && internet.paquete.extrasIncluidos[0].titulo}`}
                        </p>
                    </div>
                </div>
            }

            {/* Selección Tv - Tv */}

            {
                (tv && tv !== null && Object.keys(tv).length > 0) &&
                <div className="flex flex-col">
                    <div className="flex flex-col gap-[8px] border-b-1 border-b-gray-150 pt-[24px]">
                        <div className="flex justify-between w-full font-bold leading-[24px] text-lg">
                            <h5>{tv.paquete.titulo}</h5>
                            {
                                internet &&
                                <h5>{FormatCurrency(Number(tv.paquete.precioTachado))}</h5>
                            }
                            {
                                !internet &&
                                <h5>{FormatCurrency(Number(tv.paquete.precioPaquete))}</h5>
                            }
                        </div>

                        <p className="mb-[24px] w-full font-normal leading-[24px] text-base text-gray-250">
                            {`${resumenCopys.paquetes.tv.preCanales} ${tv.paquete.canales} ${resumenCopys.paquetes.tv.postCanales}`}
                        </p>
                    </div>
                </div>
            }

            {/* Selección Movil - Movil */}

            {
                (movil && movil !== null && Object.keys(movil).length > 0) &&
                <div className="flex flex-col gap-[8px] border-b-1 border-b-gray-150 pt-[24px]">
                    <div className="flex justify-between w-full font-bold leading-[24px] text-lg">
                        <h5>{resumenCopys.paquetes.movil.titulo}</h5>
                        <h5>{FormatCurrency(Number(movil.paquete.precioPaquete))}</h5>
                    </div>

                    <div className="flex-flex-col gap-[8px] pb-[24px] w-full font-normal leading-[24px] text-base text-gray-250">
                        {
                            movil.paquete.velocidadMaxima !== 0 ?
                                <p>
                                    {`${movil.paquete.velocidadMaxima} ${resumenCopys.paquetes.movil.unidad}`}
                                </p> :
                                <p>
                                    {resumenCopys.paquetes.movil.planComparte}
                                </p>
                        }
                        <p>
                            {movil.contrato}
                        </p>
                    </div>
                </div>
            }

            {/* Seleccion de otts adicionales - getPackageInfo */}

            {
                (tv && tv.ott?.planes && tv.ott?.planes.length > 0) &&
                <div className="flex flex-col gap-[8px] pt-[24px] border-b-1 border-b-gray-150">
                    <div className="flex justify-between items-center w-full font-bold leading-[24px] text-lg">
                        <h5>{resumenCopys.paquetes.tv.ott.titulo}</h5>
                        <h5>{FormatCurrency(tv.ott?.total)}</h5>
                    </div>
                    <div className="flex flex-col gap-[8px] pb-[24px]">
                        {tv.ott?.planes.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between w-full font-normal leading-[24px] text-base text-gray-250"
                            >
                                <h5>
                                    {`+ ${item.titulo}`}
                                </h5>
                            </div>
                        ))}
                    </div>
                </div>
            }

        </>
    )
}