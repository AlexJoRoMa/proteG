import { DatosContratacion } from "@/types/Contratacion";
import { RefObject } from "react";

export async function GetSubmitCapacity(processId: string, datosContratacion: RefObject<Partial<DatosContratacion> | null>) {

    try {
        const headers = new Headers({
            "Content-Type": "application/json",
        });

        const body = JSON.stringify({
            "processId": processId,
            "schedule": {
                "cvTimeslot": datosContratacion.current?.Instalacion?.cvTimeslot,
                "requestedShipDate": datosContratacion.current?.Instalacion?.requestedShipDate,
            },
            "paymentType": "ONLINE",
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