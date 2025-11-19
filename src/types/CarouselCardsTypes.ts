import { Entry, EntrySkeletonType } from "contentful";

export type CardPropType = {
    card: Entry<EntrySkeletonType, undefined, string>;
    promo: boolean;
}