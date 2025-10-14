import { useEffect } from "react";

const DUMMY_BODY =
{
    "processId": "e8f40412-a86e-11f0-be4c-026ec2a830dd",
    "requestedServices": {
        "product": 38054,
        "productName": null,
        "negocios": false,
        "termExemptionPrice": 1000,
        "extras": [
            {
                "extId": 38051,
                "nuevaCantidad": 1,
                "combo": true
            }
        ],
        "priceToPay": 1250.0,
        "vel": 0,
        "priceToPayMovil": 0.0
    },
    "salesChanel": "WEB",
    "offNetSky": false,
    "offNetIzzi": false
}

export async function GetSubmitOffer(processId: string) {

    try {
        const body = JSON.stringify({
            ...DUMMY_BODY,
            processId
        });
        const headers = new Headers({
            "Content-Type": "application/json",
        });

        const response = await fetch("/api/contratacion/submitOffer", {
            method: "POST",
            headers,
            body,
        });

        const data = await response.json();
        if (!data) throw new Error("Invalid response from server");

        console.log('responseSubmitOffer:', data)
        return data;

    } catch (err) {
        console.error("Error al generar submitOffer", err);
        throw err;
    }


}