import { Asset } from "contentful";
import { ColorOption } from "@/constants/ColorModalConstants";
import { ExtrasIncluidos } from "./ConfiguradorTypes";
import { CSSProperties } from "react";

export type FeatureListItemComponentProps = {
  title?: string;
  description?: string;
  image?: Asset
};

export type TextAndImageComponentProps = {
  text?: string;
  image?: Asset
  fontSize?: string;
  orientation?: 'horizontal' | 'vertical';
};

export type PriceComponentProps = {
  textBeforePrice?: string;
  textAfterPrice?: string;
  price?: string;
  align?: 'horizontal' | 'vertical';
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
    hrColor?: ColorOption; // Opción de color para el HR del RichTextComponent
    style?: CSSProperties; //
}

export type LinkModalProps = {
    text: string | React.ReactNode;
    classNames?: string;
    idModal: string;
    children?: React.ReactNode;
    closeButtonStroke?: string; // Color del stroke del botón de cerrar
    modalContentClassName?: string; // Clases adicionales para el ModalContent
    backdropColor?: string; // Color del backdrop del modal, por defecto "black"
    hrColor?: ColorOption; // Opción de color para el HR del RichTextComponent
    /** Called when the user opens the modal (e.g. analytics). */
    onOpenModal?: () => void;
}

export type ButtonModalComponentProps = {
  url?: string;
  text?: string;
  external?: boolean; // Indica si el enlace es externo
  preSeleccion?: boolean; // Indica si el enlace hace relacion a un paquete preseleccionado
  nombreCodePlan?: string | null;
  nombreCodeMovil?: string | null;
};

export type ModalType = {
    isOpen: boolean;
    onOpenChange: () => void;
    children: React.ReactNode;
    onClose?: () => void; // Añadido para manejar el cierre del modal
    closeButtonStroke?: string; // Color del stroke del botón de cerrar, por defecto "white"
    modalContentClassName?: string; // Clases adicionales para el ModalContent
    backdropColor?: string; // Color del backdrop del modal, por defecto "black"
    hrColor?: ColorOption; // Opción de color para el HR del RichTextComponent
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

export interface TeLlamamosModalLandingComponentProps {
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
  };
  telNumber: string;
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
    utm?: string;
  };
}

export interface ModalContentEntry {
    fields: {
        content: Document;
        internalName?: string;
    };
}


export interface ConfiguradorCardsModalProps {
  modalData?: ModalData,
  variables: {
    velocidadMinima?: number,
    velocidadMaxima?: number,
    precioPaquete: string,
    periodo?: string,
    plazoForzoso?: boolean,
    domicilio?: string,
    canales?: string,
    extras?: ExtrasIncluidos[]
  },
  type: "internet" | "tv" | "movil",
}

export interface ModalData {
  titulo: string,
  periodo?: {
    plazo?: string,
    sinPlazo?: string,
  },
  domicilio?: string,
  header: {
    titulo: {
      preVelocidadMinima?: string,
      posVelocidasMinima?: string,
      unidadVelocidad?: string,
      posVelocidadMaxima?: string,
      meses?: string,
      preCanales?: string,
      posCanales?: string,
      preVelocidad?: string,
      posVelocidad?: string,
      tituloIlimitado?: string,
    },
    precio: {
      prePrecio: string,
      posPrecio: string,
    }
  },
  body: {
    texto1?: string,
    textoPlazo?: string,
    textoSinPlazo?: string,
    textoPromocion1?: string,
    textoPromocion2?: string,
    texto2?: string,
    textoDomicilio?: string,
    texto3?: string,
    textoPromocion3?: string,
    texto4?: string,
    beneficios: {
      titulo1: string,
      descripcion1: string,
      titulo2: string,
      descripcion2: string,
    },
    textoBoton: string,
  },
  footer: {
    terminos: {
      texto: string,
      url: string
    },
    descripcion: string
  }
}

export interface IconProps {
  fields: {
    altText: string,
    internalName: string,
    image: {
      fields: {
        description: string,
        title: string,
        file: {
          url: string,
          details: {
            image: {
              height: number,
              width: number
            }
          }
        }
      }
    }
  }
}
