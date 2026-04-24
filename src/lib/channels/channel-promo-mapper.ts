import type { Asset, Entry, EntrySkeletonType } from "contentful";
import type {
  ChannelPromoData,
  ChannelPromoSlide,
} from "@/types/ChannelPromoTypes";

function assetUrl(asset: Asset | undefined): string | undefined {
  const url = asset?.fields?.file?.url;
  return url ? "https:" + url : undefined;
}

function getAssetDimensions(asset: Asset): { width: number; height: number } {
  const details = asset?.fields?.file?.details as
    | { image?: { width?: number; height?: number } }
    | undefined;
  return {
    width: details?.image?.width ?? 200,
    height: details?.image?.height ?? 300,
  };
}

function mapTextEntryToSlide(
  textEntry: Entry<EntrySkeletonType, undefined, string>,
): ChannelPromoSlide {
  const f = textEntry.fields;
  const logoAsset = f.logo as Asset | undefined;
  const images = (f.images as Asset[] | undefined) ?? (f.Images as Asset[] | undefined) ?? [];
  const posterImages = images.map((img) => ({
    url: assetUrl(img) ?? "",
    ...getAssetDimensions(img),
  }));
  return {
    logoUrl: assetUrl(logoAsset),
    title: typeof f.title === "string" ? f.title : undefined,
    description: typeof f.description === "string" ? f.description : "",
    textPromo: typeof f.textPromo === "string" ? f.textPromo : undefined,
    btnShowMore: typeof f.btnShowMore === "string" ? f.btnShowMore : undefined,
    showMoreUrl: typeof f.showMoreUrl === "string" ? f.showMoreUrl : undefined,
    btnPrimaryCtaText:
      typeof f.btnPrimaryCtaText === "string" ? f.btnPrimaryCtaText : undefined,
    primaryCtaUrl:
      typeof f.primaryCtaUrl === "string" ? f.primaryCtaUrl : undefined,
    heroImageUrl: undefined,
    imageBackground:
      assetUrl(f.imageBackground as Asset | undefined) ??
      (typeof f.imageBackground === "string" ? f.imageBackground : undefined),
    posterImages: posterImages.length > 0 ? posterImages : undefined,
    footerImages: undefined,
    footerLegend: undefined,
  };
}

export function mapContentfulToChannelPromo(
  entry: Entry<EntrySkeletonType, undefined, string>,
): ChannelPromoData {
  const carouselTextRaw = entry.fields.carouselText;

  if (!Array.isArray(carouselTextRaw) || carouselTextRaw.length === 0) {
    return { slides: [] };
  }

  const textEntries = carouselTextRaw as Entry<
    EntrySkeletonType,
    undefined,
    string
  >[];

  const slides = textEntries.map((textEntry) =>
    mapTextEntryToSlide(textEntry),
  );

  return { slides };
}
