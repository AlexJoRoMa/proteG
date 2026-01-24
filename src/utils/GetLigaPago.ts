import { DatosContratacion, ProcessStatus } from "@/types/Contratacion";

export async function GetLigaPago(rpt: string, precioTotal: number, processStatus: Partial<ProcessStatus>, datosContratacion: Partial<DatosContratacion>, offNetSky: boolean) {
    try {
        const DUMMY_BODY = {
            "cuenta": String(processStatus.accountNumber),
            "monto": String(precioTotal),
            "canal": "CHANNEL_IZZI_VL",
            "correo": String(datosContratacion.DatosPersonales?.personal.email),
            "exencion": false,
            "paypal": false,
            "telefono": String(datosContratacion.DatosPersonales?.personal.phone),
            "plataforma": "PLATFORM_IZZI_VL",
            "rpt": rpt,
            "usuario": "CVVENSINCOMISION",
            "order": String(processStatus.orderNumber),
            "oferta": offNetSky ? "SKY" : "IZZI",
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

        return data;

    } catch (err) {
        console.error("Error al generar Liga de Pago", err);
        throw err;
    }

}