import { Asset, Entry, EntrySkeletonType } from "contentful";
import { Document } from '@contentful/rich-text-types';

export type BloqueSeparadorID = {
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
  image?: Entry<MediaEntrySkeleton>;
  textoTitulo?: Document;
  bodyText?: string;
  isModal?: string;
  textBoton1?: string;
  urlBtn1?: string;
}

export interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'stepTabEntry';
  fields: StepTabEntryFields;
}
