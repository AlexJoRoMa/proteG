import { AttacheFilesProps } from "@/types/Contratacion";

export async function GetAttachFile(processStatus: AttacheFilesProps["processStatus"], datosContratacion: AttacheFilesProps["datosContratacion"]) {


    try {
        console.log("datosTitular", datosContratacion)
        const attachBody = {
            "accountNumber": processStatus.accountNumber,
            "accountId": processStatus.accountId,
            "file": {
                "ine": {
                    "fileName": datosContratacion.DocumentosTitular.ine.fileName,
                    "fileExtencion": datosContratacion.DocumentosTitular.ine.fileExtension,
                    "data": datosContratacion.DocumentosTitular.ine.data,
                },
                "comprobante": {
                    "fileName": datosContratacion.DocumentosTitular.comprobante.fileName,
                    "fileExtencion": datosContratacion.DocumentosTitular.comprobante.fileExtension,
                    "data": datosContratacion.DocumentosTitular.comprobante.data,
                },
            },
        };

        const body = JSON.stringify(attachBody);

        const headers = new Headers({
            "Content-Type": "application/json",
        });

        const response = await fetch("/api/contratacion/attachFile", {
            method: "POST",
            headers,
            body,
        });

        const data = await response.json();
        console.log('response getAttachFile:', data)
        if (!data) throw new Error("Invalid response from server");

        return data;

    } catch (err) {
        console.error("Error al generar AttachFile", err);
        throw err;
    }

}