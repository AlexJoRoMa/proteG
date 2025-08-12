import { useContent } from "@/utils/ConfiguradorProvider"

export default function ResumenPaquetes() {

    const content = useContent();

    const paquetes = content.userAnswers;

    console.log('resumen paquetes', paquetes)

    return (
        <>
            {/* {
                Object.entries(paquetes).map(([key, value]) => (

                    <div className="pt-[24px]">
                        <div>

                        </div>
                    </div>
                )
            } */}
            PAQUETES
        </>
    )
}