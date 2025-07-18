import { Asset, Entry, EntrySkeletonType } from "contentful";

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
  entryBody?: string;
}

export interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'stepTabEntry';
  fields: StepTabEntryFields;
}