import React from "react";
import IzziHeaderLanding from "@/components/organisms/headerLanding";
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

export default function NavigationLanding() {
  return (
    <IzziHeaderLanding navbarData={navbarData} />
  );
}