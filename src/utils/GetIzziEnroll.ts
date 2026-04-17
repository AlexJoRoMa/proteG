import { CoberturaType, IzziSelection } from "@/types/ConfiguradorTypes";
import { DatosContratacion } from "@/types/Contratacion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IzziEnrollResponse = any;

interface StreamEvent {
    type: "heartbeat" | "result" | "error";
    timestamp?: number;
    data?: IzziEnrollResponse;
    error?: string;
}

// Función para leer el stream SSE y obtener el resultado
async function readStreamResponse(response: Response): Promise<IzziEnrollResponse> {
    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error("No se pudo leer la respuesta del servidor");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
            throw new Error("Stream cerrado sin resultado");
        }

        buffer += decoder.decode(value, { stream: true });
        

        const lines = buffer.split("\n\n");
        buffer = lines.pop() || ""; 

        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6); // Remover "data: "
                try {
                    const event: StreamEvent = JSON.parse(jsonStr);
                    
                    if (event.type === "heartbeat") {
                        console.log(`[Stream] Heartbeat recibido - ${new Date(event.timestamp || 0).toLocaleTimeString()}`);
                        continue;
                    }
                    
                    if (event.type === "error") {
                        console.error(`[Stream] Error:`, event.error);
                        throw new Error(event.error || "Error en el proceso de enroll");
                    }
                    
                    if (event.type === "result") {
                        console.log(`[Stream] ✅ Resultado recibido`);
                        return event.data;
                    }
                } catch (parseError) {
                    console.warn("[Stream] Error parseando evento:", parseError);
                }
            }
        }
    }
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
            "x-upstream-cookie": "AWSALB=o1egXIGzDYyhgR/f3AClAKhYZWoK1aA21e+OlktWTOHChR5M/lVVVy1oNUm/hl4IBQpKEMtgeZ1zL4cUtmycbYyMyR/3DilCbHdr+QuZJF0oTQCZdCnLzp859mfr; AWSALBCORS=o1egXIGzDYyhgR/f3AClAKhYZWoK1aA21e+OlktWTOHChR5M/lVVVy1oNUm/hl4IBQpKEMtgeZ1zL4cUtmycbYyMyR/3DilCbHdr+QuZJF0oTQCZdCnLzp859mfr",
        });

        console.log('getIzziEnroll BODY ', body)
        console.log('getIzziEnroll headers ', headers)

        console.log("[IzziEnroll] Iniciando conexión con streaming...");

        // Usar endpoint de streaming con SSE
        const response = await fetch("/api/contratacion/izziEnroll/stream", {
            method: "POST",
            headers,
            body,
        });
console.log('getIzziEnroll fetch stream ', response)
        if (!response.ok) {
            throw new Error(`Error al conectar con el servidor: ${response.status}`);
        }

        // Leer el stream y esperar el resultado
        const result = await readStreamResponse(response);
console.log('getIzziEnroll read stream response ', result)
        if (!result) throw new Error("Invalid response from server");

        return result;

    } catch (err) {
        console.error("Error al generar IzziEnroll", err);
        throw err;
    }

}
