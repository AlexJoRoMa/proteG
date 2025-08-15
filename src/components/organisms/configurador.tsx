import { contentfulClient } from "@/services/contentful/client";
import { ConfigDataFields, ConfiguradorProps, OttsImages, ResumenIcon } from "@/types/ConfiguradorTypes";
import { Entry, EntrySkeletonType } from "contentful";
import { ConfiguradorProvider } from "@/utils/ConfiguradorProvider";
import { componentMap } from "@/lib/configurador/dynamic-map";
import Link from "next/link";
import { getCopyForComponent } from "@/services/contentful/components";
import ResumenPedido from "../molecules/configurador/resumenPedido";

export const Arrow =
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 5L9 12L15 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

export default async function Configurador({ id }: ConfiguradorProps) {

    const pageEntry: Entry<EntrySkeletonType, undefined> | null = await contentfulClient.getEntries({
        content_type: 'multiStepContainer',
        'sys.id': id,
        include: 5
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });

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

    const entryBackButton = pageEntry?.fields.backText as string;
    const entryBackButtonUrl = pageEntry?.fields.backTextUrl as string;
    const entryTitle = pageEntry?.fields.title as string;
    const entryHelp = pageEntry?.fields.helpText as string;
    const entryCTA = pageEntry?.fields.ctaText as string;

    const components = pageEntry?.fields.steps as unknown as EntrySkeletonType<ConfigDataFields>[] | null;

    const configuradorEntry: Record<string, EntrySkeletonType<ConfigDataFields>> = {};

    if (components && components !== null) {
        for (const item of components) {
            configuradorEntry[item.fields.type] = item
        }
    }
    console.log('entry', configuradorEntry)
    console.log('otts', ottImages)

    return (
        <ConfiguradorProvider 
            configuradorEntry={configuradorEntry} 
            copysResumen={copysResumen} 
            resumenIcon={resumenIcon} 
            ottsImages ={ottImages}
        >
            <div className="flex flex-col md:grid md:grid-cols-3 gap-[24px] md:mx-md 2xl:mx-xl">
                <div className="md:col-span-2">
                    <div className="flex flex-col pb-[16px] md:pb-[24px] mx-[16px] md:mx-0 font-[family-name:var(--lato)]">
                        <div className='flex flex-col mt-[24px] mb-[34px] gap-[24px]'>
                            <Link
                                href={entryBackButtonUrl}
                            >
                                <div className="flex flex-row gap-[4px] items-center">
                                    <p>{Arrow}</p>
                                    <h5 className="font-bold leading-[24px] text-base md:text-xl text-black-0">{entryBackButton}</h5>
                                </div>
                            </Link>
                            <h4 className='font-bold text-xl md:text-[32px] leading-[24px] md:leading-[40px]'>{entryTitle}</h4>
                        </div>

                        <div className='grid gap-[24px]'>
                            {
                                components && components !== null && Array.isArray(components) && components.length > 0 ? (
                                    (components.map((component: EntrySkeletonType<ConfigDataFields> | null, index) => {
                                        const componentType = component?.fields?.type;
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
                <div className="md:mt-[34px] sticky z-10 bottom-0 md:static md:top-auto md:z-0 shadow-[0_-2px_20px_0_rgba(0,0,0,0.12)] md:shadow-none">
                    <ResumenPedido />
                </div>
            </div>
        </ConfiguradorProvider>
    )
}