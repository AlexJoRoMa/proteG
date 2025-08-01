import { Entry, EntrySkeletonType } from "contentful";
import RecomendadorContent from "../molecules/recomendadorContent"
import { contentfulClient } from "@/services/contentful/client";
import { EntryDataFields, RecomendadorProps, StepsDataFields } from "@/types/Recomendador";

export default async function Recomendador({ id }: RecomendadorProps) {

    const recomendadorEntry: Entry<EntrySkeletonType, undefined, string> | null = await contentfulClient.getEntries({
        content_type: 'recomendadorContainer',
        'sys.id': id,
        include: 5
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });

    console.log('data', recomendadorEntry)

    const entryTitleInicial = recomendadorEntry?.fields.titleInicial as string;
    const entryTitlePropuestas = recomendadorEntry?.fields.titlePropuestas as string;
    const entrySubTitlePropuestas = recomendadorEntry?.fields.subTitlePropuestas as string;
    const entryCtaTextPropuestas = recomendadorEntry?.fields.ctaTextPropuestas as string;

    const entryData = recomendadorEntry?.fields.steps as unknown as EntrySkeletonType<StepsDataFields>;

    return (
        <div className="flex flex-col w-full bg-gray-50 py-[64px] px-[16px] md:px-0">
            <div className="flex flex-col gap-[24px] self-center items-center text-center pb-[40px]">
                <h1 className="font-bold leading-[40px] md:leading-[48px] text-[32px] md:text-4xl">{entryTitleInicial}</h1>
            </div>
            <RecomendadorContent data={entryData}/>
        </div>
    )
}