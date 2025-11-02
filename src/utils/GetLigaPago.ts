import { DatosContratacion, ProcessStatus } from "@/types/Contratacion";

export async function GetLigaPago(rpt: string, precioTotal: number, processStatus: Partial<ProcessStatus>, datosContratacion: Partial<DatosContratacion>) {
    try {
        const DUMMY_BODY = {
            "cuenta": `${processStatus.accountNumber}`,
            "monto": `${precioTotal}`,
            "canal": "CHANNEL_IZZI_VL",
            "correo": `${datosContratacion.DatosPersonales?.personal.email}`,
            "exencion": false,
            "paypal": false,
            "telefono": `${datosContratacion.DatosPersonales?.personal.phone}`,
            "plataforma": "PLATFORM_IZZI_VL",
            "rpt": `${rpt}`,
            "usuario": "CVVENSINCOMISION",
            "order": `${processStatus.orderNumber}`,
            "oferta": "IZZI",
            "vl": true
        }

        const body = JSON.stringify(DUMMY_BODY);
        const origin = process.env.ACCESS_ORIGIN;
        const channel = process.env.ACCESS_CHANNEL;

        const headers = new Headers({
            "x-access-origin": `${origin}`,
            "x-access-channel": `${channel}`,
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