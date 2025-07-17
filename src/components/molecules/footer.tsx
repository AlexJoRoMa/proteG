import React from "react";
import IzziFooterContent from "@/components/organisms/izziFooter";
import { contentfulClient } from "@/services/contentful/client";
import { Entry, EntrySkeletonType } from "contentful";

async function getFooterContentType() {
  const responseData = await contentfulClient.getEntries({
      content_type: 'footer',
      select: ['fields.internalName', 'fields.footerContactSection', 'fields.footerLinkSection'],
      include: 3
  });
  return responseData.items[0];
}

const topFooter: Entry<EntrySkeletonType, undefined, string> | null = await getFooterContentType();

export default function Footer() {
    return (
      <IzziFooterContent contactData={topFooter} linksData={topFooter} />
    );
}