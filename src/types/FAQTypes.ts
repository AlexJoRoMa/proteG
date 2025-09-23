import { Asset, Entry, EntrySkeletonType } from "contentful";

export type FAQcomponentID = {
    id: string;
}

export interface CardSegmentoFields {
  pregunta?: string;
  respuesta?: string;
}

export type CardSegmentoSkeleton = EntrySkeletonType<CardSegmentoFields>;

export interface TabsDataFields {
  entryTitle: string;
  cards: Entry<CardSegmentoSkeleton>[];
} 

export type TabsContentProps = {
    tabsData: Entry<EntrySkeletonType<TabsDataFields>>[] | null;
}


export interface ColorPickerType {
  name: string;
  value: string;
}

export interface FAQEntryFields extends EntrySkeletonType{
    title?: string;
    subTitle?: string;
    colorDeFondo?: ColorPickerType;
}

export interface FAQTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'faqTabs';
  fields: FAQEntryFields;
}


