import React from "react";
import IzziHeaderContent from "@/components/organisms/header";
import { contentfulClient } from "@/services/contentful/client";
import { Entry, EntrySkeletonType } from "contentful";

async function getHeaderContentType(section:string) {
  const responseData = await contentfulClient.getEntries({
      content_type: 'header',
      'fields.internalName': section,
      include: 3
  });
  return responseData.items[0];
}

const topNavbar: Entry<EntrySkeletonType, undefined, string> | null = await getHeaderContentType("TopNavbar");

const navbar: Entry<EntrySkeletonType, undefined, string> | null = await getHeaderContentType("Navbar");
// const logoUrl: string = `https:${navbar.fields.brandLogo?.fields.file.url}`;

const navbarButtons: Entry<EntrySkeletonType, undefined, string> | null = await getHeaderContentType("NavbarButtons");

export default function App() {
  return (
    <IzziHeaderContent navbarData={navbar} topNavbarData={topNavbar} navbarButtonsData={navbarButtons} />
  );
}