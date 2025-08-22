import { Asset, Entry, EntrySkeletonType } from "contentful";

export interface MediaEntryFields {
    internalName: string;
    image: Asset;
    description?: string;
}

export interface CardDataFields {
    titulo: string;
    segmentoCanal: Entry<EntrySkeletonType<MediaEntryFields>>[] | null;
}

export interface TabsDataFields {
    entryTitle: string;
    cards: Entry<EntrySkeletonType<CardDataFields>>[] | null;
}

export interface TabsContainerFields {
    internalName: string;
    tabs: Entry<EntrySkeletonType<TabsDataFields>>[] | null;
}

export type PageTabContentProps = {
    tabsData: Entry<EntrySkeletonType<TabsDataFields>>[];
}

export type tabsTileProps = {
    id: string,
}

export type TabsContentProps = {
    tabsData: EntrySkeletonType<TabsDataFields> | null
}
