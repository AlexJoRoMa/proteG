/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Navigation from "@/components/molecules/navigation";
import { getCards } from '../services/contentful/cards'

export default async function Home() {
  const ids = [
    '4FL3WMn8tLkutYJ8uhcp9n',
    '7eranUDkB4XJknzt6VTtXo',
    'b9CN2z8VbmjiV4zWL8zZH',
    '3ri4J3b2bIG0SwjW2kafcN'
  ]; //ids de las cards

  const cards = await getCards(ids);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">

      <Navigation />
      

       <h1>hazlo fácil, hazlo izzi</h1>

      <div className="border border-yellow-500 flex flex-row">
        {cards.map((card: any) => {
          const fields = card.fields;
          const mediaBlock = fields.image;
          const imageAsset = mediaBlock?.fields?.image;
          const imageUrl = imageAsset?.fields?.file?.url;

          return (
            <div key={card.sys.id} className="border border-green-500 ">
              <div className="items-center justify-items-center">
              {imageUrl && (
                <Image
                alt={'Images'}
                src={`https:${imageUrl}`}
                width={50}
                height={60}
                />
              )}
              </div>
              <div className="text-[18px] text-center flex items-center justify-center ">
                <p>{fields.entryBody}</p>      
              </div>
            </div>
          );
        })}
      </div>
      {/*  <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Home Page</h1>
      </main> */}
    </div>
  );
}

/* 
h-full
w-[300px] mx-auto
className="border border-red-500"


className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
 */
