import { CoberturaType } from "@/types/ConfiguradorTypes";
import { DatosContratacion } from "@/types/Contratacion";

export async function GetIzziEnroll(coberturaData: CoberturaType, datosContratacion: Partial<DatosContratacion>, offNetIzzi: boolean, offNetSky: boolean) {

    const BODY = {
        "stepSavedProspect": "",
        "purchaseId": "",
        "requestedAddress": {
            "stringAddress": `${coberturaData.zipCode}|${coberturaData.municipio}|${coberturaData.colonia}|${coberturaData.calle}|${coberturaData.numExt}`,
            "addressReference": datosContratacion.DatosPersonales?.instalacion.reference,
            "postalCode": `${coberturaData.zipCode}`,
            "addressId": "NA",
            "betweenStreets1": datosContratacion.DatosPersonales?.instalacion.street,
            "betweenStreets2": "",
            "housingUnit": "NA",
            "billing": datosContratacion.DatosPersonales?.meta.necesitaFacturar,
            "billingPostalCode": datosContratacion.DatosPersonales?.direccionFacturacion.postalCode,
            "billingCity": datosContratacion.DatosPersonales?.direccionFacturacion.city,
            "billingSettlement": "",
            "billingStreet": datosContratacion.DatosPersonales?.direccionFacturacion.address,
            "billingExteriorNumber": datosContratacion.DatosPersonales?.direccionFacturacion.exteriorNumber,
            "billingInteriorNumber": datosContratacion.DatosPersonales?.direccionFacturacion.interiorNumber,
            "billingState": datosContratacion.DatosPersonales?.direccionFacturacion.state,
            "latitude": coberturaData.lat,
            "longitude": coberturaData.lng,
            "state": coberturaData.estado,
        },
        "personalDetails": {
            "nombre": datosContratacion.DatosPersonales?.personal.firstName,
            "segundoNombre": datosContratacion.DatosPersonales?.personal.secondName,
            "apPaterno": datosContratacion.DatosPersonales?.personal.firstLastName,
            "apMaterno": datosContratacion.DatosPersonales?.personal.secondLastName,
            "correo": datosContratacion.DatosPersonales?.personal.email,
            "password": null,
            "numeroCelular": `${datosContratacion.DatosPersonales?.personal.phone}`,
            "numeroCelularAmericano": false,
            "numeroCelularWhatsapp": false,
            "numeroCelularAdicional": datosContratacion.DatosPersonales?.personal.aditionalTel,
            "numeroCelularAdicionalAmericano": false,
            "numeroCelularAdicionalTipo": null,
            "numeroCelularAdicionalWhatsapp": false,
            "codigoVerificacionCel": "9097",
            "portability": "NA",
            "rfc": datosContratacion.DatosPersonales?.facturacion.rfc,
            "curp": datosContratacion.DatosPersonales?.personal.curp,
            "pasaporte": datosContratacion.DatosPersonales?.personal.passport,
            "razonSocial": "",
            "giroNegocio": "NA",
            "codigoCfdi": datosContratacion.DatosPersonales?.facturacion.comprobanteFiscal,
            "regimenFiscal": datosContratacion.DatosPersonales?.facturacion.regimenFiscal
        },
        "ineInfo": {
            "curp": null,
            "fechaNacimiento": null,
            "sexo": null,
            "lineaUno": null,
            "lineaDos": null,
            "lineaTres": null,
            "imagenFrontal": "",
            "imagenTrasera": "",
            "comprobanteDomicilio": "",
            "comprobantePago": "",
            "referencia": "",
            "referencia2": null,
            "referencia3": null,
            "firma": "",
            "confirmacionCliente": ""
        },
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