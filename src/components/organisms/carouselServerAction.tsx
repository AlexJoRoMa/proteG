'use server'

import { Entry, EntrySkeletonType } from "contentful"
import CarouselCardComponent from "./CarouselCardComponent"

export async function carouselServerAction(cardsSugestion: Entry<EntrySkeletonType, undefined, string>[] | null) {

    return <CarouselCardComponent recomendador={cardsSugestion}/>
}