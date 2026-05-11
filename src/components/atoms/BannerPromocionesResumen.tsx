import { CircleCheck } from "@/constants/IconsConstants";
import { ResumenData } from "@/types/ResumenCompra";

export default function BannerPromocionesResumen({copys}: {copys: ResumenData}) {
    return (
        <section className="flex flex-row gap-[16px] w-full rounded-md p-[16px] bg-green-700 mt-0">
            <div className="w-[24px] h-[24px]">
                <CircleCheck />
            </div>
            <h5 className="text-base font-bold leading-[24px] text-white-0">
                {copys.promociones.titulo}
            </h5>
        </section>
    )
}