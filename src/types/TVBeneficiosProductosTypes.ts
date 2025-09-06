import { Asset, Entry, EntrySkeletonType } from "contentful";

export type TVBeneficiosProductosID = {
    id: string;
}

export type configuradoCopyFields = {
    titulo: string;
}

interface MediaEntryFields {
  image?: Asset;
}

interface MediaEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'media';
  fields: MediaEntryFields;
}

export interface StepTabEntryFields extends EntrySkeletonType{
  imagen?: Entry<MediaEntrySkeleton>;
  titulo?: string;
  esModal?: boolean;
  botonText?: string;
  linkBoton?: string;
  isModal?: string;
  modal?: {
    sys: {
      id: string;
    };
  };
  colorHr?: string;
}

export interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'izziTvCardBeneficiosProducto';
  fields: StepTabEntryFields;
}