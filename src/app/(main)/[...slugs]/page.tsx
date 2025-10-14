import { Entry, EntrySkeletonType } from "contentful";
import { componentMap } from "@/lib/contentful/dynamic-map";
import { fetchComponentsBySlugPage } from "@/services/contentful/pages";
import { notFound } from "next/navigation";
import ButtonFixed from "@/components/atoms/ButtonSticky";
import {SeoFieldSkeleton, DynamicPageProps} from "@/types/SEOTypes";


export default async function DynamicPage({ params }: DynamicPageProps) {
  const {slugs} = await params; //Sugerencia de NextJS para obtener los parametros de la ruta
  // Unir segmentos anidados en un solo slug, p.ej. ['television', 'canales'] -> 'television/canales'
  const fullPath = slugs.join('/');

  const page = await fetchComponentsBySlugPage(fullPath);
  const components = page.items || [];
  

  const seoEntry = components[0]?.fields.seoMetadata as Entry<SeoFieldSkeleton, undefined, string>;
  const seo = seoEntry?.fields;
  
  const bastURL =  seo.baseUrl;
  const canonicalURL = `${bastURL}/${fullPath}`;

  if (page.total !== 1) {
    notFound();
  }
  console.log('>>>>🥑🥑 seo ', seo)
  return (
    <>
    <link rel="canonical" href={canonicalURL}/>
    <title>{seo?.titulo || "izzi"}</title>
    <meta name="description" content={seo?.descripcion || "izzi desc"} />

    <meta name="robots" content={seo?.noIndex ? 'noIndex, no follow' : 'index, follow'} />
    
    <meta property="og:title" content={seo?.tituloCorto || 'izzi'}/>
    <meta property="og:description" content={seo?.descripcionCorto || 'izzi descripcion'}/>

    <meta property="og:type" content="website"/>
    

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