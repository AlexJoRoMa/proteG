
export type DatosContratacion = {
    DatosPersonales: {
        personal: {
            firstName: string,
            secondName?: string,
            aditionalTel?: string,
            curp?: string,
            email: string,
            firstLastName: string,
            phone: string,
            secondLastName: string,
            passport?: string,
        },
        instalacion: {
            street?: string,
            reference?: string,
            street2?: string,
        },
        facturacion: {
            comprobanteFiscal?: string,
            regimenFiscal?: string,
            rfc?: string,
        },
        direccionFacturacion: {
            address?: string,
            city?: string,
            colony?: string,
            exteriorNumber?: string,
            interiorNumber?: string,
            postalCode?: string,
            state?: string,
        },
        meta: {
            esExtranjero?: boolean,
            facturarOtraDireccion?: boolean,
            necesitaFacturar?: boolean,
            regimen?: string,
            cfdi?: string
        },
    },
    VerificacionContacto: {
        idTransaction: string,
        codigoVerificacion: string,
    },
    DocumentosTitular: {
        documentos: {
            ine: {
                file: File | null
            },
            comprobante: {
                file: File | null
            }
        },
        ine: {
            fileName: string,
            fileExtension: string,
            data: string,
        },
        comprobante: {
            fileName: string,
            fileExtension: string,
            data: string,
        },
    },
    Instalacion: {
        cvTimeslot: string,
        requestedShipDate: string,
    },
    Pago: {
        metodoPago?: string,
        success?: boolean
    }
}

export interface ProcessStatus {
    accountNumber: string,
    accountId: string,
    waitingForAction: boolean,
    orderNumber: string
}

export interface StatusFlujo {
    step1: {
        completado: boolean
    },
    step2: {
        completado: boolean
    },
    step3: {
        completado: boolean
    },
    step4: {
        completado: boolean
    },
    step5: {
        completado: boolean
    },
    step6: {
        completado: boolean
    },
}

export interface PaymentReference {
    cardReference: string,
    paypalReference: string
}

export interface PaymentLiga {
    response: {
        html: string,
        reference: string,
    },
}

export type MetodoPago = "creditCard" | "paypal" | "tecnico"

export interface TabConfigItem {
    key: MetodoPago;
    title: string;
    Component: React.FC;
    isHidden?: boolean;
}


export type AttachFilesProps = {
    processStatus: {
        accountNumber?: string,
        accountId?: string,
    },
    datosContratacion: {
        DocumentosTitular: {
            ine: {
                fileName: string,
                fileExtension: string,
                data: string,
            },
            comprobante: {
                fileName: string,
                fileExtension: string,
                data: string,
            },
        }
    }

}

export interface SendCodeProps {
    body: Record<string, unknown>;
    headers: {
        medio: string;
        oferta: string;
        origin: string;
    }
}

export interface EnrollProps {
    body: Record<string, unknown>;
    headers: {
        Cookie: string;
    }
}

export interface ProcessStatusProps {
    headers: {
        processId: string
    }
}

export interface SubmitOfferProps {
    body: Record<string, unknown>;
}

export interface AttachFilesServiceProps {
    body: Record<string, unknown>;
}

export interface GetCapacityProps {
    headers: {
        processId: string;
    }
}

export interface LigaPagoProps {
    body: Record<string, unknown>;
    headers: {
        origin: string,
        channel: string
    }
}

export interface VerificaPago {
    body: Record<string, unknown>;
    headers: {
        origin: string,
        channel: string
    }
}

export interface SubmitCapacityProps {
    body: Record<string, unknown>;
}