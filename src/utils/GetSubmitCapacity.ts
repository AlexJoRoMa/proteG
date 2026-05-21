import { DatosContratacion } from "@/types/Contratacion";
import { RefObject } from "react";

const SUBMIT_CAPACITY_TIMEOUT_MS = 30000;

export async function GetSubmitCapacity(processId: string, datosContratacion: RefObject<Partial<DatosContratacion> | null>, isRecurrent: boolean, globalFlagDomicilio: boolean) {

    function getPaymentReference() {
        if (datosContratacion.current?.Pago?.metodoPago === "creditCard") {
            if (isRecurrent) {
                return "ONLINE_SAVED";
            } else {
                return "ONLINE";
            }
        } else if (datosContratacion.current?.Pago?.metodoPago === "paypal") {
            return "PAYPAL";
        } else {
            return "IZZI_CHANNELS";
        }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SUBMIT_CAPACITY_TIMEOUT_MS);

    try {
        const headers = new Headers({
            "Content-Type": "application/json",
        });

        const paymentReference = getPaymentReference();

        const body = JSON.stringify({
            "processId": processId,
            "schedule": globalFlagDomicilio ?
                {
                    "cvTimeslot": "",
                    "requestedShipDate": "",
                } :
                {
                    "cvTimeslot": datosContratacion.current?.Instalacion?.cvTimeslot,
                    "requestedShipDate": datosContratacion.current?.Instalacion?.requestedShipDate,
                },
            "paymentType": paymentReference,
            "installationComments": "MARCAR 10 MINUTOS ANTES DE LLEGAR",
            "installationExpress": false,
            "termExemption": false
        });

        const response = await fetch("/api/contratacion/submitCapacity", {
            method: "POST",
            headers,
            body,
            signal: controller.signal,
        });

        const data = await response.json();
        if (!data) throw new Error("Invalid response from server");

        return data;

    } catch (err) {
        const isAbort = (err as { name?: string })?.name === "AbortError";
        console.error(`Error al generar GetSubmitCapacity${isAbort ? " (timeout)" : ""}`, err);
        throw err;
    } finally {
        clearTimeout(timeoutId);
    }

}