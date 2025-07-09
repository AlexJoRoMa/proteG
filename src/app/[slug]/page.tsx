import Navigation from "@/components/molecules/navigation";
import { Entry, EntrySkeletonType } from "contentful";
import { componentMap } from "@/lib/contentful/dynamic-map";
import { fetchComponentsBySlugPage } from "@/services/contentful/pages";


type PageProps = {
  params: {
    slug: string;
  };
};


export default async function Page({params}:PageProps) {

  // Obtener la informacion de la pagina segun el parametro slug
  // Este slug es el que se pasa en la URL, por ejemplo: /tv,

  const {slug} = await params; //Sugerencia de NextJS para obtener los parametros de la ruta

   const page = await fetchComponentsBySlugPage(slug);

   const components = page.items || [];

  return (
      <main className="">
        {
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
      </main>
  );
}
