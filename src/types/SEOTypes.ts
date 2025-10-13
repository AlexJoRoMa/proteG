import { EntrySkeletonType } from "contentful";

export interface SeoFields {
  titulo: string;
  descripcion: string;
  noIndex: boolean;
  tituloCorto: string;
  descripcionCorto: string;
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