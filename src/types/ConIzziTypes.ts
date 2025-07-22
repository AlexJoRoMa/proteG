import { Asset, Entry, EntrySkeletonType } from "contentful";

export type ConIzziTvID = {
    id: string;
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
  body?: string;
  desde?: string
  precio?: string
  textTiempo?: string
  incluye?: string;
  textBoton1?: string;
}

export interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'izziTvModelTop';
  fields: StepTabEntryFields;
}