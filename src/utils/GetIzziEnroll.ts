
const DUMMY_BODY = {
    "stepSavedProspect": "",
    "purchaseId": "",
    "requestedAddress": {
        "stringAddress": "03000|BENITO JUAREZ|PIEDAD NARVARTE|ANAXAGORAS|18",
        "addressReference": "SINREF",
        "postalCode": "03000",
        "addressId": "",
        "betweenStreets1": "SINCALLE",
        "betweenStreets2": "",
        "housingUnit": "NA",
        "billing": false,
        "billingPostalCode": "",
        "billingCity": "",
        "billingSettlement": "",
        "billingStreet": "",
        "billingExteriorNumber": "",
        "billingInteriorNumber": "",
        "billingState": "",
        "latitude": 19.403324553221257,
        "longitude": -99.15629669458158,
        "state": "JALISCO"
    },
    "personalDetails": {
        "nombre": "NOMBRE C",
        "segundoNombre": "SEGNOMBRE",
        "apPaterno": "JUAREZ",
        "apMaterno": "JUAREZ",
        "correo": "juanarodriguez@deloitte.com",
        "password": null,
        "numeroCelular": "5561111299",
        "numeroCelularAmericano": false,
        "numeroCelularWhatsapp": false,
        "numeroCelularAdicional": "",
        "numeroCelularAdicionalAmericano": false,
        "numeroCelularAdicionalTipo": null,
        "numeroCelularAdicionalWhatsapp": false,
        "codigoVerificacionCel": "9097",
        "portability": "",
        "rfc": "",
        "curp": "ALFF920524HMCNML06",
        "pasaporte": "",
        "razonSocial": "",
        "giroNegocio": "",
        "codigoCfdi": "",
        "regimenFiscal": ""
    },
    "ineInfo": {
        "curp": null,
        "fechaNacimiento": null,
        "sexo": null,
        "lineaUno": null,
        "lineaDos": null,
        "lineaTres": null,
        "imagenFrontal": "data:@file/jpeg;base64,/9j/4AAQSkZJRgABAQEAeA...",
        "imagenTrasera": "",
        "comprobanteDomicilio": "data:@file/jpeg;base64,/9j/4AAQSkZJRgABAQEAeAB4...",
        "comprobantePago": "",
        "referencia": "",
        "referencia2": null,
        "referencia3": null,
        "firma": "",
        "confirmacionCliente": ""
    },
    "salesChannel": "CC AI",
    "version": "",
    "prospect": false,
    "savedProspect": false,
    "acompletarIzziCombo": false,
    "prospectEditFlag": false,
    "dateProspectEditFlag": null,
    "offNetSky": false,
    "offNetIzzi": false,
    "banderaSp": false,
    "dateInstallationRequired": true,
    "isOnlineSale": false,
    "vendorInfo": {
        "vendedorMaster": false
    }
}

export async function GetIzziEnroll() {

    try {
        const body = JSON.stringify(DUMMY_BODY);
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
        console.log('response getIzziEnrroll:', data)
        if (!data) throw new Error("Invalid response from server");

        return data;

    } catch (err) {
        console.error("Error al generar IzziEnroll", err);
        throw err;
    }

}