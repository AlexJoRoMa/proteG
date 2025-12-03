import Image from "next/image";
import { BloqueSeparadorID, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/BloqueSeparador';
import { contentfulClient } from "@/services/contentful/client";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";
import ButtonLanding from "../atoms/ButtonStickyLanding";

const BloqueSeparador = async ({ id }: BloqueSeparadorID) => {

    const callComponents: Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
        content_type: "izziTvModelSeparador",
        'sys.id': id,
        select: ['fields.textoTitulo',
            'fields.bodyText',
            'fields.isModal',
            'fields.textBoton1',
            'fields.urlBtn1',
            'fields.image',
        ],
        include: 2,
    }).then((entriesResponse) => {
        return entriesResponse.items
    });

    if (!callComponents) {
        return null;
    }

    const getComponentContent = callComponents[0] as unknown as Entry<StepTabEntrySkeleton>;

    const { textoTitulo, bodyText, isModal, textBoton1, urlBtn1, image } = getComponentContent.fields as StepTabEntryFields;

    const assetImage = image?.fields?.image as Asset | undefined;
    const imgURL = assetImage?.fields?.file?.url;

    return (
        <div className=" bg-gray-450 relative md:h-[181px] xsm:h-[273px]">
            <div className=" md:mx-md 2xl:mx-xl h-full content-center ">

                <div key={getComponentContent.sys.id} className=" flex md:flex-row xsm:flex-col text-white relative justify-between md:gap-4 xsm:gap-8 items-center">

                    {/* logica de texto e imagen */}
                    {imgURL && (
                        <div className=" relative  ">
                            {imgURL && (
                                <Image
                                    className="md:w-[283px] md:h-[52px] xsm:w-[187px] xsm:h-[35px]"
                                    alt={'Images'}
                                    src={`https:${imgURL}`}
                                    loading="lazy"
                                    width={283}
                                    height={52}
                                />
                            )}
                        </div>
                    )}

                    {textoTitulo && !imgURL && (
                        <div className=" 3xl:w-[283px] 2xl:w-[300px] xl:w-[230px] lg:w-[30%] md:w-[350px] relative
                    4xl:text-[36px]  xl:text-[27px] md:text-[20px] xsm:text-[36px] text-left">
                            {textoTitulo && documentToReactComponents(textoTitulo)}
                        </div>
                    )}

                    {!imgURL && !textoTitulo && (
                        <div className=" w-[283px]" />
                    )}


                    {/* Aqui va el texto del centro */}

                    <div className=" md:mx-[0%] xsm:mx-[5%] md:text-center xsm:text-left md:text-[18px] xsm:text-[16px] md:text-gray-200 xsm:text-white">
                        <p>{bodyText}</p>
                    </div>

                    {/* Aqui va el boton */}
                    <div>
                        {isModal === "no" && (
                            <ButtonGhost classStyles="border-white text-white text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black 
                        w-full rounded-md h-[48px] 3xl:w-[320px] xl:w-[250px] md:w-[170px] xsm:w-[320px] "
                                text={textBoton1 as string} href={urlBtn1 as string}
                            />
                        )}
                        {isModal === "si" && (
                            <ButtonLanding classStyles="border-2 border-white bg-gray-450 text-white text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black w-full rounded-md h-[48px] 3xl:w-[320px] xl:w-[250px] md:w-[170px] xsm:w-[320px]" textBoton={textBoton1 as string} />
                        )}
                    </div>

                </div>


            </div>
        </div>
    )

}

export default BloqueSeparador