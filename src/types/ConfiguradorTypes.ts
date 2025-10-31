import { Entry, EntrySkeletonType } from "contentful";
import { ReactNode } from "react";

// props
export type ConfiguradorProps = {
    id: string;
}

export type StepProps = {
    step: number
}
export interface ConfiguradorCopyFields {
    cobertura: string;
    internet: string;
    movil: string;
    title: string;
    tv: {
        title: string;
        description: string;
    }
}

// entryData
export interface ApiResponse {
    coverageType: string[],
    offers: Offers,
    rptCode: string,
    hub: string,
    offnetIzzi: boolean,
    offnetSky: boolean
}

export interface ApiToken {
    refresh_token: string,
    token_type: string,
    access_token: string,
    expires_in: number,
}

export interface PackageInfo {
    id: number,
    rpt: string,
    coverage: string[]
}

export interface QuoteInfo {
    rpt: string,
    postalCode: string,
    hub: string,
    coverageType: string[],
    requestedServices: {
        extras?: Extra[],
        product: number
    },
    offnet: boolean
}

export interface Extra {
    extId: number,
    nuevaCantidad: number,
    combo: boolean
}

export interface Offers {
    DOBLE_PLAY: OfferItem[],
    TRIPLE_PLAY: OfferItem[],
    MOVIL: OfferItem[],
    TV: OfferItem[]
}

export interface OfferItem {
    idPaquete: number,
    idExtra: number,
    titulo: string,
    descripcion: string,
    precioPaquete: string,
    periodicidad: string,
    canales?: string,
    canalesHd?: string,
    spTV: boolean,
    spMovil: boolean,
    velocidadMaxima?: number,
    velocidadMinima?: number,
    extrasIncluidos?: ExtrasIncluidos[],
    izziAhorros?: Ahorro[],
    descuentoPaquete?: string,
    precioDomiciliacion?: string,
    precioTachado?: string;
}

export interface Ahorro {
    aplica: string,
    categoria: string,
    monto: string
}

export interface ExtrasIncluidos {
    titulo: string,
    plazo: string,
    categoria: string
}

export interface MovilPlansInfo {
    tituloTab: string,
    cards: OfferItem[]
}

export interface ResumenIcon {
    altText: string,
    internalName: string,
    image: {
        fields: {
            title: string,
            description: string,
            file: {
                url: string
            }
        }
    }
}

export interface OttsImages {
    internalName: string,
    type: string,
    ottImage: {
        fields: {
            altText: string,
            image: {
                fields: {
                    file: {
                        url: string
                    }
                }
            }
        }
    }
}

//entryTabs

export interface ConfigCardsFields {
    interalName: string,
    entryTitle: string,
    cards: OfferItem[]
}

export interface ConfigTabsFields {
    internalName: string,
    type: string,
    tabs: ConfigCardsFields[]
}

//Provider

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type CopysObject = {};

export type ProviderProps = {
    children: ReactNode,
    configuradorEntry: ApiResponse,
    copysResumen: CopysObject,
    copysConfigurador: CopysObject,
    resumenIcon: EntrySkeletonType<ResumenIcon>,
    ottsImages: Entry<EntrySkeletonType<OttsImages>>[],
    cobertura: boolean,
}

export type DataFields = {
    configuradorEntry?: ApiResponse
    copysResumen?: CopysObject,
    copysConfigurador?: CopysObject,
    cobertura: boolean,
    userAnswers: UserAnswers,
    setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>,
    izziSelection: IzziSelection | null,
    setIzziSelection: React.Dispatch<React.SetStateAction<IzziSelection | null>>,
    checkedPromotions: boolean,
    setCheckedPromotions: React.Dispatch<React.SetStateAction<boolean>>,
    resumenIcon: EntrySkeletonType<ResumenIcon>,
    ottsImages: Entry<EntrySkeletonType<OttsImages>>[],
    infoDrawerContent: string,
    setInfoDrawerContent: React.Dispatch<React.SetStateAction<string>>,
    disabled: boolean,
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
}

export interface Promotion {
    promoPackage?: PromoPackage[],
    promos?: Promos[]
}

export interface PromoPackage {
    amount: string,
    duration: number,
    name: string,
    permanent: string,
    startMonth: number
}

export interface Promos {
    mesInicio: string,
    meses: string,
    permanente: string,
    product: string,
    promoMode: string,
    promoMovil: boolean,
    promoName: string,
    promoPrice: number,
    promoType: string,
    serviceType: string,
}

export interface UserAnswers {
    total?: number,
    internet?: {
        paquete?: OfferItem | null,
        total?: number
    },
    movil?: {
        paquete?: OfferItem | null,
        contrato?: string,
        total?: number,
    },
    tv?: {
        paquete?: OfferItem | null,
        total?: number,
        ott?: {
            planes: OttProps[],
            total: number
        }
    }
}

export interface IzziSelection {
    idPaquete?: number,
    idExtra?: number,
    titulo?: string,
    periodicidad?: string,
    descripcion?: string,
    precioPaquete?: string,
    precioDomiciliacion?: string,
    velocidadMinima?: number,
    velocidadMaxima?: number,
    extrasIncluidos?: ExtrasIncluidos[],
    canales?: string,
    canalesHd?: string,
    spTV?: boolean,
    spMovil?: boolean,
    extrasMap?: {
        ott?: OttProps[]
    },
    extras?: {
        idPaquete?: number,
        idExtra?: number,
        titulo?: string,
        periodicidad?: string,
        descripcion?: string,
        precioPaquete?: string,
        velocidadMinima?: number,
        velocidadMaxima?: number,
        extrasIncluidos?: ExtrasIncluidos[],
        canales?: string,
        canalesHd?: string,
        spTV?: boolean,
        spMovil?: boolean,
    }
}

export type OttProps = {
    idExtra: number,
    maximo: number,
    productId: string,
    titulo: string,
    nombreSiebel: string;
    costo: string,
    descripcion: string,
    grupo?: number,
    categoriaExtra?: string
}

export type internetComponentFields = {
    paquete: OfferItem,
    total: number
}

export type tvComponentFields = {
    ott?: {
        planes: ottFields[],
        total: number,
    },
    paquete: OfferItem,
    total: number
}

export type movilComponentFields = {
    paquete: OfferItem,
    contrato: string,
    total: number
}

export type ottFields = {
    idExtra: number,
    maximo: number,
    productId: string,
    titulo: string,
    costo: string,
    descripcion: string,
    grupo?: number
}

// copys

export type ConfiguradorCopys = {
    page: {
        titulo: string,
        botonRegreso: {
            titulo: string,
            url: string
        },
        ayuda: {
            textoInfo: string,
            botonAyuda: string,
        },
    },
}

export type OffersCopys = {
    page: {
        titulo: string,
        ayuda: {
            textoInfo: string,
            botonAyuda: string
        },
        botonRegreso: {
            titulo: string,
            url: string
        }
    },
    internet: {
        titulo: string,
        cards: {
            preVelocidad: string,
            posVelocidad: string,
            unidadVelocidad: string,
            periodo: string,
            info: string
        }
    },
    tv: {
        titulo: string,
        cards: {
            periodo: string,
            info: string,
            titulo: string,
            tituloPlus: string
        }
    },
    movil: {
        titulo: string,
        subTitulo: string,
        tabs: {
            contrato: string,
            sinPlazo: string,
        },
        cards: {
            periodo: string,
            info: string
        }
    }
}

export interface CoberturaType {
    lat?: string,
    lng?: string,
    zipCode?: string,
    address?: string
}

export type ClientProps = {
    resumenIcon: EntrySkeletonType<ResumenIcon>
    ottImages: Entry<EntrySkeletonType<OttsImages>>[]
    copysResumen: string
    copysConfigurador: ConfiguradorCopys
  }