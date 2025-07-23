import { Entry, EntrySkeletonType } from "contentful";
import { ReactNode } from "react";

export type GenericProductProps = {
    id: string
}

export type GenericProductComponentProps = {
    cardData: Entry<EntrySkeletonType, undefined, string> | null,
    color: string,
    borderColor: string,
    icon: ReactNode
}

export type GenericProductCardType = {
    productName: string,
    content: string,
    pricePrefixCopy?: string,
    priceValue: string,
    priceSuffixCopy?: string
}