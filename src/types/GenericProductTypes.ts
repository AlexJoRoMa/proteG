import { ReactNode } from "react";

export type GenericProductProps = {
    id: string
}

export type GenericProductComponentProps = {
    cardData: GenericProductCardType,
    color: string,
    borderColor: string,
    icon: ReactNode
}

export type GenericProductCardType = {
    fields: {
        productName: string,
        content: string,
        pricePrefixCopy?: string,
        priceValue: string,
        priceSuffixCopy?: string,
        advertisingCopy: string,
        primaryButtonCopy: string,
        primaryButtonUrl: string,
        secondaryButtonCopy: string,
        secondaryButtonUrl: string
    }
}