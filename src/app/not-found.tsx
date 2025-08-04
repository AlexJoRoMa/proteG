import ButtonGhost from "@/components/atoms/ButtonGhost";
import { contentfulClient } from "@/services/contentful/client";
import { ErrorTypeFields } from "@/types/PageTypes";
import { Entry, EntrySkeletonType } from "contentful";
import Image from "next/image";

export default async function Error() {

    const pageEntry: Entry<EntrySkeletonType, undefined, string> | null = await contentfulClient.getEntries({
        content_type: 'errorPageContainer',
        'fields.errorType': '404',
        include: 5
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });

    const errorEntry = pageEntry?.fields as ErrorTypeFields;

    return (
        <section className="bg-gray-50 w-full flex flex-col items-center py-[64px]">
            <div className="flex justify-center w-full pb-[40px]">
                <Image
                    className="w-full h-auto"
                    src={`https:${errorEntry.image.fields.image.fields.file.url}`}
                    alt={errorEntry.image.fields.altText}
                    width={1600}
                    height={438}
                    priority
                />
            </div>
            <div className="flex flex-col text-center gap-[40px] w-full px-[16px] md:px-0">
                <div className="flex flex-col gap-[24px]">
                    <h1 className="font-bold leading-[48px] text-4xl text-black-0">{`${errorEntry.errorType}: ${errorEntry.title}`}</h1>
                    <h5 className="font-normal leading-[24px] text-lg text-black-0">{errorEntry.description}</h5>
                </div>
                <div className="flex md:flex-row gap-[24px] justify-center flex-col items-center">
                    <ButtonGhost 
                        classStyles={"py-[12px] md:py-[14px] px-[16px] w-[256px] md:w-[320px] h-auto rounded-md border-black-0 text-black-0 font-semibold leading-[24px] text-lg"} 
                        text={errorEntry.buttons[0].fields.navigationTitle as string}
                        href={errorEntry.buttons[0].fields.navigationUrl}
                        external={true}
                    />
                    <ButtonGhost 
                        classStyles={"py-[12px] md:py-[14px] px-[16px] w-[256px] md:w-[320px] h-auto rounded-md border-black-0 bg-black-0 text-white-0 font-semibold leading-[24px] text-lg"} 
                        text={errorEntry.buttons[1].fields.navigationTitle as string}
                        href={errorEntry.buttons[1].fields.navigationUrl}
                    />
                </div>
            </div>
        </section>
    )
}
