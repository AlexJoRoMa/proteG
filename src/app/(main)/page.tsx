import { Entry, EntrySkeletonType } from "contentful";
import { componentMap } from "@/lib/contentful/dynamic-map";
import { fetchComponentsBySlugPage } from "@/services/contentful/pages";
import ButtonFixed from "@/components/atoms/ButtonSticky";
import Head from "next/head";

interface SeoFields {
  titulo: string;
  descripcion: string;
}
interface SeoFieldSkeleton extends EntrySkeletonType {
  contentTypeId: 'contentSEO',
  fields: SeoFields;
}
export default async function Home() {

  // Obtener la informacion de la pagina

  const page = await fetchComponentsBySlugPage("home");

   const components = page.items || [];
   const seoEntry = components[0]?.fields.seoMetadata as Entry<SeoFieldSkeleton, undefined, string>;
   const seo = seoEntry?.fields;

  return (
    <>
    
      <title>{seo?.titulo || "izzi"}</title>
      <meta name="description" content={seo?.descripcion || "izzi desc"} />
    
    <main className="">

        {
          // Verificar si existen componentes y si son un array con al menos un elemento, Si es asi, mapearlos y renderizar el componente correspondiente
          components && components[0] && components[0].fields.components && Array.isArray(components[0].fields.components) && components[0].fields.components.length > 0 ? (
                (components[0].fields.components as Entry<EntrySkeletonType, undefined, string>[]).map((component: Entry<EntrySkeletonType, undefined, string>, index) => {
                  const componentType = component?.fields?.type;
                  const Component = typeof componentType === 'string' && componentType in componentMap ? componentMap[componentType as keyof typeof componentMap] : null;
                  return Component ? <Component key={index} id={component?.sys.id}   /> : null;
                })
          ) : (
            <p>No existen componentes cargados.</p>
          )
        }
        <ButtonFixed />
    </main>
    </>
  );
}
