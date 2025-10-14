import { Asset, Entry, EntrySkeletonType } from "contentful";

interface MediaEntryFields {
  image?: Asset;
}

interface MediaEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'media';
  fields: MediaEntryFields;
}
export interface SeoFields {
  baseUrl: string;
  titulo: string;
  descripcion: string;
  noIndex: boolean;
  tituloCorto: string;
  descripcionCorto: string;
  image: Entry<MediaEntrySkeleton>;
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