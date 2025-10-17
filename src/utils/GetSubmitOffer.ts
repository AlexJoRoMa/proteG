
const DUMMY_BODY = {
    "requestedServices": {
        "product": 38008,
        "productName": "izzi80m_izzitvhd",
        "negocios": false,
        "termExemptionPrice": 1500,
        "extras": [
            {
                "extId": 28039,
                "nuevaCantidad": 1,
                "combo": true
            },
            {
                "extId": 28009,
                "extra": {
                    "title": "izzi móvil 5 12 meses"
                },
                "nuevaCantidad": 1,
                "combo": false,
                "tipoEntrega": "DOMICILIO",
                "sucursalId": "N/A",
                "portabilidadMovil": "Y",
                "imei": ""
            }
        ],
        "priceToPay": "810.0",
        "vel": 80
    },
    "salesChannel": "WEB",
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
        // if (!data) throw new Error("Invalid response from server");

        console.log('responseSubmitOffer:', data)
        return data;

    } catch (err) {
        console.error("Error al generar submitOffer", err);
        throw err;
    }


}