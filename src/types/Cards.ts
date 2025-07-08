import type { EntrySkeletonType, Asset, Entry } from 'contentful';

export type MediaBlock = {
    image: any;
};

export type MediaBlockField = {
    fields: MediaBlock;
};

export type TabbedCard = {
    entryTitle?: string;
    entryBody?: string;
    entryBodyLongText?: string;
    image?: MediaBlockField;
    dot?: any;
};

export interface TabbedCardSkeleton extends EntrySkeletonType {
    contentTypeId: 'stepTabEntry';
    fields: TabbedCard;
}
export type TabbedCardEntry = Entry<TabbedCardSkeleton, undefined, string>;