import { EntrySkeletonType } from "contentful";

//dynamic page

export type PageProps = {
  params: {
    slug: string;
  };
};

//not-found page

export type ErrorTypeFields = {
    internalName: string,
    errorType: string,
    title: string,
    description: string,
    buttons: EntrySkeletonType<ErrorButtonsFields>[],
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

export type ErrorButtonsFields = {
    navigationTitle?: string,
    navigationUrl?: string
}
