import { Entry, EntrySkeletonType } from "contentful";
import { componentMap } from "@/lib/contentful/dynamic-map";
import { fetchComponentsBySlugPage } from "@/services/contentful/pages";
import { notFound } from "next/navigation";
import ButtonFixed from "@/components/atoms/ButtonSticky";
import { Metadata } from "next";


interface SEOFields {
  titulo: string;
  descripcion: string
  tituloCorto?: string;
  descripcionCorto?: string;
  noIndex?: boolean;
}

type SeoEntrySkeleton = {
  contentTypeId: 'contentSEO';
  fields: SEOFields;
}

type PageEntrySkeleton = {
  contentTypeId: 'page';
  fields: {
    internalName: string;
    components?: Entry<EntrySkeletonType, undefined, string>[];
    slug?: string;
    seoMetadata?: Entry<SeoEntrySkeleton, undefined, string>;
  }
}

interface PageEntryFields {
  seoMetadata?: Entry<SeoEntrySkeleton, undefined, string>;
}
interface DynamicPageProps {
  params: Promise<{
    slugs: string[];
  }>;
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const fullPath = (await params).slugs.join('/');
  const pageData = await fetchComponentsBySlugPage(fullPath);
  const pageEntry = pageData.items?.[0] as unknown as Entry<PageEntrySkeleton>;

  if(!pageEntry || !pageEntry.fields.seoMetadata){
    return{};
  }

  const rawSeo = pageEntry?.fields.seoMetadata?.fields;

 
  if(!rawSeo){
    return {};
  }

  const seo = rawSeo as SEOFields;
console.log('>>>> pageData', pageData)  
  return{
    title: seo.titulo,
    description: seo.descripcion,
    robots: seo.noIndex ? 'noIndex, nofollow' : 'index, follow',
    openGraph: {
      title: seo.tituloCorto || seo.titulo,
      description: seo.descripcionCorto || seo.descripcion,
      type: 'website',
    }
  }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const {slugs} = await params; //Sugerencia de NextJS para obtener los parametros de la ruta
  // Unir segmentos anidados en un solo slug, p.ej. ['television', 'canales'] -> 'television/canales'
  const fullPath = slugs.join('/');

  const page = await fetchComponentsBySlugPage(fullPath);
  const components = page.items || [];

  if (page.total !== 1) {
    notFound();
  }

  return (
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
  );
}
