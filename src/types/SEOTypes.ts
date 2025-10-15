import { EntrySkeletonType } from "contentful";


export interface SeoFields {
  baseUrl: string;
  titulo: string;
  descripcion: string;
  noIndex: boolean;
  tituloCorto: string;
  descripcionCorto: string;
  imagen: {
    fields:{
      image:{
        fields:{
          file:{
            url: string;
          }
        }
      }
    }
  }
}
export interface SeoFieldSkeleton extends EntrySkeletonType {
  contentTypeId: 'contentSEO',
  fields: SeoFields;
}

export interface DynamicPageProps {
  params: Promise<{
    slugs: string[];
  }>;
}

export interface SEOHeadProps {
  seo: SeoFields;
  slug: string;
}