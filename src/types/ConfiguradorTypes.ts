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
export interface ComponentsFields {
    canales: string,
    canalesHd: string,
    descripcion: string,
    extrasIncluidos: Array<string>,
    idPaquete: number,
    precioAhorro: string,
    precioPaquete: string,
    titulo: string,
    velocidadMaxima: number,
    velocidadMinima: number
}

export interface MovilPlansInfo {
    tituloTab: string,
    cards: ComponentsFields[]
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
    cards: ComponentsFields[]
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
        paquete?: ComponentsFields | {},
        total?: number
    },
    movil?: {
        paquete?: ComponentsFields | null,
        contrato?: string,
        total?: number,
    },
    tv?: {
        paquete?: ComponentsFields | null,
        total?: number,
        ott?: {
            planes: OttProps[],
            total: number
        }
    }
}

export type OttProps = {
    id: string,
    title: string,
    description: string,
    price: number,
    term: string
}

// Resumen de Compra

export type ResumenData = {
    titulo: string,
    pagoPosterior: string,
    ahorro: {
        domicilio: string,
        pagoAnticipado: string,
        paquete: string,
        infoAdicional: string
    },
    boton: {
        comprobarPromociones: string,
        contratar: {
            titulo: string,
            url: string
        }
    },
    total: {
        sinDescuentos: string,
        titulo: string
    },
    promociones: {
        titulo: string,
        textoAhorro: string
    },
    paquetes: {
        internet: {
            infoAdicional: string,
            postCapacidad: string,
            prevCapacidad: string,
            titulo: string
        },
        tv: {
            titulo: string,
            preCanales: string,
            postCanales: string,
            ott: {
                titulo: string
            }
        },
        movil: {
            titulo: string,
            unidad: string
        }
    },
    seleccionPaquetes: {
        '4p': string,
        internet: string,
        'internet&movil': string,
        'internet&tv': string,
        movil: string,
        tv: string,
        'tv&movil': string
    },
    info: {
        combinacion: {
            prevPrice: string,
            postPrice: string
        },
        existeCobertura: string,
        portabilidad: string,
        sinCobertura: {
            titulo: string,
            subTitulo: string
        },
        tvLight: string
    },
    infoDrawer: {
        nuevoFlujo: string,
        plazo: string,
        combinacion: {
            prePrice: string,
            postPrice: string
        },
        paquetes: {
            'internet&tv&movil': string,
            internet: string,
            'internet&movil': string,
            'internet&tv': string,
            movil: string,
            tv: string,
            'tv&movil': string
        }
    }
}

export type internetComponentFields = {
    paquete: ComponentsFields,
    total: number
}

export type tvComponentFields = {
    ott?: {
        planes: ottFields[],
        total: number,
    },
    paquete: ComponentsFields,
    total: number
}

export type movilComponentFields = {
    paquete: ComponentsFields,
    contrato: string,
    total: number
}

export type ottFields = {
    description: string,
    id: string,
    price: number,
    term: string,
    title: string
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
            info: string
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