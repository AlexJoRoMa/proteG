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



const apibarData: Entry<EntrySkeletonType, undefined, string>[] | null = await getHeaderContentType();

interface NavigationProps {
  navbarData: Entry<EntrySkeletonType, undefined, string> | null;
}


export default function NavigationLanding({ navbarData }: NavigationProps) {

  return (
    <IzziHeaderLanding navbarData={navbarData} apibarData={apibarData} />  
  );
}