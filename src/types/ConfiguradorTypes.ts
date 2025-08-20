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
export interface ConfigDataFields {
    title: string,
    subTitle: string,
    description: string,
    stepNumber: number,
    internalName: string,
    components: ComponentsFields[] | ConfigTabsFields[],
    type: string
}

export interface ComponentsFields {
    paquete: ComponentsFields;
    fields: ComponentsFields,
    sys: {
        id: string
    },
    internalName: string,
    maxCapacityInternet: string,
    minCapacityInternet: string,
    discountPrice: string,
    beforePrice: string,
    price: number,
    afterPrice: string,
    subTitle: string,
    title: string,
    ctaText: string
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
    configuradorEntry: Record<string, EntrySkeletonType<ConfigDataFields>>,
    copysResumen: {},
    resumenIcon:EntrySkeletonType<ResumenIcon>,
    ottsImages: Entry<EntrySkeletonType<OttsImages>>[]

}

export type DataFields = {
    configuradorEntry?: Record<string, EntrySkeletonType<ConfigDataFields>>
    copysResumen?: {},
    userAnswers: UserAnswers,
    setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>,
    checkedPromotions: boolean,
    setCheckedPromotions: React.Dispatch<React.SetStateAction<boolean>>,
    resumenIcon: EntrySkeletonType<ResumenIcon>,
    ottsImages: Entry<EntrySkeletonType<OttsImages>>[],
    infoDrawerContent: string,
    setInfoDrawerContent: React.Dispatch<React.SetStateAction<string>>
}

export interface UserAnswers {
    total?: number,
    internet?: {
        paquete?: ComponentsFields,
        total?: number
    },
    movil?: {
        paquete?: ComponentsFields,
        contrato?: string,
        total?: number,
    },
    tv?: {
        paquete?: ComponentsFields,
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
            titulo: string
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
            subtitulo: string
        }
    },
    infoDrawer: {
        nuevoFlujo: string,
        plazo: string,
        combinacion:{
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
    paquete: EntrySkeletonType<ComponentsFields>,
    total: number
}

export type tvComponentFields = {
    ott?: {
        planes: ottFields[],
        total: number,
    },
    paquete: EntrySkeletonType<ComponentsFields>,
    total: number
}

export type movilComponentFields = {
    paquete: EntrySkeletonType<ComponentsFields>,
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