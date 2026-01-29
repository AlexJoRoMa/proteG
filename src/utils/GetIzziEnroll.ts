import { CoberturaType, IzziSelection } from "@/types/ConfiguradorTypes";
import { DatosContratacion } from "@/types/Contratacion";

const POLLING_INTERVAL = 5000; // 5 segundos entre cada check
const MAX_POLLING_TIME = 5 * 60 * 1000; // Máximo 5 minutos de polling

type JobStatus = "queued" | "running" | "done" | "failed";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IzziEnrollResponse = any;

interface StatusResponse {
    jobId: string;
    status: JobStatus;
    error?: string;
}

interface ResultResponse {
    jobId: string;
    result: IzziEnrollResponse;
    error?: string;
}

// Función auxiliar para esperar
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función de polling para verificar el estado del job
async function pollForResult(jobId: string, startTime: number): Promise<IzziEnrollResponse> {
    // Verificar si excedimos el tiempo máximo de polling
    if (Date.now() - startTime > MAX_POLLING_TIME) {
        throw new Error("Timeout: el proceso de enroll tardó demasiado");
    }

    // Verificar el status
    const statusResponse = await fetch(`/api/contratacion/izziEnroll/status?jobId=${jobId}`);
    const statusData: StatusResponse = await statusResponse.json();

    if (statusData.status === "failed") {
        console.error(`[Polling] Job ${jobId} - FAILED:`, statusData.error);
        throw new Error(statusData.error || "Error en el proceso de enroll");
    }

    if (statusData.status === "done") {
        // Obtener el resultado
        const resultResponse = await fetch(`/api/contratacion/izziEnroll/result?jobId=${jobId}`);
        const resultData: ResultResponse = await resultResponse.json();

        if (!resultResponse.ok) {
            console.error(`[Polling] Job ${jobId} - Error al obtener resultado:`, resultData.error);
            throw new Error(resultData.error || "Error al obtener resultado");
        }

        return resultData.result;
    }

    // Si todavía está queued o running, esperar y reintentar
    await delay(POLLING_INTERVAL);
    return pollForResult(jobId, startTime);
}

export async function GetIzziEnroll(coberturaData: CoberturaType, datosContratacion: Partial<DatosContratacion>, offNetIzzi: boolean, offNetSky: boolean, globalIzziSelection: IzziSelection | null): Promise<IzziEnrollResponse> {

    const BODY = {
        "stepSavedProspect": "",
        "purchaseId": "",
        "requestedAddress": {
            "stringAddress": `${coberturaData.zipCode}|${coberturaData.municipio}|${coberturaData.colonia}|${coberturaData.calle}|${coberturaData.numExt}`,
            "addressReference": datosContratacion?.DatosPersonales?.instalacion?.reference ? datosContratacion?.DatosPersonales?.instalacion.reference : "SINREF",
            "postalCode": coberturaData.zipCode,
            "addressId": "",
            "betweenStreets1": datosContratacion?.DatosPersonales?.instalacion?.street ? datosContratacion?.DatosPersonales?.instalacion.street : "SINCALLE",
            "betweenStreets2": datosContratacion?.DatosPersonales?.instalacion?.street2 ? datosContratacion?.DatosPersonales?.instalacion.street2 : "SINCALLE",
            "housingUnit": "NA",
            "billing": datosContratacion?.DatosPersonales?.meta.necesitaFacturar,
            "billingPostalCode": datosContratacion?.DatosPersonales?.direccionFacturacion?.postalCode ?? null,
            "billingCity": datosContratacion?.DatosPersonales?.direccionFacturacion?.city ?? null,
            "billingSettlement": datosContratacion?.DatosPersonales?.direccionFacturacion?.colony ?? null,
            "billingStreet": datosContratacion?.DatosPersonales?.direccionFacturacion?.address ?? null,
            "billingExteriorNumber": datosContratacion?.DatosPersonales?.direccionFacturacion?.exteriorNumber ?? null,
            "billingInteriorNumber": datosContratacion?.DatosPersonales?.direccionFacturacion?.interiorNumber ?? null,
            "billingState": datosContratacion?.DatosPersonales?.direccionFacturacion?.state ?? null,
            "latitude": coberturaData.lat,
            "longitude": coberturaData.lng,
            "state": coberturaData.estado,
        },
        "personalDetails": {
            "nombre": datosContratacion?.DatosPersonales?.personal.firstName,
            "segundoNombre": datosContratacion?.DatosPersonales?.personal.secondName,
            "apPaterno": datosContratacion?.DatosPersonales?.personal.firstLastName,
            "apMaterno": datosContratacion?.DatosPersonales?.personal.secondLastName,
            "correo": datosContratacion?.DatosPersonales?.personal.email,
            "password": null,
            "numeroCelular": String(datosContratacion?.DatosPersonales?.personal.phone),
            "numeroCelularAmericano": false,
            "numeroCelularWhatsapp": false,
            "numeroCelularAdicional": datosContratacion?.DatosPersonales?.personal.aditionalTel,
            "numeroCelularAdicionalAmericano": false,
            "numeroCelularAdicionalTipo": null,
            "numeroCelularAdicionalWhatsapp": false,
            "codigoVerificacionCel": String(datosContratacion.VerificacionContacto?.codigoVerificacion ?? ""),
            "portability": "",
            "rfc": datosContratacion?.DatosPersonales?.facturacion?.rfc ?? "",
            "curp": datosContratacion?.DatosPersonales?.personal.curp,
            "pasaporte": datosContratacion?.DatosPersonales?.personal.passport,
            "razonSocial": "",
            "giroNegocio": "",
            "codigoCfdi": datosContratacion?.DatosPersonales?.facturacion?.comprobanteFiscal ?? "",
            "regimenFiscal": datosContratacion?.DatosPersonales?.facturacion?.regimenFiscal ?? ""
        },
        "ineInfo": {},
        "salesChannel": "WEB",
        "version": "NA",
        "prospect": false,
        "savedProspect": false,
        "acompletarIzziCombo": false,
        "prospectEditFlag": false,
        "dateProspectEditFlag": null,
        "offNetSky": offNetSky,
        "offNetIzzi": offNetIzzi,
        "autoInstalacion": globalIzziSelection?.autoinstalacion,
        "autoInstallOrder": globalIzziSelection?.autoinstalacion ? {
            "autoInstalacion": true,
            "tipoEntrega": "DOMICILIO",
        } : null,
        "banderaSp": false,
        "dateInstallationRequired": true,
        "isOnlineSale": false,
        "vendorInfo": {
            "vendedorMaster": false
        }
    }

    try {
        const body = JSON.stringify(BODY);
        const headers = new Headers({
            "Content-Type": "application/json",
            "x-Cookie": "AWSALB=o1egXIGzDYyhgR/f3AClAKhYZWoK1aA21e+OlktWTOHChR5M/lVVVy1oNUm/hl4IBQpKEMtgeZ1zL4cUtmycbYyMyR/3DilCbHdr+QuZJF0oTQCZdCnLzp859mfr; AWSALBCORS=o1egXIGzDYyhgR/f3AClAKhYZWoK1aA21e+OlktWTOHChR5M/lVVVy1oNUm/hl4IBQpKEMtgeZ1zL4cUtmycbYyMyR/3DilCbHdr+QuZJF0oTQCZdCnLzp859mfr",
        });

        // 1. Iniciar el job async
        const startResponse = await fetch("/api/contratacion/izziEnroll/start", {
            method: "POST",
            headers,
            body,
        });

        if (!startResponse.ok) {
            throw new Error("Error al iniciar el proceso de enroll");
        }

        const { jobId } = await startResponse.json();

        if (!jobId) {
            throw new Error("No se recibió jobId del servidor");
        }

        // 2. Hacer polling hasta obtener el resultado
        const result = await pollForResult(jobId, Date.now());

        if (!result) throw new Error("Invalid response from server");

        return result;

    } catch (err) {
        console.error("Error al generar IzziEnroll", err);
        throw err;
    }

}