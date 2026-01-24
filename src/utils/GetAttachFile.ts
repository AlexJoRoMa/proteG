import { ProcessStatus } from "@/types/Contratacion";

export async function GetAttachFile(processStatus: Partial<ProcessStatus>, attachInfo: { fileName: string; fileExtension: string; data: string; } | undefined) {


    try {
        const attachBody = {
            "accountNumber": processStatus.accountNumber,
            "accountId": processStatus.accountId,
            "file": {
                "fileName": attachInfo?.fileName,
                "fileExtension": attachInfo?.fileExtension,
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

        return data;

    } catch (err) {
        console.error("Error al generar AttachFile", err);
        throw err;
    }

}