import { Entry, EntrySkeletonType } from "contentful";
import { componentMap } from "@/lib/contentful/dynamic-map";
import { fetchComponentsBySlugPage } from "@/services/contentful/pages";
import { notFound } from "next/navigation";
import ButtonFixed from "@/components/atoms/ButtonSticky";
import {SeoFieldSkeleton, DynamicPageProps} from "@/types/SEOTypes";
import SEOHead from '@/components/atoms/SEOHead';

export default async function DynamicPage({ params }: DynamicPageProps) {
  const {slugs} = await params; //Sugerencia de NextJS para obtener los parametros de la ruta
  // Unir segmentos anidados en un solo slug, p.ej. ['television', 'canales'] -> 'television/canales'
  const fullPath = slugs.join('/');

  const page = await fetchComponentsBySlugPage(fullPath);
  const components = page.items || [];
  
  const validComponent = components.filter(paquete => 
  (paquete.fields?.paquetes ?? false) === false
  );

  const seoEntry = validComponent[0]?.fields.seoMetadata as Entry<SeoFieldSkeleton, undefined, string>;
  const seo = seoEntry?.fields;


  if (page.total !== 1) {
    notFound();
  }
  
  return (
    <>

    {seo && <SEOHead seo={seo} slug={fullPath} />}

    <main>
      {validComponent[0]?.fields.components &&
      Array.isArray(validComponent[0].fields.components) &&
      validComponent[0].fields.components.length > 0 ? (
        (validComponent[0].fields.components as Entry<EntrySkeletonType, undefined, string>[]).map(
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