import ButtonFixedContracLanding from "@/components/atoms/ButtonStickyContrataLanding";
import { componentMap } from "@/lib/contentful/dynamic-map";
import { fetchComponentsBySlugPage } from "@/services/contentful/pages";
import { Entry, EntrySkeletonType } from "contentful";
import { notFound } from "next/navigation";

/* import NavigationLanding from '@/components/molecules/navigationLandingComponent'; */

interface DynamicPageProps {
    params: Promise<{
        slugs: string[];
        paqueteKey: string;
    }>;
}

export default async function LandingPage({ params }: DynamicPageProps) {
    const { slugs, paqueteKey } = await params; //Sugerencia de NextJS para obtener los parametros de la ruta
    // Unir segmentos anidados en un solo slug, p.ej. ['television', 'canales'] -> 'television/canales'

    const urlList = [
        'paquetes',
        'paquetes1',
        'paquetes2',
        'paquetes3',
        'paquetes8',
        'paquetes12',
        'paquetes13',
        'paquetes6',
        'paquetes5b',
        'paquetes5',
        'paquetes11',
        'paquetes7',
        'paquetes1m',
        'paquetes2m',
        'paquetes3m',
        'paquetes8m',
        'paquetes4m',
        'paquetes7m',
        'paquetes6m',
        'paquetes4/fbk/la',
        'paquetes4/fbk/pr1',
        'paquetes14/otr/pr1',
        'paquetes14/otr/pr2',
        'paquetes7/goo/dsp',
        'paquetes7/goo/vid',
        'paquetes7/goo/dsc',
        'paquetes7/goo/pmx',
        'paquetes7/goo/pr1',
        'paquetes7/pro/br/ul',
        'paquetes7/sms/br/ul',
        'paquetes7/tvsa/br',
        'paquetes7/goo/co',
        'paquetes7/goo/pr2',
    ];

    if(!urlList.includes(paqueteKey)){
        return notFound();
    }
    
    const fullPath = [paqueteKey, ...slugs].join('/');

    const page = await fetchComponentsBySlugPage(fullPath);
    const components = page.items || [];

   


    if (page.total !== 1) {
        notFound();
    }

    console.log('👽 slugs ', slugs)
    console.log('👽 paqueteKey ', paqueteKey)
    console.log('👽 fullPath ', fullPath)


    return (
        <>
        
        
        
        <main>
            
            {components[0]?.fields.components &&
                Array.isArray(components[0].fields.components) &&
                components[0].fields.components.length > 0 ? (
                (components[0].fields.components as Entry<EntrySkeletonType, undefined, string>[]).map(
                    (component, index) => {
                        const type = component.fields.type;
                        const Component =
                            typeof type === 'string' && type in componentMap
                                ? componentMap[type as keyof typeof componentMap]
                                : null;
                        return Component ? <Component key={index} id={component.sys.id} /> : null;
                    }
                )
            ) : (
                <p>No existen componentes cargados.</p>
            )}
            <ButtonFixedContracLanding />
        </main>
        </>
    );
}