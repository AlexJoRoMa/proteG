import Image from "next/image";
import { ConIzziTvID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/ConIzziTypes';
import { contentfulClient } from "@/services/contentful/client";
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";


const ConIzziTv = async ({id} : ConIzziTvID) =>{

    const callCardsContent:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
            content_type: "izziTvModel",
            'sys.id': id,
            select: ['fields.cardsContent'],
            include: 2,
        }).then((entriesResponse) => {
            return entriesResponse.items
        })
    
      const getCardsContent: Array<Entry<StepTabEntrySkeleton>> | undefined = callCardsContent?.[0]?.fields.cardsContent as unknown as Array<Entry<StepTabEntrySkeleton>>;

      console.log('>>>>> getCardsContent ', getCardsContent);
    return(
        <h1>helllo3</h1>
    );
 }


export default ConIzziTv