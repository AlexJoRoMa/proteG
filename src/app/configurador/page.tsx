
import CardPlanesInternet from "@/components/atoms/cardPlanesInternet"
import { getCopyForComponent } from "@/services/contentful/components";
import { configuradorCopyFields } from "@/types/ConfiguradorTypes";

export default async function ConfiguradorPage() {

    const pageCopy = await getCopyForComponent('configurador');
    const pageInfo = pageCopy.configurador as unknown as configuradorCopyFields;    

    const DUMMY_INTERNET_CARD = [
        {
            index: 1,
            minInternet: '80',
            maxInternet: '120',
            price: '369',
        },
        {
            index: 2,
            minInternet: '150',
            maxInternet: '200',
            price: '459',
        },
        {
            index: 3,
            minInternet: '200',
            maxInternet: '500',
            price: '519',
        },
        {
            index: 4,
            minInternet: '500',
            maxInternet: '1000',
            price: '639',
        }
    ];

    return (
        <div className="grid px-[16px] pb-20 sm:p-20 font-[family-name:var(--lato)]">
            <div className='my-[24px]'>
                <h4 className='font-normal text-lg leading-[24px]'>{pageInfo.title}</h4>
            </div>

            <div className='grid gap-[24px]'>
                <div className='w-full py-[10px] flex flex-col gap-[24px]'>
                    <div className='flex flex-row gap-[8px] items-center'>
                        <p className='w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center'>1</p>
                        <h3 className='font-semibold text-xl leading-[24px]'>{pageInfo.cobertura}</h3>
                    </div>
                    <p>TODO: campo imput codigo postal & copy "por que lo necesitamos"</p>
                    <p>TODO:*campo "porque lo necesitamos" abre un modal de pantalla completa</p>
                </div>

                <div className='w-full py-[10px] flex flex-col gap-[24px]'>
                    <div className='flex flex-row gap-[8px] items-center'>
                        <p className='w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center'>2</p>
                        <h3 className='font-semibold text-xl leading-[24px]'>{pageInfo.internet}</h3>
                    </div>
                    <CardPlanesInternet plans={DUMMY_INTERNET_CARD} />
                </div>

                <div className='w-full py-[10px] flex flex-col gap-[24px]'>
                    <div className='flex flex-row gap-[8px] items-center'>
                        <p className='w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center'>3</p>
                        <h3 className='font-semibold text-xl leading-[24px]'>{pageInfo.tv.title}</h3>
                    </div>
                    <p>TODO: tarjeta unica - producto</p>
                    <h5 className='font-normal leading-[24px] text-base'>{pageInfo.tv.description}</h5>
                    <p>TODO: *si se selecciona la opcion, agregar dos campos de select (añade más diversion, incluye canales a la carta)</p>
                    <p>TODO: **agregar tarjetas de canales a los selectores</p>
                </div>
                
                <div className='w-full py-[10px] flex flex-col gap-[24px]'>
                    <div className='flex flex-row gap-[8px] items-center'>
                        <p className='w-[40px] h-[40px] text-white-0 bg-black-0 rounded-full font-semibold text-base leading-[24px] flex justify-center items-center'>4</p>
                        <h3 className='font-semibold text-xl leading-[24px]'>{pageInfo.movil}</h3>
                    </div>
                    <p>TODO: tabs de plazos (contrato 12 meses, sin plazo) con 4 tarjetas de producto</p>
                    <p>TODO: *las tarjetas de paquetes deben ser checkbox</p>
                </div>

            </div>
            <p>Agregar sticky al final con boton contratar (mobile)</p>
            <p>* agregar popups emergentes</p>

        </div>
    )
}