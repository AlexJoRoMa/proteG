import { Asset, Entry, EntrySkeletonType } from "contentful";
import { Document } from '@contentful/rich-text-types';

export type ConIzziTvID = {
    id: string;
}

interface MediaEntryFields {
  image?: Asset;
}

interface MediaMovilEntryFields {
  image?: Asset;
}

interface MediaDeskEntryFields {
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

interface MediaDesklEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'media';
  fields: MediaDeskEntryFields;
}

export interface StepTabEntryFields extends EntrySkeletonType{
  imagen?: Entry<MediaEntrySkeleton>;
  imagenMovil?: Entry<MediaMovilEntrySkeleton>;
  imagenDesk?: Entry<MediaDesklEntrySkeleton>;
  imgNumber?: boolean;
  richTitle?: Document; 
  body?: string;
  textoPrecio?: string
  precio?: string
  textTiempo?: string
  incluye?: string;
  adicionales?: Asset[];
  textBoton1?: string;
  linkBoton1?: string;
}

export interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'izziTvModelTop';
  fields: StepTabEntryFields;
}