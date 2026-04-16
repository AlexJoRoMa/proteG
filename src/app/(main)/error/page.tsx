import { contentfulClient } from "@/services/contentful/client";
import { ErrorTypeFields } from "@/types/PageTypes";
import { Entry, EntrySkeletonType } from "contentful";
import ErrorContent from "./errorContent";

export default async function ErrorServerPage() {

    const pageEntry: Entry<EntrySkeletonType, undefined, string> | null = await contentfulClient.getEntries({
        content_type: 'errorPageContainer',
        'fields.errorType': '500',
        include: 5
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });

    const errorEntry = pageEntry?.fields as unknown as ErrorTypeFields;

    return (
        <ErrorContent errorEntry={errorEntry}/>
    )
}