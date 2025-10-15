import { Entry, EntrySkeletonType } from "contentful";
import { componentMap } from "@/lib/contentful/dynamic-map";
import { fetchComponentsBySlugPage } from "@/services/contentful/pages";
import ButtonFixed from "@/components/atoms/ButtonSticky";
import {SeoFieldSkeleton, SeoFields} from "@/types/SEOTypes";


export default async function Home() {

  // Obtener la informacion de la pagina

  const page = await fetchComponentsBySlugPage("home");

  const components = page.items || [];
  const slug = components[0]?.fields.slug as Entry<SeoFieldSkeleton, undefined, string>;
  const seoEntry = components[0]?.fields.seoMetadata as Entry<SeoFieldSkeleton, undefined, string>;
  const seo = seoEntry?.fields;

  const bastURL =  seo.baseUrl;
  const canonicalURL = `${bastURL}/${slug}`;

  const imagen = (seo?.imagen as SeoFields["imagen"])
  const imgURL = imagen.fields.image.fields.file.url;

  
  return (
    <>
    <link rel="canonical" href={canonicalURL}/>
    <title>{seo?.titulo || "izzi"}</title>
    <meta name="description" content={seo?.descripcion || "izzi desc"} />
    <meta name="robots" content={seo?.noIndex ? 'noIndex, no follow' : 'index, follow'} />
    
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
