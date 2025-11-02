import ButtonFixedContracLanding from "@/components/atoms/ButtonStickyContrataLanding";
import { componentMap } from "@/lib/contentful/dynamic-map";
import { fetchComponentsBySlugPage } from "@/services/contentful/pages";
import { Entry, EntrySkeletonType } from "contentful";
import { notFound } from "next/navigation";
import {SeoFieldSkeleton} from "@/types/SEOTypes";
import SEOHead from '@/components/atoms/SEOHead';
import { setTelNumber, getTelNumber } from '@/services/izzi/getTelNumbers';

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
    'paquetes/goo/br/ul',
    'paquetes/goo/br/3pm',
    'paquetes/goo/br/izzitv',
    'paquetes/goo/br/4p',
    'paquetes/goo/br/3p',
    'paquetes/goo/br/2p',
    'paquetes/goo/br/ml',
    'paquetes/goo/br/pm',
    'paquetes1/goo/br/ul',
    'paquetes1/goo/br/3pm',
    'paquetes1/goo/br/izzitv',
    'paquetes1/goo/br/4p',
    'paquetes1/goo/br/3p',
    'paquetes1/goo/br/2p',
    'paquetes1/goo/br/ml',
    'paquetes1/goo/br/pm',
    'paquetes2/goo/nb/ul',
    'paquetes2/goo/nb/3p',
    'paquetes2/goo/nb/2p',
    'paquetes2/goo/nb/ml',
    'paquetes2/goo/nb/pm',
    'paquetes2/goo/nb/3pm',
    'paquetes2/goo/nb/izzitv',
    'paquetes2/goo/nb/4p',
    'paquetes3/goo/mp/ul',
    'paquetes3/goo/mp/3p',
    'paquetes3/goo/mp/2p',
    'paquetes3/goo/mp/ml',
    'paquetes3/goo/mp/pm',
    'paquetes3/goo/mp/3pm',
    'paquetes3/goo/mp/izzitv',
    'paquetes3/goo/mp/4p',
    'paquetes8/goo/kc/ul',
    'paquetes8/goo/kc/3p',
    'paquetes8/goo/kc/2p',
    'paquetes8/goo/kc/ml',
    'paquetes8/goo/kc/pm',
    'paquetes8/goo/kc/3pm',
    'paquetes8/goo/kc/izzitv',
    'paquetes8/goo/kc/4p',
    'paquetes12/goo/rmkt/ul',
    'paquetes12/goo/rmkt/3p',
    'paquetes12/goo/rmkt/2p',
    'paquetes12/goo/rmkt/ml',
    'paquetes12/goo/rmkt/pm',
    'paquetes12/goo/rmkt/3pm',
    'paquetes12/goo/rmkt/izzitv',
    'paquetes12/goo/rmkt/4p',
    'paquetes7/goo/dsp/ul',
    'paquetes7/goo/dsp/3p',
    'paquetes7/goo/dsp/2p',
    'paquetes7/goo/dsp/ml',
    'paquetes7/goo/dsp/pm',
    'paquetes7/goo/dsp/3pm',
    'paquetes7/goo/dsp/izzitv',
    'paquetes7/goo/dsp/4p',
    'paquetes7/goo/vid/ul',
    'paquetes7/goo/vid/3p',
    'paquetes7/goo/vid/2p',
    'paquetes7/goo/vid/ml',
    'paquetes7/goo/vid/pm',
    'paquetes7/goo/vid/3pm',
    'paquetes7/goo/vid/izzitv',
    'paquetes7/goo/vid/4p',
    'paquetes7/goo/dsc/ul',
    'paquetes7/goo/dsc/3p',
    'paquetes7/goo/dsc/2p',
    'paquetes7/goo/dsc/ml',
    'paquetes7/goo/dsc/pm',
    'paquetes7/goo/dsc/3pm',
    'paquetes7/goo/dsc/izzitv',
    'paquetes7/goo/dsc/4peter',
    'paquetes7/goo/pmx/ul',
    'paquetes7/goo/pmx/3p',
    'paquetes7/goo/pmx/2p',
    'paquetes7/goo/pmx/ml',
    'paquetes7/goo/pmx/pm',
    'paquetes7/goo/pmx/3pm',
    'paquetes7/goo/pmx/izzitv',
    'paquetes7/goo/pmx/4p',
    'paquetes7/goo/pr1/ul',
    'paquetes7/goo/pr1/3p',
    'paquetes7/goo/pr1/2p',
    'paquetes7/goo/pr1/ml',
    'paquetes7/goo/pr1/pm',
    'paquetes7/goo/pr1/3pm',
    'paquetes7/goo/pr1/izzitv',
    'paquetes7/goo/pr1/4p',
    'paquetes14/otr/pr1/ul',
    'paquetes14/otr/pr1/3p',
    'paquetes14/otr/pr1/2p',
    'paquetes14/otr/pr1/ml',
    'paquetes14/otr/pr1/pm',
    'paquetes14/otr/pr1/3pm',
    'paquetes14/otr/pr1/izzitv',
    'paquetes14/otr/pr1/4p',
    'paquetes14/otr/pr2/ul',
    'paquetes14/otr/pr2/3p',
    'paquetes14/otr/pr2/2p',
    'paquetes14/otr/pr2/ml',
    'paquetes14/otr/pr2/pm',
    'paquetes14/otr/pr2/3pm',
    'paquetes14/otr/pr2/izzitv',
    'paquetes14/otr/pr2/4p',
    'paquetes4/fbk/la/ul',
    'paquetes4/fbk/la/3p',
    'paquetes4/fbk/la/2p',
    'paquetes4/fbk/la/ml',
    'paquetes4/fbk/la/pm',
    'paquetes4/fbk/la/3pm',
    'paquetes4/fbk/la/izzitv',
    'paquetes4/fbk/la/4p',
    'paquetes13/fbk/rmkt/ul',
    'paquetes13/fbk/rmkt/3p',
    'paquetes13/fbk/rmkt/2p',
    'paquetes13/fbk/rmkt/ml',
    'paquetes13/fbk/rmkt/pm',
    'paquetes13/fbk/rmkt/3pm',
    'paquetes13/fbk/rmkt/izzitv',
    'paquetes13/fbk/rmkt/4p',
    'paquetes4/fbk/pr1/ul',
    'paquetes4/fbk/pr1/3p',
    'paquetes4/fbk/pr1/2p',
    'paquetes4/fbk/pr1/ml',
    'paquetes4/fbk/pr1/pm',
    'paquetes4/fbk/pr1/3pm',
    'paquetes4/fbk/pr1/izzitv',
    'paquetes4/fbk/pr1/4p',
    'paquetes6/bin/br/ul',
    'paquetes6/bin/br/3p',
    'paquetes6/bin/br/2p',
    'paquetes6/bin/br/ml',
    'paquetes6/bin/br/pm',
    'paquetes6/bin/br/3pm',
    'paquetes6/bin/br/izzitv',
    'paquetes6/bin/br/4p',
    'paquetes5b/amz/nb/ul',
    'paquetes5b/amz/nb/3p',
    'paquetes5b/amz/nb/2p',
    'paquetes5b/amz/nb/ml',
    'paquetes5b/amz/nb/pm',
    'paquetes5/emm/mp/ul',
    'paquetes5/emm/mp/3p',
    'paquetes5/emm/mp/2p',
    'paquetes5/emm/mp/ml',
    'paquetes5/emm/mp/pm',
    'paquetes5/emm/mp/3pm',
    'paquetes5/emm/mp/izzitv',
    'paquetes5/emm/mp/4p',
    'paquetes11/fly/qr/ul',
    'paquetes11/fly/qr/3p',
    'paquetes11/fly/qr/2p',
    'paquetes11/fly/qr/ml',
    'paquetes11/fly/qr/pm',
    'paquetes11/fly/qr/3pm',
    'paquetes11/fly/qr/izzitv',
    'paquetes11/fly/qr/4p',
    'paquetes7/pro/br/ul',
    'paquetes7/pro/br/3p',
    'paquetes7/pro/br/2p',
    'paquetes7/pro/br/ml',
    'paquetes7/pro/br/pm',
    'paquetes7/pro/br/3pm',
    'paquetes7/pro/br/izzitv',
    'paquetes7/pro/br/4p',
    'paquetes7/sms/br/ul',
    'paquetes7/sms/br/3p',
    'paquetes7/sms/br/2p',
    'paquetes7/sms/br/ml',
    'paquetes7/sms/br/pm',
    'paquetes7/sms/br/3pm',
    'paquetes7/sms/br/izzitv',
    'paquetes7/sms/br/4p',
    'paquetes7/tvsa/br/ul',
    'paquetes7/tvsa/br/3p',
    'paquetes7/tvsa/br/2p',
    'paquetes7/tvsa/br/ml',
    'paquetes7/tvsa/br/pm',
    'paquetes7/tvsa/br/3pm',
    'paquetes7/tvsa/br/izzitv',
    'paquetes7/tvsa/br/4p',
    'paquetes1m/goo/br/ul',
    'paquetes1m/goo/br/3p',
    'paquetes1m/goo/br/2p',
    'paquetes1m/goo/br/ml',
    'paquetes1m/goo/br/pm',
    'paquetes1m/goo/br/3pm',
    'paquetes1m/goo/br/izzitv',
    'paquetes1m/goo/br/4p',
    'paquetes2m/goo/nb/ul',
    'paquetes2m/goo/nb/3p',
    'paquetes2m/goo/nb/2p',
    'paquetes2m/goo/nb/ml',
    'paquetes2m/goo/nb/pm',
    'paquetes2m/goo/nb/3pm',
    'paquetes2m/goo/nb/izzitv',
    'paquetes2m/goo/nb/4p',
    'paquetes3m/goo/mp/ul',
    'paquetes3m/goo/mp/3p',
    'paquetes3m/goo/mp/2p',
    'paquetes3m/goo/mp/ml',
    'paquetes3m/goo/mp/pm',
    'paquetes3m/goo/mp/3pm',
    'paquetes3m/goo/mp/izzitv',
    'paquetes3m/goo/mp/4p',
    'paquetes8m/goo/kc/ul',
    'paquetes8m/goo/kc/3p',
    'paquetes8m/goo/kc/2p',
    'paquetes8m/goo/kc/ml',
    'paquetes8m/goo/kc/pm',
    'paquetes8m/goo/kc/3pm',
    'paquetes8m/goo/kc/izzitv',
    'paquetes8m/goo/kc/4p',
    'paquetes4m/fbk/la/ul',
    'paquetes4m/fbk/la/3p',
    'paquetes4m/fbk/la/2p',
    'paquetes4m/fbk/la/ml',
    'paquetes4m/fbk/la/pm',
    'paquetes4m/fbk/la/3pm',
    'paquetes4m/fbk/la/izzitv',
    'paquetes4m/fbk/la/4p',
    'paquetes7m/pro/br/ul',
    'paquetes7m/pro/br/3p',
    'paquetes7m/pro/br/2p',
    'paquetes7m/pro/br/ml',
    'paquetes7m/pro/br/pm',
    'paquetes7m/pro/br/3pm',
    'paquetes7m/pro/br/izzitv',
    'paquetes7m/pro/br/4p',
    'paquetes6m/bin/br/ul',
    'paquetes6m/bin/br/3p',
    'paquetes6m/bin/br/2p',
    'paquetes6m/bin/br/ml',
    'paquetes6m/bin/br/pm',
    'paquetes7/goo/co/ul',
    'paquetes7/goo/co/3p',
    'paquetes7/goo/co/2p',
    'paquetes7/goo/co/ml',
    'paquetes7/goo/co/pm',
    'paquetes7/goo/co/3pm',
    'paquetes7/goo/co/izzitv',
    'paquetes7/goo/co/4p',
    'paquetes7/goo/pr2/ulter',
    'paquetes7/goo/pr2/3p',
    'paquetes7/goo/pr2/2p',
    'paquetes7/goo/pr2/ml',
    'paquetes7/goo/pr2/pm',
    'paquetes7/goo/pr2/3pm',
    'paquetes7/goo/pr2/izzitv',
    'paquetes7/goo/pr2/4p'
    ];
    
    const fullPath = [paqueteKey, ...slugs].join('/');

    if(!urlList.includes(fullPath)){
        return notFound();
    }

    const page = await fetchComponentsBySlugPage(fullPath);
    const components = page.items || [];

    /* valores para enviar valor de fullpath, no borrar */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const validateNumber = setTelNumber(fullPath)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const seNumber = getTelNumber()

    const seoEntry = components[0]?.fields.seoMetadata as Entry<SeoFieldSkeleton, undefined, string>;
    const seo = seoEntry?.fields;



    if (page.total !== 1) {
        notFound();
    }


    return (
        <>

        {seo && <SEOHead seo={seo} slug={fullPath} />}
        
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