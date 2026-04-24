import { contentfulClient } from "./client"
import { Entry, EntrySkeletonType } from "contentful"


/**
 * Obtiene entradas de Contentful para una página, ya sea por un solo slug
 * o por varios segmentos anidados (ruta padre-hijo).
 *
 * @param slugOrSlugs - Un slug (p.ej. "tv") o un array de segmentos (["television","canales"])
 */
export async function fetchComponentsBySlugPage(
  slugOrSlugs: string | string[]
) {
  // Normalizar a array para tratar ambos casos de forma unificada
  const segments = Array.isArray(slugOrSlugs) ? slugOrSlugs : [slugOrSlugs];
  let parentId: string | undefined;
  let res: Awaited<ReturnType<typeof contentfulClient.getEntries>>;

  for (const slug of segments) {
    const query: Record<string, string> = {
      content_type: "page",
      "fields.slug": slug,
      include: "2",
      ...(parentId && { "fields.parent.sys.id": parentId }),
    };

    res = await contentfulClient.getEntries(query);
    

    // Si la búsqueda falla o no es única, devolvemos el resultado
    if (res.total !== 1) {
      return res;
    }

    // Guardamos el ID para buscar el próximo nivel
    parentId = res.items[0].sys.id;
  }

  // Al final devolvemos el resultado del último segmento (o el único)
  return res!;
}

export async function fetchHeaderByPageSlug(
  slug: string
): Promise<Entry<EntrySkeletonType, undefined, string>[] | null> {
  const res = await contentfulClient.getEntries({
    content_type: "page",
    "fields.slug": slug,
    include: 3,
  });

  if (res.total !== 1) return null;

  const header = res.items[0].fields.header;
  if (!header) return null;

  return (Array.isArray(header) ? header : [header]) as Entry<EntrySkeletonType, undefined, string>[];
}