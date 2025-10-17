
export type AttacheFilesProps = {
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