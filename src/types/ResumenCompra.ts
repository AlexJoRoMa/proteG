// Resumen de Compra

import { UserAnswers } from "./ConfiguradorTypes"
import { MesId } from "@/constants/ResumenConstants";

export type ResumenContentProps = {
    copys: ResumenData,
    userSelection: UserAnswers
}

export type ResumenData = {
    titulo: string,
    pagoPosterior: string,
    ahorro: {
        domicilio: string,
        pagoAnticipado: string,
        paquete: string,
        infoAdicional: string,
        titulo: string,
        izziAhorro: string,
        internet: string,
        meses: Record<MesId, string>,
        domiciliacion: {
            descuento: string,
            titulo: string,
            subtitulo: string,
        },
        proximosPagos: string
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
        titulo: string,
        primerMes: string
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
            titulo: string,
            extrasIncluidos: string,
            textoContratacion: string
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
            unidad: string,
            planComparte: string
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
    },
    informacion: {
        promociones: string,
        combinaciones: string
    },
    detalleSeleccion: string
}