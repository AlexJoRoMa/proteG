'use server'
import { CoberturaType, PackageInfo, QuoteInfo } from "@/types/ConfiguradorTypes";
import { redirect } from "next/navigation";

export async function getToken() {

    const url = process.env.GET_TOKEN;
    try {
        const response = await fetch(`${url}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "aplication/json"
                },
                body: JSON.stringify({
                    client_id: "izzi_core",
                    client_secret: "izzi_core",
                    grant_type: "password",
                    provision_key: process.env.PROVISION_KEY,
                    authenticated_userid: "izzi_core",
                    scope: "write"
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token;

    } catch (error) {
        console.error("Error al obtener el Access Token", error)
        throw new Error("Error al obtener el Access Token");
    }
}


export async function getOfertas(dataCobertura: CoberturaType) {

    const url = process.env.GET_OFERTAS;

    
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

        const response = await fetch(`${url}`, {
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

                
        if (!response.ok && response.status !== 409) {
            throw new Error(`Error enX la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error al obtenerY las ofertas", error)
        throw new Error("Error al obtenerZ las ofertas");
    }
}

export async function getQuote(body: QuoteInfo) {

    const url = process.env.GET_QUOTE;

    try {

        const accessToken = await getToken();

        if (!accessToken) {
            console.error("No se pudo obtener el accessToken");
            redirect("/error");
        }

        const response = await fetch(`${url}`, {
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
        return data;

    } catch (error) {
        console.error("Error al obtener las ofertas", error)
        throw new Error("Error al obtener las ofertas");
    }
}

export async function getPackageInfo(paqueteInfo: PackageInfo) {

    const url = process.env.GET_PACKAGE_INFO;
    const accessToken = await getToken();

    const response = await fetch(`${url}`, {
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
