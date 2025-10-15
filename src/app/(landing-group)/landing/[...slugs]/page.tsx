import ButtonFixed from "@/components/atoms/ButtonSticky";
import { componentMap } from "@/lib/contentful/dynamic-map";
import { fetchComponentsBySlugPage } from "@/services/contentful/pages";
import { Entry, EntrySkeletonType } from "contentful";
import { notFound } from "next/navigation";
import {SeoFieldSkeleton, SeoFields, DynamicPageProps} from "@/types/SEOTypes";


export default async function LandingPage({ params }: DynamicPageProps) {
    const { slugs } = await params; //Sugerencia de NextJS para obtener los parametros de la ruta
    // Unir segmentos anidados en un solo slug, p.ej. ['television', 'canales'] -> 'television/canales'
    const fullPath = ["landing", ...slugs].join('/');

    const page = await fetchComponentsBySlugPage(fullPath);
    const components = page.items || [];

    const seoEntry = components[0]?.fields.seoMetadata as Entry<SeoFieldSkeleton, undefined, string>;
    const seo = seoEntry?.fields;

    const bastURL =  seo.baseUrl;
    const canonicalURL = `${bastURL}/${fullPath}`;

    const imagen = (seo?.imagen as SeoFields["imagen"])
    const imgURL = imagen.fields.image.fields.file.url;

    if (page.total !== 1) {
        notFound();
    }

   
    return (
        <>
        <link rel="canonical" href={canonicalURL}/>
        <title>{seo?.titulo || "izzi"}</title>
        <meta name="description" content={seo?.descripcion || "izzi desc"} />
        <meta name="robots" content={seo?.noIndex ? 'index, follow' : 'noIndex, no follow'} />
        
        {/* OpenGraph */}
        <meta property="og:title" content={seo?.tituloCorto || 'izzi'}/>
        <meta property="og:description" content={seo?.descripcionCorto || 'izzi descripcion'}/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={canonicalURL} />
        {imgURL && <meta property="og:image" content={imgURL}/>}
        
        {/* Twitter summary summary_large_image */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo?.tituloCorto || 'izzi'}/>
        <meta name="twitter:description" content={seo?.descripcionCorto || 'izzi descripcion'}/>
        {imgURL && <meta name="twitter:image" content={imgURL}/>}
        
        
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
            <ButtonFixed />
        </main>
        </>
    );
}