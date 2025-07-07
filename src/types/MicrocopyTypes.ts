    export type Resource = {
        fields: ResourceFields;
    };

    export type ResourceFields = {
        key: string,
        value: string
    }

    export type FilteredData = {
        fields?: {
            name?: string,
            resources?: Resource[];
        };
    };