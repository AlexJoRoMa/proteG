import { Entry, EntrySkeletonType } from "contentful"

export type CarouselCardProps = {
  id?: string
  recomendador?: Entry<EntrySkeletonType, undefined, string>[] | null
}