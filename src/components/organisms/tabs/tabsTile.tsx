import TabContent from "../../molecules/tab";
import { getTabsContentType, getCopyForComponent } from "@/services/contentful/components";

type Props = {
    pageName: string,
    componentName: string
}

export default async function TabsTile({pageName, componentName}: Props) {
    const tabsData: any = await getTabsContentType(pageName);
    const tabsTitle: Record<string, any> = await getCopyForComponent(componentName);

    return (
        <div className="flex flex-col w-full self-center items-center bg-black-0 text-white-0">
            <h1 className="py-[40] font-bold text-2xl lg:text-3xl text-wrap text-center px-[24px]">{tabsTitle.tabs.title}</h1>

            <TabContent tabsData={tabsData.fields}  />
        </div>


    )
}

