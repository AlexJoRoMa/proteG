import { Asset, Entry, EntrySkeletonType } from "contentful";
import { Document } from '@contentful/rich-text-types';

export type IzziGoBloqueID = {
    id: string;
}

interface MediaEntryFields {
  image?: Asset;
}

interface MediaEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'media';
  fields: MediaEntryFields;
}

export interface ColorPickerType {
  name: string;
  value: string;
}

export interface StepTabEntryFields extends EntrySkeletonType{
  textoTitulo?: Document;
  sizeBlock?: boolean;
  textOrder?: boolean;
  bodyText?: string;
  button1Exist?: boolean;
  esModal?: string;
  textBoton1?: string;
  linkBoton1?: string;
  button2Exist?: boolean;
  textBoton2?: string;
  linkBoton2?: string;
  assetsExist?: boolean;
  textoDescarga?: string;
  image?: Entry<MediaEntrySkeleton>;
  image2?: Entry<MediaEntrySkeleton>;
  image3?: Entry<MediaEntrySkeleton>;
  bgColor?: ColorPickerType;
}

export interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'stepTabEntry';
  fields: StepTabEntryFields;
}
