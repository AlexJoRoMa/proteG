import { DatosContratacion } from "@/types/Contratacion";
import { RefObject } from "react";

export async function GetSubmitCapacity(processId: string, datosContratacion: RefObject<Partial<DatosContratacion> | null>, cardRecurrent: boolean, globalFlagDomicilio: boolean) {

    function getPaymentReference() {
        if (datosContratacion.current?.Pago?.metodoPago === "creditCard") {
            if (cardRecurrent) {
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
        });

        const data = await response.json();
        if (!data) throw new Error("Invalid response from server");

        return data;

    } catch (err) {
        console.error("Error al generar GetSubmitCapacity", err);
        throw err;
    }

}