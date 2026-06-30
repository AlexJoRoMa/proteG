import { Asset, Entry, EntrySkeletonType } from "contentful";
import { Document } from '@contentful/rich-text-types';

export type configuradoCopyFields = {
    titulo: string;
}

export type ContratacionRapidaID = {
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
  dot?: Asset;
  entryTitle?: string;
  entryBody?: string;
  richText?: Document;
}

export interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'stepTabEntry';
  fields: StepTabEntryFields;
}