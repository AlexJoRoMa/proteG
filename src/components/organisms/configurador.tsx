import { contentfulClient } from "@/services/contentful/client";
import { CoberturaType, ConfiguradorCopys, OttsImages, PreSelection, ResumenIcon } from "@/types/ConfiguradorTypes";
import { Entry, EntrySkeletonType } from "contentful";
import { getCopyForComponent } from "@/services/contentful/components";
import { ConfiguradorProvider } from "@/utils/ConfiguradorProvider";
import ExitGuard from "@/utils/guards/ExitGuard";
import { componentMap } from "@/lib/configurador/dynamic-map";
import Link from "next/link";
import ResumenPedido from "../molecules/configurador/resumenPedido";
import ResumenInfo from "../molecules/configurador/resumenInfo";
import { STEPSCOVERAGECOMPONENT, STEPSNOCOVERAGECOMPONENT } from "@/constants/ConfiguradorConstants";
import { getOfertas } from "@/services/izzi/configurador";
import LinkModal from "../atoms/LinkModal";
import TeAyudamosModalComponent from "../layouts/modals/TeAyudamosModalComponent";
import { Arrow } from "@/constants/IconsConstants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getCobertura() {
    const cookieStore = await cookies()
    
    const existZipCode = cookieStore.has('zipCode');
    const existLat = cookieStore.has('lat');
    const existLng = cookieStore.has('lng');

    if (existZipCode && existLat && existLng) {
        const lat = cookieStore.get('lat');
        const lng = cookieStore.get('lng');
        const zipCode = cookieStore.get('zipCode');
        const municipio = cookieStore.get('municipio');
        const colonia = cookieStore.get('colonia');
        const calle = cookieStore.get('calle');
        const numExt = cookieStore.get('numExt');
        const estado = cookieStore.get('estado');
        const formattedAddress = cookieStore.get('formattedAddress');

        return {
            lat: lat?.value,
            lng: lng?.value,
            zipCode: zipCode?.value,
            municipio: municipio?.value,
            colonia: colonia?.value,
            calle: calle?.value,
            numExt: numExt?.value,
            estado: estado?.value,
            address: formattedAddress?.value
        }
    }
    else {
        redirect('/consulta-cobertura');
    }
}

async function getPreseleccionPaquetes() {
    const cookieStore = await cookies()

    const plan = cookieStore.get('seleccionPaquete');
    const movil = cookieStore.get('seleccionMovil');

    return {
        seleccionPaquete: plan?.value ?? null,
        seleccionMovil: movil?.value ?? null,
    }
}

export default async function Configurador() {

    const getCookies = await getCobertura() as unknown as CoberturaType;
    const dataOffersEntry = await getOfertas(getCookies);
    const preSeleccionPaquetes = await getPreseleccionPaquetes();

    const resumenIcon = await contentfulClient.getEntries({
        content_type: 'media',
        'fields.internalName': 'Resumen-Icono-Promociones',
        include: 5,
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    }) as unknown as EntrySkeletonType<ResumenIcon>;

    const ottImages: Entry<EntrySkeletonType<OttsImages>>[] = await contentfulClient.getEntries({
        content_type: 'OttsImagesContainer',
        include: 5
    }).then((entriesResponse) => {
        return entriesResponse.items
    }) as unknown as Entry<EntrySkeletonType<OttsImages>>[];

    const copysResumen = await getCopyForComponent('Resumen-de-Compra').then((entry) => {
        return entry.resumen
    });

    const copysConfigurador = await getCopyForComponent('Configurador').then((entry) => {
        return entry.configurador
    }) as unknown as ConfiguradorCopys;

    const entryBackButton = copysConfigurador.page.botonRegreso.titulo;
    const entryBackButtonUrl = copysConfigurador.page.botonRegreso.url;
    const entryTitle = copysConfigurador.page.titulo;
    const entryHelp = copysConfigurador.page.ayuda.textoInfo;
    const entryCTA = copysConfigurador.page.ayuda.botonAyuda;

    
    let cobertura: boolean = false;
    
    if (dataOffersEntry?.offers.DOBLE_PLAY ) {
        cobertura = true;
    } else {
        cobertura = false;
    }
    
    return (
        <ConfiguradorProvider
            configuradorEntry={dataOffersEntry}
            copysResumen={copysResumen}
            copysConfigurador={copysConfigurador}
            resumenIcon={resumenIcon}
            ottsImages={ottImages}
            cobertura={cobertura}
            initialCoberturaData={getCookies}
        >
            {/* Guard detector de salida del flujo */}
            <ExitGuard />
            <section className="border-t-1 border-t-gray-150">
                <div className="flex flex-col xl:grid xl:grid-cols-3 gap-[24px] xl:mx-md 4xl:mx-xl">
                    <div className="xl:col-span-2">
                        <div className="flex flex-col pb-[16px] xl:pb-[24px] mx-[16px] xl:mx-0 font-[family-name:var(--lato)]">
                            <div className='flex flex-col mt-[24px] mb-[34px] gap-[24px]'>
                                <Link
                                    href={entryBackButtonUrl}
                                >
                                    <div className="flex flex-row gap-[4px] items-center">
                                        <p><Arrow /></p>
                                        <h5 className="font-bold leading-[24px] text-base xl:text-xl text-black-0">{entryBackButton}</h5>
                                    </div>
                                </Link>
                                <h4 className='font-bold text-xl xl:text-[32px] leading-[24px] xl:leading-[40px]'>{entryTitle}</h4>
                            </div>

                            {/* Mapeo dinamico de pasos del configurador según cobertura */}
                            <div className='grid gap-[24px]'>
                                {
                                    cobertura ?
                                        Array.isArray(STEPSCOVERAGECOMPONENT) && STEPSCOVERAGECOMPONENT.length > 0 ? (
                                            (STEPSCOVERAGECOMPONENT.map((component, index) => {
                                                const componentType = component;
                                                const Component = typeof componentType === 'string' && componentType in componentMap ? componentMap[componentType as keyof typeof componentMap] : null as unknown as React.ComponentType<unknown>;

                                                return Component ? <Component key={index} step={index + 1} preSeleccion={preSeleccionPaquetes as PreSelection}/> : null;
                                            }))
                                        ) : (
                                            <p>No existen componentes cargados.</p>
                                        ) :
                                        Array.isArray(STEPSNOCOVERAGECOMPONENT) && STEPSNOCOVERAGECOMPONENT.length > 0 ? (
                                            (STEPSNOCOVERAGECOMPONENT.map((component, index) => {
                                                const componentType = component;
                                                const Component = typeof componentType === 'string' && componentType in componentMap ? componentMap[componentType as keyof typeof componentMap] : null as unknown as React.ComponentType<unknown>;

                                                return Component ? <Component key={index} step={index + 1} preSeleccion={preSeleccionPaquetes as PreSelection}/> : null;
                                            }))
                                        ) : (
                                            <p>No existen componentes cargados.</p>
                                        )
                                }
                            </div>

                            <div className='flex flex-col my-[24px] gap-[10px]'>
                                <h4 className='font-normal text-lg leading-[24px]'>{entryHelp}</h4>
                                <LinkModal
                                    classNames='text-base leading-[24px] font-bold underline cursor-pointer'
                                    text={entryCTA}
                                    closeButtonStroke='black'
                                    backdropColor='black-0/80'
                                    idModal={""}
                                    modalContentClassName="2xl:w-[62vw] 2xl:h-[52vh] xl:w-[90vw] xl:h-[52vh] h-[98vh]"
                                >
                                    <TeAyudamosModalComponent />
                                </LinkModal>
                            </div>
                        </div>
                    </div>

                    {/* Resumen de pedido & Sticky mobile */}
                    <div className="xl:mt-[34px] sticky z-10 bottom-0 xl:static xl:top-auto xl:z-0">
                        <div className="block xl:hidden mx-[16px] mb-[16px] xl:mx-0">
                            <ResumenInfo />
                        </div>
                        <div className="shadow-[0_-2px_20px_0_rgba(0,0,0,0.12)] xl:shadow-none">
                            <ResumenPedido />
                        </div>
                        <div className="hidden xl:block mx-[16px] xl:mx-0 xl:mt-[24px]">
                            <ResumenInfo />
                        </div>
                    </div>
                </div>
                </section>
        </ConfiguradorProvider>
    )
}