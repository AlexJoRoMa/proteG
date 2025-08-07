import Image from "next/image";
import { BloqueSeparadorID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/BloqueSeparador';
import { contentfulClient } from "@/services/contentful/client";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";

const BloqueSeparador = async ({id}: BloqueSeparadorID) => {
    
    const callModelContent:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
        content_type: "izziTvModeloSeparador",
        'sys.id': id,
        select: ['fields.cardsContent'],
        include: 2,
    }).then((entriesResponse) => {
        return entriesResponse.items
    });
    
    
    const getModelContent: Array<Entry<StepTabEntrySkeleton>> | undefined = callModelContent?.[0]?.fields.cardsContent as unknown as Array<Entry<StepTabEntrySkeleton>>;


    return(
        <div className=" bg-gray-450 relative md:h-[181px] xsm:h-[273px]">
        <div className=" md:mx-md 2xl:mx-xl h-full content-center ">

           {getModelContent && getModelContent.map((card: Entry<StepTabEntrySkeleton>) => {
            const { textoTitulo, bodyText, isModal, textBoton1, urlBtn1 } = card.fields as StepTabEntryFields;

            return(
                <div key={card.sys.id} className="   flex md:flex-row xsm:flex-col text-white justify-between md:gap-4 xsm:gap-8 items-center">

                    <div className=" w-fit 4xl:text-[36px] 2xl:text-[30px] xl:text-[27px] md:text-[20px] xsm:text-[36px] text-left">
                        {textoTitulo && documentToReactComponents(textoTitulo)}
                    </div>
                    
                    <div className=" md:mx-0 xsm:mx-[5%] md:text-center xsm:text-left md:text-[18px] xsm:text-[16px] md:text-gray-200 xsm:text-white">
                        <p>{bodyText}</p>
                    </div>

                    <div className="">
                        <ButtonGhost classStyles="border-white text-white text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black w-full rounded-md
                        h-[48px]
                        3xl:w-[320px] xl:w-[250px] md:w-[170px] xsm:w-[320px] "
                        text={textBoton1 as string} href={urlBtn1 as string}
                        />
                    </div>

                </div>
            );
           })}
        </div>
        </div>
    )

}

export default BloqueSeparador