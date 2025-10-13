import { EntrySkeletonType } from "contentful";

export interface SeoFields {
  titulo: string;
  descripcion: string;
}
export interface SeoFieldSkeleton extends EntrySkeletonType {
  contentTypeId: 'contentSEO',
  fields: SeoFields;
}