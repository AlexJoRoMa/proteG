import React from "react";
import IzziHeaderContent from "@/components/organisms/header";
import { contentfulClient } from "@/services/contentful/client";
import { Entry, EntrySkeletonType } from "contentful";

async function getHeaderContentType() {
  const responseData = await contentfulClient.getEntries({
      content_type: 'header',
      include: 3
  });
  return responseData.items;
}

const navbarData: Entry<EntrySkeletonType, undefined, string>[] | null = await getHeaderContentType();

export default function Navigation() {
  return (
    <IzziHeaderContent navbarData={navbarData} />
  );
}