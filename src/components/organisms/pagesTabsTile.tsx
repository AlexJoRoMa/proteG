import PageTabContent from "../molecules/pageTabContent";
import { getTabsContentType, getCopyForComponent } from "@/services/contentful/components";
import { tabsTileProps, TabsDataFields  } from "@/types/TabsTypes";
import { Entry, EntrySkeletonType } from "contentful";



export default async function PagesTabsTile({pageName, componentName}: tabsTileProps) {

    const tabsEntry: Entry<EntrySkeletonType, undefined> | null = await getTabsContentType(pageName);
    
    const tabsData = tabsEntry.fields.tabs as unknown as EntrySkeletonType<TabsDataFields>;

    const tabsTitle = (await getCopyForComponent(componentName) as unknown) as Record<string, { title: string }>;

    return (
        <div className="flex flex-col w-full self-center items-center bg-black-0 text-white-0">
            <h1 className="py-[40] font-bold text-2xl lg:text-3xl text-wrap text-center px-[24px]">{tabsTitle.tabs.title}</h1>

            <PageTabContent tabsData={tabsData}  />
        </div>


    )
}

