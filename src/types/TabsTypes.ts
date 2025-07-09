export type tabsTileProps = {
    pageName: string,
    componentName: string
}

export type TabsData = {
    fields: {
        entryTitle: string,
        cards: Array<Record<string, any>>
    }
}