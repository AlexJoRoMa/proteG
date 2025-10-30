import React from "react";
import IzziHeaderLanding from "@/components/organisms/headerLanding";
import { contentfulClient } from "@/services/contentful/client";
import { Entry, EntrySkeletonType } from "contentful";
import { getMicroCopy } from '@/services/contentful/components';

async function getHeaderContentType() {
  const responseData = await contentfulClient.getEntries({
      content_type: 'header',
      include: 3
  });
  return responseData.items;
} 

const getClienteTitulo = await getMicroCopy('sieres.cliente');
const getLlamanosTitulo = await getMicroCopy('llamanos.gratis');


const apibarData: Entry<EntrySkeletonType, undefined, string>[] | null = await getHeaderContentType();

interface NavigationProps {
  navbarData: Entry<EntrySkeletonType, undefined, string> | null;
}


export default function NavigationLanding({ navbarData }: NavigationProps) {
  const clienteTitulo = getClienteTitulo?.[0]?.fields?.value;
  const llamanosTitulo = getLlamanosTitulo?.[0]?.fields?.value;

  return (
    <IzziHeaderLanding navbarData={navbarData} apibarData={apibarData} clienteTitulo={clienteTitulo as string} llamanosTitulo={llamanosTitulo as string}/>  
  );
}