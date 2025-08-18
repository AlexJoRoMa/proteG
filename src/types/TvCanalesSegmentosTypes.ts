import { Asset, Entry, EntrySkeletonType } from "contentful";
import { Document } from '@contentful/rich-text-types';

export type TVCanalesSegmentoID = {
    id: string;
}

interface MediaEntryFields {
  image?: Asset;
}

interface MediaEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'media';
  fields: MediaEntryFields;
}

export interface TVCanalesSegmentosFields {
    titulo?: string;
    segmentoCanal?: Entry<MediaEntrySkeleton>[];
}

export interface TVCanalesSegmentoSkeleton extends EntrySkeletonType{
    contentTypeId: 'TVCanalesSegmentos';
    fields: TVCanalesSegmentosFields;
}

export interface CanalesContenedorFields extends EntrySkeletonType{
  tituloResaltado?: Document;
  textoBoton1?: string;
  linkBoton1?: string;
  textoBoton2?: string;
  linkBoton2?: string;
  segmentosCanales?: Entry<TVCanalesSegmentoSkeleton>[];
}

export interface TVCanalesSkeleton extends EntrySkeletonType{
  contentTypeId: 'tvCanalesContenedor';
  fields: CanalesContenedorFields;
}
