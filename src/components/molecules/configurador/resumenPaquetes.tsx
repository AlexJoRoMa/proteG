import { ComponentsFields } from "@/types/ConfiguradorTypes";
import { useContent } from "@/utils/ConfiguradorProvider"

export default function ResumenPaquetes() {

    const content = useContent();

    const paquetes = content.userAnswers as unknown as Record<string, ComponentsFields>;
    console.log('paquetes', paquetes)

    const internet = paquetes.internet;
    const tv = paquetes.tv;
    const movil = paquetes.movil;

    return (
        <>
            {
                (internet && internet !== null && Object.keys(internet).length > 0) &&
                <div className="flex flex-col gap-[24px] border-b-1 border-b-gray-150 pt-[24px]">
                    <div className="flex justify-between w-full font-bold leading-[24px] text-lg">
                        <h5>Internet</h5>
                        <h5>Precio promocional</h5>
                    </div>

                    <div className="flex-flex-col gap-[8px] pb-[8px] w-[90%] font-normal leading-[24px] text-base text-gray-250">
                        <p>
                            {`Internet de ${internet.fields.minCapacityInternet}MB`}
                        </p>
                        <p>
                            {`Durante los 6 primeros meses contarás con ${internet.fields.maxCapacityInternet}`}
                        </p>
                    </div>
                </div>
            }

            {
                (tv && tv !== null && Object.keys(tv).length > 0) &&
                <div className="flex flex-col">
                    <div className="flex flex-col gap-[24px] border-b-1 border-b-gray-150 pt-[24px]">
                        <div className="flex justify-between w-full font-bold leading-[24px] text-lg">
                            <h5>{tv.paquete.fields.title}</h5>
                            <h5>{`$${tv.paquete.fields.discountPrice ? tv.paquete.fields.discountPrice : tv.paquete.fields.price}`}</h5>
                        </div>

                        <div className="flex-flex-col gap-[8px] pb-[8px] w-[90%] font-normal leading-[24px] text-base text-gray-250">
                            <p>
                                {`Incluye ${tv.paquete.fields.subTitle}`}
                            </p>
                            <p>
                                {"Entrega a domicilio"}
                            </p>
                            <p>
                                {"Contrato a 12 meses"}
                            </p>
                        </div>
                    </div>

                    <div className="py-[24px] border-b-1 border-b-gray-150">
                        <div className="flex justify-between items-center w-full font-bold leading-[24px] text-lg">
                            <h5>{"OTTS"}</h5>
                            <h5>$XXXX</h5>
                        </div>
                    </div>
                </div>
            }

            {
                (movil && movil !== null && Object.keys(movil).length > 0) &&
                <div className="flex flex-col gap-[24px] border-b-1 border-b-gray-150 pt-[24px]">
                    <div className="flex justify-between w-full font-bold leading-[24px] text-lg">
                        <h5>{`Línea móvil ${movil.fields.title}`}</h5>
                        <h5>{`$${tv.fields.discountPrice ? tv.fields.discountPrice : tv.fields.price}`}</h5>
                    </div>

                    <div className="flex-flex-col gap-[8px] pb-[8px] w-[90%] font-normal leading-[24px] text-base text-gray-250">
                        <p>
                            {"Sin portabilidad"}
                        </p>
                        <p>
                            {"Entrega a domicilio"}
                        </p>
                    </div>
                </div>
            }

        </>
    )
}