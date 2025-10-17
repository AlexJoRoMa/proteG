'use server'

import { getToken } from "./configurador";

interface SendCodeProps {
    body: Record<string, unknown>;
    headers: {
        medio: string;
        oferta: string;
        origin: string;
    }
}

interface EnrollProps {
    body: Record<string, unknown>;
    headers: {
        Cookie: string;
    }
}

interface ProcessStatusProps {
    headers: {
        processId: string
    }
}

interface SubmitOfferProps {
    body: Record<string, unknown>;
}

interface AttachFilesProps {
    body: Record<string, unknown>;
}

interface LigaPagoProps {
    body: Record<string, unknown>;
    headers: {
        origin: string,
        channel: string
    }
}

export async function getSendCode({
    body,
    headers,
}: SendCodeProps): Promise<any> {

    const url = process.env.ENVIO_CODIGO_PATH;

    try {
        console.log("ejecutando getSendCode...")

        const response = await fetch(`${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                medio: headers.medio,
                oferta: headers.oferta,
                origin: headers.origin,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error en getSendCode:", err);
        throw err;
    }
}

export async function getVerifyCode({
    body,
    headers,
}: SendCodeProps): Promise<any> {

    const url = process.env.VERIFICA_CODIGO_PATH;

    try {
        console.log("ejecutando getVerifyCode...")

        const response = await fetch(`${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                medio: headers.medio,
                oferta: headers.oferta,
                origin: headers.origin,
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("Error en getVerifyCode:", err);
        throw err;
    }
}

export async function getIzziEnroll({
    body,
    headers,
}: EnrollProps): Promise<any> {

    const url = process.env.IZZI_ENRROLL_PATH;
    const accessToken = await getToken();

    try {
        console.log('Ejecutando IzziEnroll...');

        const response = await fetch(`${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                Cookie: headers.Cookie,
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.text();
        console.log('response izziEnrroll:', data)
        return data;

    } catch (err) {
        console.error("Error en getIzziEnroll:", err);
        throw err;
    }
}

export async function GetProcessStatus({
    headers,
}: ProcessStatusProps) {

    const url = process.env.PROCESS_STATUS_PATH;
    const accessToken = await getToken();


    try {
        console.log('Ejecutando processStatus...');

        const response = await fetch(`${url}?processId=${headers.processId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('response processStatus:', data)
        return data;

    } catch (err) {
        console.error("Error en getProcessStatus:", err);
        throw new Error('Error en getProcessStatus')
    }

}

export async function getSubmitOffer({
    body,
}: SubmitOfferProps) {

    const url = process.env.SUBMIT_OFFER_PATH;
    const accessToken = await getToken();

    try {
        console.log('Ejecutando processStatus...');

        const response = await fetch(`${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body)
        });

        // if (!response.ok) {
        //     throw new Error(`Error HTTP ${response.status}`);
        // }

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        console.log('response submitOffer:', data)
        return data;

    } catch (err) {
        console.error("Error en getsubmitOffer:", err);
        throw err;
    }

}

export async function getAttachFiles({
    body,
}: AttachFilesProps): Promise<any> {

    const url = process.env.ATTACH_FILES_PATH;
    const accessToken = await getToken();

    try {
        console.log('Ejecutando AttachFiles...');

        const response = await fetch(`${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        console.log('response AttachFiles:', data)
        return data;

    } catch (err) {
        console.error("Error en getAttachFiles:", err);
        throw err;
    }
}

export async function getLigaPago({
    headers,
    body
}: LigaPagoProps): Promise<any> {

    const url = "https://qaizzi.izzi.mx/WSVeL/webservices/izzi/envio_liga_pago"

    try {
        console.log('Ejecutando ligaPago...');

        const response = await fetch(`https://qaizzi.izzi.mx/WSVeL/webservices/izzi/envio_liga_pago`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-origin": headers.origin,
                "x-access-channel": headers.channel,
                "Authorization": "null",
            },
            body: JSON.stringify(body)
        });

        // if (!response.ok) {
        //     throw new Error(`Error HTTP ${response.status}`);
        // }

        const data = await response.json();
        console.log('response ligaPago:', data)
        return data;

    } catch (err) {
        console.error("Error en getLigaPago:", err);
        throw err;
    }

}