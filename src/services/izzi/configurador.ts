import { CoberturaType, PackageInfo, QuoteInfo } from "@/types/ConfiguradorTypes";
import { redirect } from "next/navigation";

export async function getToken() {
    try {
        const response = await fetch(
            "https://test.izziapiweb.mx/modifyservices/purchase/oauth2/token",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "aplication/json"
                },
                body: JSON.stringify({
                    client_id: "izzi_core",
                    client_secret: "izzi_core",
                    grant_type: "password",
                    provision_key: "Uo7sIy4g2IKxFwYGKQYBYTr2HPSisIk4",
                    authenticated_userid: "izzi_core",
                    scope: "write"
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // console.log('response', data);
        return data.access_token;

    } catch (error) {
        console.error("Error al obtener el Access Token", error)
        throw new Error("Error al obtener el Access Token");
    }
}


export async function getOfertas(dataCobertura: CoberturaType) {

    try {

        if ( !dataCobertura.zipCode || !dataCobertura.lat || !dataCobertura.lng ) {
            console.error("Datos de cobertura inválidos:", dataCobertura);
            redirect("/error");
        }

        const accessToken = await getToken();

        if (!accessToken) {
            console.error("No se pudo obtener el accessToken");
            redirect("/error");
        }

        const response = await fetch(
            "https://test.izziapiweb.mx/izzi/ms/purchaseServices/sales/offersByType",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    "postalCode": dataCobertura.zipCode,
                    "latitude": Number(dataCobertura.lat),
                    "longitude": Number(dataCobertura.lng),
                    "negocios": false,
                    "sky": false
                }),
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('response', data);
        return data;

    } catch (error) {
        console.error("Error al obtener las ofertas", error)
        throw new Error("Error al obtener las ofertas");
    }
}

export async function getQuote(body: QuoteInfo) {

    try {

        const accessToken = await getToken();

        if (!accessToken) {
            console.error("No se pudo obtener el accessToken");
            redirect("/error");
        }

        const response = await fetch(
            "https://test.izziapiweb.mx/test/izzi/ms/purchaseServices/purchase/v2/quote",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    "rpt": body.rpt,
                    "hub": body.hub, 
                    "coverageType": body.coverageType,
                    "postalCode": body.postalCode,
                    "offnet": body.offnet, // depende de offnetIzzi y offnetSky 
                    "requestedServices": body.requestedServices,
                }),
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('response', data);
        return data;

    } catch (error) {
        console.error("Error al obtener las ofertas", error)
        throw new Error("Error al obtener las ofertas");
    }
}

export async function getPackageInfo(paqueteInfo: PackageInfo) {

    const accessToken = await getToken();

    const response = await fetch(
        "https://test.izziapiweb.mx/izzi/ms/purchaseServices/sales/packageInfo",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "idPaquete": paqueteInfo.id,
                "rpt": paqueteInfo.rpt,
                "coverageType": paqueteInfo.coverage,
            }),
        }
    );

    if (!response.ok) {
        return new Response(JSON.stringify({ error: 'API fetch error' }), { status: 500 })
    }

    const data = await response.json();
    return data;

}
