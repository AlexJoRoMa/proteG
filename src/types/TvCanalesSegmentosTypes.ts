import { Entry, EntrySkeletonType } from "contentful";

export interface MediaEntryFields {
    image: {
        fields: {
            file:{
                url: string;
                details: {
                    image: {
                        width: number;
                        height: number;
                    };
                };
            };
        };  
    };
}

export interface CardSegmentoFields {
  titulo?: string;
  segmentoCanal?: Entry<EntrySkeletonType<MediaEntryFields>>[];
}

//TabsData
export interface TabsDataFields {
  entryTitle: string;
  cards: Entry<EntrySkeletonType<CardSegmentoFields>>[];
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
