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
      <div className="flex flex-col lg:flex-row mx-sm sm:mx-md 2xl:mx-xl md:gap-[24px]">
        {cards?.map((card, index) => (
          <ProductCard key={`${card}-${index}`} color={card.fields.backgroundColor.value} borderColor={card.fields.backgroundColor.value} icon={card.fields.productIcon.fields.file.url} altIcon={card.fields.productIcon.fields.file.fileName} cardData={card}/>
        ))}
      </div>
    </>
  );
}