import { contentfulClient } from "./client"


export async function fetchComponentsBySlugPage(slug: string) {
    
       return await contentfulClient.getEntries({
          content_type: "page",
          'fields.slug': slug
        });
}