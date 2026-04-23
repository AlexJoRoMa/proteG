import { Entry, EntrySkeletonType } from "contentful";
import { componentMap } from "@/lib/contentful/dynamic-map";
import { fetchComponentsBySlugPage } from "@/services/contentful/pages";
import ButtonFixed from "@/components/atoms/ButtonSticky";
import {SeoFieldSkeleton} from "@/types/SEOTypes";
import SEOHead from '@/components/atoms/SEOHead';
import CookieConsent from "@/components/organisms/cookieConsent";
import PageDataTracker from '@/components/tracking/PageDataTracker';
import { getMicroCopy } from '@/services/contentful/components';

export const dynamic = 'force-dynamic';
export default async function Home() {

  // Obtener la informacion de la pagina

  const page = await fetchComponentsBySlugPage("home");

  const components = page.items || [];
  const slug = components[0]?.fields.slug as string;
  const seoEntry = components[0]?.fields.seoMetadata as Entry<SeoFieldSkeleton, undefined, string>;
  const seo = seoEntry?.fields;

  const getCookieTitulo = await getMicroCopy('cookie.title');
  const getLonTitulo = await getMicroCopy('cookie.LongText');
  const getAceptar = await getMicroCopy('cookie.aceptar');
  const getRechazar = await getMicroCopy('cookie.rechazar');
  const getCookiesAceptar = await getMicroCopy('cookie.AceptarCookies');
  const getCookiesAutoriza = await getMicroCopy('cookie.Autoriza');
  
  const cookieTitulo = getCookieTitulo?.[0]?.fields?.value as string;
  const cookieLong = getLonTitulo?.[0]?.fields?.valueLong as string;
  const cookieAceptar = getAceptar?.[0]?.fields?.value as string;
  const cookieRechazar = getRechazar?.[0]?.fields?.value as string;
  const cookieTextAcept = getCookiesAceptar?.[0]?.fields?.value as string;
  const cookieAutoriza = getCookiesAutoriza?.[0]?.fields?.value as string;
  

  
  return (
    <>
      {seo && <SEOHead seo={seo} slug={slug} />}

      <main className="">
        <PageDataTracker pageType="home" pageName="Homepage" />

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
        <CookieConsent 
          title={cookieTitulo} 
          long={cookieLong}
          aceptar={cookieAceptar}
          rechazar={cookieRechazar}
          cookieAcept={cookieTextAcept}
          cookieAutoriza={cookieAutoriza}
        />
      </main>
    </>
  );
}
