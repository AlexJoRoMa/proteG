import React from "react";
import IzziHeaderLanding from "@/components/organisms/headerLanding";
import { Entry, EntrySkeletonType } from "contentful";
import { getMicroCopy } from '@/services/contentful/components';
import { getTelNumber } from '@/services/izzi/getTelNumbers';
import { getTrackingBase, getLandingSlug } from "@/services/izzi/getURL";
import { fetchHeaderByPageSlug } from "@/services/contentful/pages";

export default async function NavigationLanding() {
  
  const getClienteTitulo = await getMicroCopy('sieres.cliente');
  const getClienteNum = await getMicroCopy('sieres.cliente.num');
  const getLlamanosTitulo = await getMicroCopy('llamanos.gratis');

  const clienteTitulo = getClienteTitulo?.[0]?.fields?.value;
  const clienteNum = getClienteNum?.[0]?.fields?.value;
  const llamanosTitulo = getLlamanosTitulo?.[0]?.fields?.value;

  const getNumberTelValue = getTelNumber();
  const getTracking = getTrackingBase();

  const slug = getLandingSlug();
  const apibarData: Entry<EntrySkeletonType, undefined, string>[] | null = slug
    ? await fetchHeaderByPageSlug(slug)
    : null;

  return (
    <IzziHeaderLanding getNumTel={getNumberTelValue} 
    apibarData={apibarData} clienteTitulo={clienteTitulo as string} 
    llamanosTitulo={llamanosTitulo as string}
    llamanosNum={clienteNum as string}
    urlTracking={getTracking}
    />  
  );
}