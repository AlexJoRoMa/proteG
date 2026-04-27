import React from "react";
import IzziHeaderLanding from "@/components/organisms/headerLanding";
import { contentfulClient } from "@/services/contentful/client";
import { Entry, EntrySkeletonType } from "contentful";
import { getMicroCopy } from '@/services/contentful/components';
import { getTelNumber } from '@/services/izzi/getTelNumbers';
import { getTrackingBase } from "@/services/izzi/getURL";

async function getHeaderContentType() {
  const responseData = await contentfulClient.getEntries({
      content_type: 'header',
      include: 3
  });
  return responseData.items;
} 


export default async function NavigationLanding() {
  
  const getClienteTitulo = await getMicroCopy('sieres.cliente');
  const getClienteNum = await getMicroCopy('sieres.cliente.num');
  const getLlamanosTitulo = await getMicroCopy('llamanos.gratis');

  const clienteTitulo = getClienteTitulo?.[0]?.fields?.value;
  const clienteNum = getClienteNum?.[0]?.fields?.value;
  const llamanosTitulo = getLlamanosTitulo?.[0]?.fields?.value;

  const getNumberTelValue = getTelNumber();
  const getTracking = getTrackingBase();

  const apibarData: Entry<EntrySkeletonType, undefined, string>[] | null = await getHeaderContentType();

  return (
    <IzziHeaderLanding getNumTel={getNumberTelValue} 
    apibarData={apibarData} clienteTitulo={clienteTitulo as string} 
    llamanosTitulo={llamanosTitulo as string}
    llamanosNum={clienteNum as string}
    urlTracking={getTracking}
    />  
  );
}