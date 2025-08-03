import { Asset } from "contentful";

export type FeatureListItemComponentProps = {
  title?: string;
    description?: string;
    image?: Asset
};

export type TextAndImageComponentProps = {
  text?: string;
  image?: Asset
  fontSize?: string;
};

export type PriceComponentProps = {
  textBeforePrice?: string;
  textAfterPrice?: string;
  price?: string;
};

export type ButtonModalProps = {
    textBtn: string;
    classStyles?: string;
    idModal: string;
}

export type ButtonModalComponentProps = {
  url?: string;
  text?: string;
  external?: boolean; // Indica si el enlace es externo
};

export type ModalType = {
    isOpen: boolean;
    onOpenChange: () => void;
    children: React.ReactNode;
}