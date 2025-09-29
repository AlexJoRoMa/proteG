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
}

export interface ApiToken {
    refresh_token: string,
    token_type: string,
    access_token: string,
    expires_in: Number,
}

export interface PackageInfo {
    id: number,
    rpt: string,
    coverage: string[]
}

export interface Offers {
    DOBLE_PLAY: OfferItem[],
    TRIPLE_PLAY: OfferItem[],
    MOVIL: OfferItem[],
    TV: OfferItem[]
}

export interface OfferItem {
    idPaquete: number,
    titulo: string,
    descripcion: string,
    precioPaquete: string,
    precioAhorro: string,
    canales?: string,
    canalesHd?: string,
    velocidadMaxima?: number,
    velocidadMinima?: number,
    extrasIncluidos?: string[]
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

export type ProviderProps = {
    children: ReactNode,
    configuradorEntry: ApiResponse,
    copysResumen: {},
    copysConfigurador: {},
    resumenIcon: EntrySkeletonType<ResumenIcon>,
    ottsImages: Entry<EntrySkeletonType<OttsImages>>[]
    cobertura: boolean
}

export type DataFields = {
    configuradorEntry?: ApiResponse
    copysResumen?: {},
    copysConfigurador?: {},
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
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>
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
    titulo?: string,
    descripcion?: string,
    precioPaquete?: string,
    precioAhorro?: string,
    velocidadMinima?: number,
    velocidadMaxima?: number,
    extrasIncluidos?: string[],
    canales?: string,
    canalesHd?: string,
    extrasMap?: {
        ott?: OttProps[]
    },
    extras?: {
        idPaquete?: number,
        titulo?: string,
        descripcion?: string,
        precioPaquete?: string,
        precioAhorro?: string,
        velocidadMinima?: number,
        velocidadMaxima?: number,
        extrasIncluidos?: string[],
        canales?: string,
        canalesHd?: string,
    }
}

export type OttProps = {
    idExtra: number,
    maximo: number,
    productId: string,
    titulo: string,
    costo: string,
    descripcion: string,
    grupo?: number
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

export type CoberturaType = {
    lat: string,
    lng: string,
    zipCode: string
}