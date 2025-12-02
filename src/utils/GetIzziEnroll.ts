import { CoberturaType } from "@/types/ConfiguradorTypes";
import { DatosContratacion } from "@/types/Contratacion";
import { RefObject } from "react";

export async function GetIzziEnroll(coberturaData: CoberturaType, datosContratacion: RefObject<Partial<DatosContratacion> | null>, offNetIzzi: boolean, offNetSky: boolean) {

    const BODY = {
        "stepSavedProspect": "",
        "purchaseId": "",
        "requestedAddress": {
            "stringAddress": `${coberturaData.zipCode}|${coberturaData.municipio}|${coberturaData.colonia}|${coberturaData.calle}|${coberturaData.numExt}`,
            "addressReference": datosContratacion.current?.DatosPersonales?.instalacion?.reference ? datosContratacion.current?.DatosPersonales?.instalacion.reference : "SINREF",
            "postalCode": coberturaData.zipCode,
            "addressId": "",
            "betweenStreets1": datosContratacion.current?.DatosPersonales?.instalacion?.street ? datosContratacion.current?.DatosPersonales?.instalacion.street : "SINCALLE",
            "betweenStreets2": "",
            "housingUnit": "NA",
            "billing": datosContratacion.current?.DatosPersonales?.meta.necesitaFacturar,
            "billingPostalCode": datosContratacion.current?.DatosPersonales?.direccionFacturacion?.postalCode ?? null,
            "billingCity": datosContratacion.current?.DatosPersonales?.direccionFacturacion?.city ?? null,
            "billingSettlement": datosContratacion.current?.DatosPersonales?.direccionFacturacion?.colony ?? null,
            "billingStreet": datosContratacion.current?.DatosPersonales?.direccionFacturacion?.address ?? null,
            "billingExteriorNumber": datosContratacion.current?.DatosPersonales?.direccionFacturacion?.exteriorNumber ?? null,
            "billingInteriorNumber": datosContratacion.current?.DatosPersonales?.direccionFacturacion?.interiorNumber ?? null,
            "billingState": datosContratacion.current?.DatosPersonales?.direccionFacturacion?.state ?? null,
            "latitude": coberturaData.lat,
            "longitude": coberturaData.lng,
            "state": coberturaData.estado,
        },
        "personalDetails": {
            "nombre": datosContratacion.current?.DatosPersonales?.personal.firstName,
            "segundoNombre": datosContratacion.current?.DatosPersonales?.personal.secondName,
            "apPaterno": datosContratacion.current?.DatosPersonales?.personal.firstLastName,
            "apMaterno": datosContratacion.current?.DatosPersonales?.personal.secondLastName,
            "correo": datosContratacion.current?.DatosPersonales?.personal.email,
            "password": null,
            "numeroCelular": String(datosContratacion.current?.DatosPersonales?.personal.phone),
            "numeroCelularAmericano": false,
            "numeroCelularWhatsapp": false,
            "numeroCelularAdicional": datosContratacion.current?.DatosPersonales?.personal.aditionalTel,
            "numeroCelularAdicionalAmericano": false,
            "numeroCelularAdicionalTipo": null,
            "numeroCelularAdicionalWhatsapp": false,
            "codigoVerificacionCel": datosContratacion.current?.VerificacionContacto?.codigoVerificacion !== undefined ? String(datosContratacion.current?.VerificacionContacto?.codigoVerificacion) : "",
            "portability": "",
            "rfc": datosContratacion.current?.DatosPersonales?.facturacion?.rfc ?? "",
            "curp": datosContratacion.current?.DatosPersonales?.personal.curp,
            "pasaporte": datosContratacion.current?.DatosPersonales?.personal.passport,
            "razonSocial": "",
            "giroNegocio": "",
            "codigoCfdi": datosContratacion.current?.DatosPersonales?.facturacion?.comprobanteFiscal ?? "",
            "regimenFiscal": datosContratacion.current?.DatosPersonales?.facturacion?.regimenFiscal ?? ""
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

        const response = await fetch("/api/contratacion/izziEnroll", {
            method: "POST",
            headers,
            body,
        });

        const data = await response.json();
        if (!data) throw new Error("Invalid response from server");

        return data;

    } catch (err) {
        console.error("Error al generar IzziEnroll", err);
        throw err;
    }

}