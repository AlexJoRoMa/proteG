import React from "react";
import ProductCard from "@/components/organisms/ProductCard";
import { contentfulClient } from "@/services/contentful/client";
import { Entry, EntrySkeletonType } from "contentful";
import { GenericProductProps, GenericProductCardType } from "@/types/GenericProductTypes";
import { internetLogo, izziTvLogo, izziMovilLogo } from "@/components/atoms/GenericProductCardIcon";

export default async function GenericProductCard({ id }: GenericProductProps) {
  const cardsData:Entry<EntrySkeletonType, undefined, string> | null = await contentfulClient.getEntries({
    content_type: 'genericCardContainer',
    'sys.id': id,
    include: 2
}).then((entriesResponse) => {
    return entriesResponse.items[0]
});
const cards = cardsData?.fields.productCard as Array<GenericProductCardType>
  return (
    <>
      <div className="flex flex-col xl:flex-row mx-sm lg:mx-md 2xl:mx-xl xl:justify-between">
        <ProductCard color="bg-orange-400" borderColor="border-orange-400" icon={internetLogo} cardData={cards[0]}/>
        <ProductCard color="bg-cyan-400" borderColor="border-cyan-400" icon={izziTvLogo} cardData={cards[1]}/>
        <ProductCard color="bg-magenta-400" borderColor="border-magenta-400" icon={izziMovilLogo} cardData={cards[2]}/>
      </div>
    </>
  );
}