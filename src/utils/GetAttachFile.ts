import { ProcessStatus } from "@/types/Contratacion";

export async function GetAttachFile(processStatus: Partial<ProcessStatus>, attachInfo: { fileName: string; fileExtension: string; data: string; } | undefined) {


    try {
        console.log("datosTitular", attachInfo)
        const attachBody = {
            "accountNumber": processStatus.accountNumber,
            "accountId": processStatus.accountId,
            "file": {
                "fileName": attachInfo?.fileName,
                "fileExtencion": attachInfo?.fileExtension,
                "data": attachInfo?.data,
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
        // if (data.status !== 200) throw new Error("Invalid response from server");

        return data;

    } catch (err) {
        console.error("Error al generar AttachFile", err);
        throw err;
    }

}