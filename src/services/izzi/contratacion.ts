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

interface GetCapacityProps {
    headers: {
        processId: string;
    }
}

interface LigaPagoProps {
    body: Record<string, unknown>;
    headers: {
        origin: string,
        channel: string
    }
}

interface VerificaPago {
    body: Record<string, unknown>;
    headers: {
        origin: string,
        channel: string
    }
}

interface SubmitCapacityProps {
    body: Record<string, unknown>;
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

export async function getCapacity({
    headers,
}: GetCapacityProps): Promise<any> {

    const url = process.env.GET_CAPACITY_PATH;
    const accessToken = await getToken();

    try {
        console.log('Ejecutando GetCapacity...');

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
        console.log('response getCapacity:', data)
        return data;

    } catch (err) {
        console.error("Error en getCapacity:", err);
        throw err;
    }
}

export async function getLigaPago({
    headers,
    body
}: LigaPagoProps): Promise<any> {

    const url = process.env.GET_LIGA_PAGO;

    try {
        console.log('Ejecutando ligaPago...');

        const response = await fetch(`${url}`, {
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

export async function getVerificaPago({
    body,
    headers
}: VerificaPago): Promise<any> {

    const url = process.env.VERIFICA_PAGO_PATH;
    const Authorization = process.env.AUTHORIZATION_KEY;

    try {
        console.log('Ejecutando VerificaPago...');

        const response = await fetch(`${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${Authorization}`,
                "x-access-origin": headers.origin,
                "x-access-channel": headers.channel,
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('response VerificaPago:', data)
        return data;

    } catch (err) {
        console.error("Error en VerificaPago:", err);
        throw err;
    }
}

export async function getSubmitCapacity({
    body,
}: SubmitCapacityProps): Promise<any> {

    const url = process.env.SUBMIT_CAPACITY;
    const accessToken = await getToken();

    try {
        console.log('Ejecutando SubmitCapacity...');

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

        const data = await response.json();
        console.log('response SubmitCapacity:', data)
        return data;

    } catch (err) {
        console.error("Error en getSubmitCapacity:", err);
        throw err;
    }
}