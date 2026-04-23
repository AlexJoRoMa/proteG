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

export interface ButtonModalEntryFields {
  internalName?: string;
  type?: string;
  text?: string;
  url?: string;
  external?: boolean;
  preSeleccion?: boolean;
}

export interface ButtonModalEntrySkeleton extends EntrySkeletonType {
  contentTypeId: 'buttonModalModel';
  fields: ButtonModalEntryFields;
}

export interface RichTextRowEntryFields {
  content?: Document;
  type?: string;
  internalName?: string;
}

export interface RichTextRowEntrySkeleton extends EntrySkeletonType {
  contentTypeId: 'richTextContent';
  fields: RichTextRowEntryFields;
}

export interface StepTabEntryFields extends EntrySkeletonType{
  image?: Entry<MediaEntrySkeleton>;
  textoTitulo?: Document;
  bodyText?: string;
  isModal?: string;
  textBoton1?: string;
  urlBtn1?: string;
  type?: string;
  middleColumn?: string;
  rightColumn?: string;
  leftColumn?: string;
  backgroundColor?: string;
  textoEnriquecidoDeCintillo?: Document;
  botonesOferta?: Entry<ButtonModalEntrySkeleton>[];
  textRow?: Entry<RichTextRowEntrySkeleton>[];
  separatorBottomRow?: Entry<ButtonModalEntrySkeleton>[];
}

export interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'stepTabEntry';
  fields: StepTabEntryFields;
}
