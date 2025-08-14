import { Entry, EntrySkeletonType } from "contentful";
import RecomendadorQuestionary from "../molecules/recomendadorQuestionary"
import { contentfulClient } from "@/services/contentful/client";
import { RecomendadorProps } from "@/types/Recomendador";
import { RecomendadorProvider } from "@/utils/RecomendadorProvider";
import { getCopyForComponent } from "@/services/contentful/components";

export default async function Recomendador({ id }: RecomendadorProps) {

    const recomendadorEntry: Entry<EntrySkeletonType, undefined> | null = await contentfulClient.getEntries({
        content_type: 'recomendadorContainer',
        'sys.id': id,
        include: 5
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });

    const page = recomendadorEntry?.fields.page as string;

    const casosRecomendadorEntry: Entry<EntrySkeletonType, undefined>[] | null = await contentfulClient.getEntries({
        content_type: 'casosRecomendador',
        include: 5,
        'fields.pageType': page
    }).then((entriesResponse) => {
        return entriesResponse.items
    });

    const errorRecomendador = await getCopyForComponent('Recomendador').then((entry) => {
        return entry.recomendador;
    });

    return (
        <RecomendadorProvider contentfulEntry={recomendadorEntry} casosRecomendador={casosRecomendadorEntry} casosError={errorRecomendador}>
            <div className="flex flex-col w-full bg-gray-50 py-[64px] px-[16px] md:px-0">
                <RecomendadorQuestionary />
            </div>
        </RecomendadorProvider>
    )
}