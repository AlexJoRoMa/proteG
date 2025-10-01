import { componentMap } from "@/lib/contentful/dynamic-map";
import { fetchComponentsBySlugPage } from "@/services/contentful/pages";
import { Entry, EntrySkeletonType } from "contentful";
import { notFound } from "next/navigation";

interface DynamicPageProps {
    params: Promise<{
        slugs: string[];
    }>;
}

export default async function LandingPage({ params }: DynamicPageProps) {
    const { slugs } = await params; //Sugerencia de NextJS para obtener los parametros de la ruta
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
        </main>
    );
}