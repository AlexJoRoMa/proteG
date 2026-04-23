import React from "react";
import Image from "next/image";
import { BloqueSeparadorID, ButtonModalEntryFields, StepTabEntryFields, StepTabEntrySkeleton } from '@/types/BloqueSeparador';
import { Document } from '@contentful/rich-text-types';
import { contentfulClient } from "@/services/contentful/client";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import type { Block, Inline } from '@contentful/rich-text-types';
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
            'fields.type',
            'fields.backgroundColor',
            'fields.textRow',
            'fields.separatorBottomRow',
        ],
        include: 4,
    }).then((entriesResponse) => entriesResponse.items);

    if (!callComponents) {
        return null;
    }

    const getComponentContent = callComponents[0] as unknown as Entry<StepTabEntrySkeleton>;

    const { textoTitulo, bodyText, isModal, textBoton1, urlBtn1, image, backgroundColor, type, textRow, separatorBottomRow } = getComponentContent.fields as StepTabEntryFields;

    const assetImage = image?.fields?.image as Asset | undefined;
    const imgURL = assetImage?.fields?.file?.url;

    const bgColor = (backgroundColor as string) || "#2C2C31";



    if (type === "tvCintilloOferta") {
        const textRowItems = Array.isArray(textRow) ? textRow : [];
        const bottomRowItems = Array.isArray(separatorBottomRow) ? separatorBottomRow.slice(0, 2) : [];

        const richTextOptions = {
            renderMark: {
                [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-bold">{text}</strong>,
                [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic">{text}</em>,
            },
            renderNode: {
                [BLOCKS.PARAGRAPH]: (_node: Block | Inline, children: React.ReactNode) => (
                    <p className="text-gray-200 text-base md:text-[18px] leading-relaxed pb-2">{children}</p>
                ),
                [BLOCKS.HEADING_1]: (_node: Block | Inline, children: React.ReactNode) => (
                    <h1 className="text-white text-2xl md:text-3xl leading-tight">{children}</h1>
                ),
                [BLOCKS.HEADING_2]: (_node: Block | Inline, children: React.ReactNode) => (
                    <h2 className="text-white text-xl md:text-2xl leading-tight">{children}</h2>
                ),
                [BLOCKS.HEADING_3]: (_node: Block | Inline, children: React.ReactNode) => (
                    <h3 className="text-white text-lg md:text-xl leading-tight">{children}</h3>
                ),
                [BLOCKS.HEADING_4]: (_node: Block | Inline, children: React.ReactNode) => (
                    <h4 className="text-white text-base md:text-lg leading-tight">{children}</h4>
                ),
                [BLOCKS.HEADING_5]: (_node: Block | Inline, children: React.ReactNode) => (
                    <h5 className="text-white text-base leading-tight">{children}</h5>
                ),
                [BLOCKS.HEADING_6]: (_node: Block | Inline, children: React.ReactNode) => (
                    <h6 className="text-white text-base leading-tight">{children}</h6>
                ),
            },
        };

        return (
            <div
                className="relative min-h-[181px] md:min-h-[200px] py-6 md:py-8 overflow-hidden"
                style={{ backgroundColor: bgColor }}
            >
                <div className="md:mx-md 2xl:mx-xl h-full min-h-[140px] flex flex-row items-center justify-center">
                    <div className="flex flex-row items-center gap-4 md:gap-6 xsm:gap-4 w-full max-w-6xl min-w-0 px-1 md:px-0">
                        {imgURL && (
                            <div className="w-1/2 flex-shrink-0 flex items-center">
                                <Image
                                    className="md:w-[400px] md:h-[200px] xsm:w-[320px] xsm:h-[59px] object-contain"
                                    alt=""
                                    src={`https:${imgURL}`}
                                    loading="lazy"
                                    width={400}
                                    height={200}
                                />
                            </div>
                        )}
                        <div className="w-1/2 flex flex-col justify-center gap-4 min-w-0">
                            {textRowItems.length > 0 && (
                                <div className="flex flex-col gap-4 [&_a]:text-white [&_a]:underline min-w-0">
                                    {textRowItems.map((entry) => {
                                        const content = entry.fields?.content as Document | undefined;
                                        if (!content) return null;
                                        return (
                                            <div key={entry.sys.id} className="min-w-0">
                                                {documentToReactComponents(content, richTextOptions)}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {bottomRowItems.length > 0 && (
                                <div className="flex flex-row gap-3 md:gap-4 w-full min-w-0 flex-shrink-0 items-center">
                                    {bottomRowItems.map((btnEntry) => {
                                        const fields = (btnEntry.fields ?? {}) as ButtonModalEntryFields;
                                        const text = typeof fields.text === 'string' ? fields.text : '';
                                        const href = typeof fields.url === 'string' ? fields.url : '#';
                                        const external = typeof fields.external === 'boolean' ? fields.external : undefined;
                                        return (
                                            <ButtonGhost
                                                key={btnEntry.sys.id}
                                                classStyles="border-white text-white text-base md:text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black rounded-md h-[48px] px-6 w-1/2"
                                                text={text}
                                                href={href}
                                                external={external}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative md:h-[181px] xsm:h-[273px]"
            style={{ backgroundColor: bgColor }}
        >
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
