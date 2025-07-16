import { contentfulClient } from "@/services/contentful/client";
import PageTabContent from "../molecules/pageTabContent";
import { tabsTileProps, TabsDataFields, TabsContainerFields } from "@/types/TabsTypes";
import { Entry, EntrySkeletonType } from "contentful";

export default async function PagesTabsTile({ id }: tabsTileProps) {

    const tabsEntry:Entry<EntrySkeletonType, undefined, string> | null = await contentfulClient.getEntries({
        content_type: 'tabsContainer',
        'sys.id': id,
        include: 5
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });

    const entryTitle = tabsEntry?.fields.title as string;
    const entryData = tabsEntry?.fields.tabs as unknown as EntrySkeletonType<TabsDataFields>;

return (
    <div className="flex flex-col w-full self-center items-center bg-black-0 text-white-0">
        <h1 className="py-[40] font-bold text-2xl lg:text-3xl text-wrap text-center px-[24px]">{entryTitle}</h1>

        <PageTabContent tabsData={entryData} />
    </div>
)
}

