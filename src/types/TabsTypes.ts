import { EntrySkeletonType } from "contentful";

//CardData

export interface CardDataFields {
    fields: CardDataFields;
    entryTitle: string;
    entryBody: string;
    entryUserTestimony?: string;
    image: {
        fields: {
            image: {
                fields: {
                    file: {
                        url: string;
                    };
                };
            };
            altText: string;
        };
    };
}

//TabsData

export interface TabsDataFields {
    entryTitle: string;
    cards: CardDataFields[];
}

//TabsContainer

export interface TabsContainerFields {
    internalName: string;
    tabs: TabsDataFields[];
}

//Props

export type PageTabContentProps = {
    tabsData: TabsDataFields[];
}

export type tabsTileProps = {
    id: string,
}

export type TabsContentProps = {
    tabsData: EntrySkeletonType<TabsDataFields> | null
}
