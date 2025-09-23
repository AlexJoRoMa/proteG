import { contentfulClient } from "@/services/contentful/client";
import { FAQcomponentID, TabsDataFields } from '@/types/FAQTypes';
import { ColorPickerType } from "@/types/IzziGOTypes";
import { Entry, EntrySkeletonType } from "contentful";
import TabFAQ from '../molecules/FAQSegmentosContent';


const FAQcomponent = async({id} : FAQcomponentID) => {
    
    const tabsEntry:Entry<EntrySkeletonType, undefined, string> | null = await contentfulClient.getEntries({
        content_type: 'faqTabs',
        'sys.id': id,
        include: 3,
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });

    const title = tabsEntry?.fields.title as string;
    const subTitle = tabsEntry?.fields.subTitle as string;
    const bgColor = (tabsEntry?.fields.colorDeFondo as unknown as ColorPickerType)?.value;

    const entryData = tabsEntry?.fields.tabs as Entry<EntrySkeletonType<TabsDataFields>>[]

    return(
        
        <div className={` w-[100%] relative h-auto`}
        style={{backgroundColor: bgColor }}>
            <div className="md:mx-md 2xl:mx-xl flex">

                {/* titulos */}
                <div className=" flex flex-col w-full self-center items-center my-15">
                    <h1 className="lg:text-[36px] md:text-[30px] xsm:text-[32px] font-bold text-center
                    ">
                        {title}
                    </h1>
                    <h2 className="lg:text-[18px] md:text-[20px] xsm:text-[16px] text-center
                    mt-5">
                        {subTitle}
                        </h2>

                    {/* tabs */}
                    <div className="md:mt-10 xsm:mt-5 md:w-full xsm:w-[95%]">
                    <TabFAQ tabsData={entryData} />
                    </div>
                </div>


            </div>
        </div>
    );
}

export default FAQcomponent