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
    textBtn: string | React.ReactNode;
    classStyles?: string;
    idModal?: string;
    children?: React.ReactNode;
    closeButtonStroke?: string; // Color del stroke del botón de cerrar
    modalContentClassName?: string; // Clases adicionales para el ModalContent
    startContent?: React.ReactNode; // Contenido que se muestra al inicio del botón
    backdropColor?: string; // Color del backdrop del modal, por defecto "black"
}

export type LinkModalProps = {
    text: string | React.ReactNode;
    classNames?: string;
    idModal: string;
    children?: React.ReactNode;
    closeButtonStroke?: string; // Color del stroke del botón de cerrar
    modalContentClassName?: string; // Clases adicionales para el ModalContent
    backdropColor?: string; // Color del backdrop del modal, por defecto "black"
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
    onClose?: () => void; // Añadido para manejar el cierre del modal
    closeButtonStroke?: string; // Color del stroke del botón de cerrar, por defecto "white"
    modalContentClassName?: string; // Clases adicionales para el ModalContent
    backdropColor?: string; // Color del backdrop del modal, por defecto "black"
}

export interface TeLlamamosModalComponentProps {
  isOpen?: boolean;
  onClose?: () => void;
  modalData?: {
    title: string;
    column1: {
      title: string;
      row1: {
        text: string;
        tel: string;
      };
      row2: {
        link: string;
      };
      row3: {
        wpp: {
          text: string;
          tel: string;
          promoText: string;
        };
      };
    };
    column2: {
      title: string;
      row1: {
        text: string;
        tel: string;
      };
      row2: {
        link: {
          text: string;
          url: string;
        };
      };
      row3: {
        wpp: {
          text: string;
          tel: string;
          promoText: string;
        };
      };
    };
  };
}

export interface TeLlamamosFormModalProps {
  modalData?: {
    title: string;
    subtitle?: string;
    placeholder: string;
    buttonText: string;
    checkboxText: string;
    telephoneLabel: string;
    privacyLink: {
      text: string;
      url: string;
    };
    // Propiedades para la vista de éxito
    successTitle?: string;
    successDescription?: string;
    successButtonText?: string;
  };
}