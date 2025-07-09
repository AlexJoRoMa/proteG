export type heroImageType = {
  url: string;
  legend?: string;
}

export type footerImageType = {
  images: { url: string }[];
  legend: string | null;
  originalIndex: number
}