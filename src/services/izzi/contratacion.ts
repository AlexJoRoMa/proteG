/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { AttachFilesServiceProps, EnrollProps, GetCapacityProps, LigaPagoProps, ProcessStatusProps, SendCodeProps, SubmitCapacityProps, SubmitOfferProps, VerificaPago } from "@/types/Contratacion";
import { getToken } from "./configurador";

export async function getSendCode({
    body,
    headers,
}: SendCodeProps): Promise<any> {

    const url = process.env.ENVIO_CODIGO_PATH;

    try {

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
    const apiKey = process.env.IZZI_API_KEY;

    try {

        const response = await fetch(`${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                ...(apiKey ? { "x-api-key": apiKey } : {}),
                Cookie: headers.Cookie,
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.text();
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

        const response = await fetch(`${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body)
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        return data;

    } catch (err) {
        console.error("Error en getsubmitOffer:", err);
        throw err;
    }

}

export async function getAttachFiles({
    body,
}: AttachFilesServiceProps): Promise<any> {

    const url = process.env.ATTACH_FILES_PATH;
    const accessToken = await getToken();

    try {

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

        const data = await response.json();
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
        return data;

    } catch (err) {
        console.error("Error en getSubmitCapacity:", err);
        throw err;
    }
}