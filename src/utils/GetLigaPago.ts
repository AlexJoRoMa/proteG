const DUMMY_BODY = {
    "cuenta": "43399384",
    "monto": "970.0",
    "canal": "CHANNEL_IZZI_VL",
    "correo": "juanarodriguez@deloitte.com",
    "exencion": false,
    "paypal": false,
    "telefono": "7772085039",
    "plataforma": "PLATFORM_IZZI_VL",
    "rpt": "460",
    "usuario": "CVVENSINCOMISION",
    "order": "1-194529080532",
    "oferta": "IZZI",
    "vl": true
}

export async function GetLigaPago() {
    try {
        const body = JSON.stringify(DUMMY_BODY);
        const headers = new Headers({
            "x-access-origin": "IZZI",
            "x-access-channel": "PORTALVL",
        })
        const res = await fetch(`/api/contratacion/pagoTarjeta`, {
            method: 'POST',
            headers,
            body
        }
        );
        const data = await res.json();

        // if (!data.ok) throw new Error(`Error HTTP ${data.status}`);

        console.log("Response pago con tarjeta:", data);
        return data;

    } catch (err) {
        console.error("Error al generar Liga de Pago", err);
        throw err;
    }

}