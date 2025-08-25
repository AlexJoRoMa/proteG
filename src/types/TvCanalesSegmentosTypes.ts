import { Asset, Entry, EntrySkeletonType } from "contentful";

export interface MediaEntryFields {
    internalName: string;
    image: Asset;
    description?: string;
}

export interface CardSegmentoFields {
  titulo?: string;
  segmentoCanal?: Entry<MediaEntryFields>[];
}

//TabsData
export interface TabsDataFields {
  entryTitle: string;
  cards: Entry<CardSegmentoFields>[];
}

export interface TabsContainerFields {
    internalName: string;
    tabs: TabsDataFields[];
}

export type PageTabContentProps = {
    tabsData: TabsDataFields[];
}

export type tabsTileProps = {
    id: string,
}

export type TabsContentProps = {
    tabsData: EntrySkeletonType<TabsDataFields> | null
}
