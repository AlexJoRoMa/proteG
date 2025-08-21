import { Asset, Entry, EntrySkeletonType} from "contentful";
export interface MediaAssetFields {
  file?: {
    url: string;
    details: {
      image?: {
        width: number;
        height: number;
      }
    }
    }
  }

 export interface MediaEntryFields {
  image?: Asset<MediaAssetFields, 'es-MX'>;
}
export interface CardSegmentosFields {
  fields: CardSegmentosFields;
  titulo?: string;
  segmentoCanal?: Entry<EntrySkeletonType<MediaEntryFields>>[];
}
export interface TabsDataFields {
  entryTitle: string;
  cards: CardSegmentosFields[];
}

export interface TabsDataContainerFields {
  title?: string;
  tabs?: TabsDataFields[];
}

export interface TabsContentProps {
  tabsData?: Entry<EntrySkeletonType<TabsDataFields>>[];
}

export type TVCanalesSegmentoID = {
    id: string;
}
