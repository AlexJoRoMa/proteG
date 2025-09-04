import { contentfulClient } from "@/services/contentful/client";
import { ConfiguradorCopys, ConfiguradorProps, OttsImages, ResumenIcon } from "@/types/ConfiguradorTypes";
import { Entry, EntrySkeletonType } from "contentful";
import { ConfiguradorProvider } from "@/utils/ConfiguradorProvider";
import { componentMap } from "@/lib/configurador/dynamic-map";
import Link from "next/link";
import { getCopyForComponent } from "@/services/contentful/components";
import ResumenPedido from "../molecules/configurador/resumenPedido";
import ResumenInfo from "../molecules/configurador/resumenInfo";
import { STEPSCOVERAGECOMPONENT, STEPSNOCOVERAGECOMPONENT } from "@/constants/ConfiguradorConstants";
import ExitGuard from "./ExitGuard";
import { getOfertas } from "@/services/izzi/configurador";

export const Arrow =
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 5L9 12L15 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

export default async function Configurador() {

    const dataOffersEntry = await getOfertas();

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
    const cobertura: boolean = true;

    return (
        <ConfiguradorProvider
            configuradorEntry={dataOffersEntry}
            copysResumen={copysResumen}
            copysConfigurador={copysConfigurador}
            resumenIcon={resumenIcon}
            ottsImages={ottImages}
            cobertura={cobertura}
        >
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
                                        <p>{Arrow}</p>
                                        <h5 className="font-bold leading-[24px] text-base xl:text-xl text-black-0">{entryBackButton}</h5>
                                    </div>
                                </Link>
                                <h4 className='font-bold text-xl xl:text-[32px] leading-[24px] xl:leading-[40px]'>{entryTitle}</h4>
                            </div>

                            <div className='grid gap-[24px]'>
                                {
                                    cobertura ?
                                        Array.isArray(STEPSCOVERAGECOMPONENT) && STEPSCOVERAGECOMPONENT.length > 0 ? (
                                            (STEPSCOVERAGECOMPONENT.map((component, index) => {
                                                const componentType = component;
                                                const Component = typeof componentType === 'string' && componentType in componentMap ? componentMap[componentType as keyof typeof componentMap] : null as unknown as React.ComponentType<unknown>;

                                                return Component ? <Component key={index} step={index + 1} /> : null;
                                            }))
                                        ) : (
                                            <p>No existen componentes cargados.</p>
                                        ) :
                                        Array.isArray(STEPSNOCOVERAGECOMPONENT) && STEPSNOCOVERAGECOMPONENT.length > 0 ? (
                                            (STEPSNOCOVERAGECOMPONENT.map((component, index) => {
                                                const componentType = component;
                                                const Component = typeof componentType === 'string' && componentType in componentMap ? componentMap[componentType as keyof typeof componentMap] : null as unknown as React.ComponentType<unknown>;

                                                return Component ? <Component key={index} step={index + 1} /> : null;
                                            }))
                                        ) : (
                                            <p>No existen componentes cargados.</p>
                                        )
                                }
                            </div>

                            <div className='flex flex-col my-[24px] gap-[10px]'>
                                <h4 className='font-normal text-lg leading-[24px]'>{entryHelp}</h4>
                                <h5 className="text-base leading-[24px] font-bold underline">{entryCTA}</h5>
                            </div>
                            {/* //TODO: Abrir drawer al hacer click en botón "¿Te ayudamos?" */}
                        </div>
                    </div>
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