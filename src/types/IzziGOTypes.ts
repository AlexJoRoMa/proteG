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
  textoTitulo?: Document;
  bodyText?: string;
  esModal?: string;
  textBoton1?: string;
  textBoton2?: string;
  linkBoton2?: string;
  textoDescarga?: string;
  image?: Entry<MediaEntrySkeleton>;
  image2?: Entry<MediaEntrySkeleton>;
  image3?: Entry<MediaEntrySkeleton>;
}

export interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'stepTabEntry';
  fields: StepTabEntryFields;
}
