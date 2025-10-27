import { PagoEfectivoIcon } from "@/constants/IconsConstants";
import { useMicrocopies } from "@/hooks/useMicrocopies";

export default function PagoTecnico() {

    const { getValue } = useMicrocopies('contratacion-pago');

    return (
        <section className="w-full">
            <div className='text-center mt-7'>
                <p
                    className='text-[16px] leading-6 mb-7 xl:text-start'
                >
                    {getValue('pago.tecnico.subtitulo')}
                </p>

                <PagoEfectivoIcon />

                <p
                    className='font-bold text-[16px] leading-6'
                >
                    {getValue('pago.tecnico.agradecimiento')}
                </p>
            </div>
        </section>
    )
}