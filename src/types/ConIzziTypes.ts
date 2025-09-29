import { Document } from "@contentful/rich-text-types";
import { Asset, Entry, EntrySkeletonType } from "contentful";

export type ConIzziTvID = {
    id: string;
}

interface MediaEntryFields {
  image?: Asset;
}

interface MediaMovilEntryFields {
  image?: Asset;
}

interface MediaEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'media';
  fields: MediaEntryFields;
}

interface MediaMovilEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'media';
  fields: MediaMovilEntryFields;
}

export interface StepTabEntryFields extends EntrySkeletonType{
  imagen?: Entry<MediaEntrySkeleton>;
  imagenMovil?: Entry<MediaMovilEntrySkeleton>;
  titulo?: string;
  tituloResaltado?: string;
  body?: string;
  textoPrecio?: string
  precio?: string
  textTiempo?: string
  incluye?: string;
  adicionales?: Asset[];
  textBoton1?: string;
  linkBoton1?: string;
  content?: Document;
  image?: Asset;
  imageResponsive?: Asset;
}

export interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'izziTvModelTop';
  fields: StepTabEntryFields;
}