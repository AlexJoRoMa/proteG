import ButtonGhost from "@/components/atoms/ButtonGhost";
import { contentfulClient } from "@/services/contentful/client";
import { ErrorTypeFields } from "@/types/PageTypes";
import { Entry, EntrySkeletonType } from "contentful";
import Image from "next/image";

export default async function ErrorServerPage() {

    const pageEntry: Entry<EntrySkeletonType, undefined, string> | null = await contentfulClient.getEntries({
        content_type: 'errorPageContainer',
        'fields.errorType': '500',
        include: 5
    }).then((entriesResponse) => {
        return entriesResponse.items[0]
    });

    const errorEntry = pageEntry?.fields as ErrorTypeFields;

    return (
        <section className="bg-white-0 w-full flex flex-col items-center py-[56px] xl:py-[64px] px-[16px] xl:px-[48px] 2xl:px-[56px] 3xl:px-[372.5px]">
            <div className="flex justify-center w-full pb-[40px]">
                <Image
                    className="w-[118px] h-[105px]"
                    src={`https:${errorEntry.image.fields.image.fields.file.url}`}
                    alt={errorEntry.image.fields.altText}
                    width={118}
                    height={105}
                    priority
                />
            </div>
            <div className="flex flex-col text-center gap-[40px] w-full">
                <div className="flex flex-col gap-[24px]">
                    <h1 className="font-bold leading-[48px] text-4xl text-black-0">{errorEntry.title}</h1>
                    <h5 className="font-normal leading-[24px] text-lg text-black-0">{errorEntry.description}</h5>
                </div>
                <div className="flex justify-center items-center">
                    <ButtonGhost
                        classStyles={"py-[12px] xl:py-[14px] px-[16px] w-[256px] xl:w-[320px] h-auto rounded-md border-black-0 text-white-0 bg-black-0 font-semibold leading-[24px] text-lg"}
                        text={errorEntry.buttons[0].fields.navigationTitle as string}
                        href={errorEntry.buttons[0].fields.navigationUrl}
                    />
                </div>
                <p className="text-lg leading-[24px]">
                    <span className="font-normal">{`${errorEntry.aditionalInfo} `}</span>
                    <span className="font-bold">{errorEntry.contactNumber}</span>
                </p>
            </div>
        </section>
    )
}