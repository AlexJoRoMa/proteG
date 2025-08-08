import PlanesInternet from "@/components/molecules/configurador/planesInternet"
import { contentfulClient } from "@/services/contentful/client";
import { CodigoPostalProps, ConfigDataFields, ConfiguradorProps } from "@/types/ConfiguradorTypes";
import { Entry, EntrySkeletonType } from "contentful";
import PlanesTv from "../molecules/configurador/planesTv";
import CoberturaCP from "../molecules/configurador/coberturaCP";
import PlanesMovil from "../molecules/configurador/planesMovil";
import { getCopyForComponent } from "@/services/contentful/components";
import { ConfiguradorProvider } from "@/utils/ConfiguradorProvider";
import { componentMap } from "@/lib/configurador/dynamic-map";

export default async function Configurador({ id }: ConfiguradorProps) {

    const response = await getCopyForComponent("Codigo Postal");
    const coberturaCopy = response as unknown as CodigoPostalProps;

    const pageEntry: Entry<EntrySkeletonType, undefined> | null = await contentfulClient.getEntries({
        content_type: 'multiStepContainer',
        'sys.id': id,
        include: 5
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });


    const entryTitle = pageEntry?.fields.title as string;
    const entryHelp = pageEntry?.fields.helpText as string;
    const entryCTA = pageEntry?.fields.ctaText as string;

    const components = pageEntry?.fields.steps as unknown as EntrySkeletonType<ConfigDataFields>[] | null;

    return (
        <ConfiguradorProvider value={{ coberturaCopy, pageEntry }}>
            <div className="grid px-[16px] pb-20 sm:p-20 font-[family-name:var(--lato)]">
                <div className='my-[24px]'>
                    <h4 className='font-normal text-lg leading-[24px]'>{entryTitle}</h4>
                </div>

                <div className='grid gap-[24px]'>
                    {
                        components && components !== null && Array.isArray(components) && components.length > 0 ? (
                            (components.map((component: EntrySkeletonType<ConfigDataFields> | null, index) => {
                                const componentType = component?.fields?.type;
                                const Component = typeof componentType === 'string' && componentType in componentMap ? componentMap[componentType as keyof typeof componentMap] : null;

                                return Component ? <Component key={index} /> : null;
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
                {/* //TODO: Agregar sticky al final con boton contratar (mobile) */}
                {/* //TODO: Abrir drawer al hacer click en botón "¿Te ayudamos?" */}
            </div>
        </ConfiguradorProvider>
    )
}