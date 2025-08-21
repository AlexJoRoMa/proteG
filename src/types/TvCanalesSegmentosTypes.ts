import { Asset, AssetFile, Entry, EntrySkeletonType, UnresolvedLink } from "contentful";

export interface MediaEntryFields {
  image?: Asset;
}

export interface CardSegmentosFields {
  titulo?: string;
  segmentoCanal?: Entry<MediaEntryFields>[];
}
export interface TabsDataFields {
  entryTitle: string;
  cards: any[];
}

export interface TabsDataContainerFields {
  title?: string;
  tabs?: Entry<TabsDataFields>[];
}

export type TVCanalesSegmentoID = {
    id: string;
}