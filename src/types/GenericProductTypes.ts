export type GenericProductProps = {
    id: string
}

export type GenericProductComponentProps = {
    cardData: GenericProductCardType,
    color: string,
    borderColor: string,
    icon: string,
    altIcon: string
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
        secondaryButtonUrl: string,
        productIcon: Icon
    }
}

export type Icon = {
    fields: {
        file: File
    }
}

export type File = {
        fileName: string, 
        url: string
}