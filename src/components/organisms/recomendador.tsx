import { Entry, EntrySkeletonType } from "contentful";
import RecomendadorQuestionary from "../molecules/recomendadorQuestionary"
import { contentfulClient } from "@/services/contentful/client";
import { RecomendadorProps } from "@/types/Recomendador";
import { RecomendadorProvider } from "@/utils/RecomendadorProvider";

export default async function Recomendador({ id }: RecomendadorProps) {

    const recomendadorEntry: Entry<EntrySkeletonType, undefined> | null = await contentfulClient.getEntries({
        content_type: 'recomendadorContainer',
        'sys.id': id,
        include: 5
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });

    console.log('data', recomendadorEntry)

    return (
        <RecomendadorProvider contentfulEntry={recomendadorEntry}>
            <div className="flex flex-col w-full bg-gray-50 py-[64px] px-[16px] md:px-0">
                <RecomendadorQuestionary />
            </div>
        </RecomendadorProvider>
    )
}