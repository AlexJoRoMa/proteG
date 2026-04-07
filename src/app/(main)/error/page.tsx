import { contentfulClient } from "@/services/contentful/client";
import { ErrorTypeFields } from "@/types/PageTypes";
import { Entry, EntrySkeletonType } from "contentful";
import ErrorContent from "./errorContent";
import PageDataTracker from '@/components/tracking/PageDataTracker';

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
        <>
            <PageDataTracker pageType="support" pageName="error" />
            <ErrorContent errorEntry={errorEntry}/>
        </>
    )
}