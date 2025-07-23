import React from "react";
import ProductCard from "@/components/organisms/ProductCard";
import { contentfulClient } from "@/services/contentful/client";
import { Entry, EntrySkeletonType } from "contentful";
import { GenericProductProps } from "@/types/GenericProductTypes";
import { internetLogo, izziTvLogo, izziMovilLogo } from "@/components/atoms/GenericProductCardIcon";

export default async function GenericProductCard({ id }: GenericProductProps) {
  const cardsData:Entry<EntrySkeletonType, undefined, string> | null = await contentfulClient.getEntries({
    content_type: 'genericProductCard',
    'sys.id': id,
    include: 2
}).then((entriesResponse) => {
    return entriesResponse.items[0]
});
// TODO: Iterar entries con los tres contents
  return (
    <>
      <div className="flex flex-row mx-xl justify-between">
        <ProductCard color="bg-orange-400" borderColor="border-orange-400" icon={internetLogo} cardData={cardsData}/>
        <ProductCard color="bg-cyan-400" borderColor="border-cyan-400" icon={izziTvLogo} cardData={cardsData}/>
        <ProductCard color="bg-magenta-400" borderColor="border-magenta-400" icon={izziMovilLogo} cardData={cardsData}/>
      </div>
    </>
  );
}