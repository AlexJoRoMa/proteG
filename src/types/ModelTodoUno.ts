import { Asset, Entry, EntrySkeletonType } from "contentful";

export type TodoEnUnoCompID = {
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
  entryTitle?: string;
  entryBody?: string;
  desactivarComponentes?: boolean;
}

export interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'stepTabEntry';
  fields: StepTabEntryFields;
}