import { Asset, EntrySkeletonType } from "contentful";

export type MediaBlockModelID = {
    id: string;
}

export interface MediaEntryFields extends EntrySkeletonType{
  image?: Asset;
}

export interface MediaEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'media';
  fields: MediaEntryFields;
}
