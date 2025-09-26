import { Asset, Entry, EntrySkeletonType } from "contentful";
import { Document } from '@contentful/rich-text-types';

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
