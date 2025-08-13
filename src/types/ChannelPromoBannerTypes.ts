export type heroImageType = {
  url: string;
  legend?: string;
  width?: number;
  height?: number;
}

export type footerImageType = {
  images: {
    height: number;
    width: number; url: string 
}[];
  legend: string | null;
  originalIndex: number
}