import { Asset, Entry, EntrySkeletonType } from "contentful";

//CardData
export interface CardSegmentoFields {
  titulo?: string;
  segmentoCanal?: Entry<EntrySkeletonType<any>>[]
}

//TabsData
export interface TabsDataFields {
  entryTitle: string;
  cards: Entry<EntrySkeletonType<CardSegmentoFields>>[];
}

//TabsContainer
export interface TabsContainerFields {
  internalName: string;
  tabs: TabsDataFields[];
}

//----Prop
export type PageTabContentProps = {
    tabsData: TabsDataFields[];
}

export type TVCanalesSegmentoID = {
    id: string,
}

export type TabsContentProps = {
    tabsData: EntrySkeletonType<TabsDataFields> | null
}

