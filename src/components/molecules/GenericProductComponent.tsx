import React from "react";
import ProductCard from "@/components/organisms/ProductCard";
import { contentfulClient } from "@/services/contentful/client";
import { Entry, EntrySkeletonType } from "contentful";
import { GenericProductProps, GenericProductCardType } from "@/types/GenericProductTypes";

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
      <div className="flex flex-col lg:flex-row mx-sm sm:mx-md 2xl:mx-xl md:justify-between">
        <ProductCard color="bg-orange-400" borderColor="border-orange-400" icon={cards[0].fields.productIcon.fields.file.url} cardData={cards[0]}/>
        <ProductCard color="bg-cyan-400" borderColor="border-cyan-400" icon={cards[1].fields.productIcon.fields.file.url} cardData={cards[1]}/>
        <ProductCard color="bg-magenta-400" borderColor="border-magenta-400" icon={cards[2].fields.productIcon.fields.file.url} cardData={cards[2]}/>
      </div>
    </>
  );
}