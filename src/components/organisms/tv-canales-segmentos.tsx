import { contentfulClient } from "@/services/contentful/client";
import { tabsTileProps, TabsDataFields } from "@/types/TvCanalesSegmentosTypes";
import { Entry, EntrySkeletonType } from "contentful";
import { getMicroCopy } from '@/services/contentful/components';
import TvChannelsSegmentClient from "../tvChannels/TvChannelsSegmentsClient";

export default async function TVCanalesSegmento({ id }: tabsTileProps) {

  const tabsEntry: Entry<EntrySkeletonType, undefined, string> | null =
    await contentfulClient
      .getEntries({
        content_type: "tabsContainer",
        "sys.id": id,
        include: 3,
      })
      .then((entriesResponse) => entriesResponse.items[0]);

  const entryTitle = tabsEntry?.fields.title as string;
  const copyEntryData = tabsEntry?.fields.tabs as unknown as EntrySkeletonType<TabsDataFields>[];

  const getTextVolver = await getMicroCopy("btn.volver");
  const getULRVolver = await getMicroCopy("btn.volverURL");
  const getTextGuia = await getMicroCopy("btn.guiaprogramacion");
  const getURLGuia = await getMicroCopy("btn.guiaURL");

  const setTextVolver = getTextVolver?.[0]?.fields?.value;
  const setURLVolver = getULRVolver?.[0]?.fields?.value;
  const setTextGuia = getTextGuia?.[0]?.fields?.value;
  const setURLGuia = getURLGuia?.[0]?.fields?.value;

  const titulos = (copyEntryData ?? []).flatMap((tab) =>
    (tab.fields?.cards ?? [])
      .map((card) => (card as { fields?: { titulo?: string } }).fields?.titulo)
      .filter((t): t is string => t != null),
  );
  const filterOptions = [...new Set(titulos)];

  return (
    <TvChannelsSegmentClient
      entryTitle={entryTitle}
      entryData={copyEntryData ?? []}
      filterOptions={filterOptions}
      setTextVolver={setTextVolver as string}
      setURLVolver={setURLVolver as string}
      setTextGuia={setTextGuia as string}
      setURLGuia={setURLGuia as string}
    />
  );
}
