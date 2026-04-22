import { PiggyBank } from "@/constants/IconsConstants";
import { ResumenData } from "@/types/ResumenCompra";

export default function BannerDomiciliacion({ copys }: { copys: ResumenData }) {

    return (
        <div className="flex flex-row gap-[8px] py-[12px]">
            <div className="w-[32px] h-[32px]">
                <PiggyBank />
            </div>
            <div className="text-base xl:text-lg leading-[24px]">
                <h1 className="font-bold">
                    {copys.ahorro.domiciliacion.titulo}
                </h1>
                <p>
                    {copys.ahorro.domiciliacion.subtitulo}
                </p>
            </div>
        </div>
    )
}