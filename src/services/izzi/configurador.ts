'use server'
import { CoberturaType, PackageInfo, QuoteInfo } from "@/types/ConfiguradorTypes";
import { redirect } from "next/navigation";

export async function getToken() {
    console.log('[getToken] === Iniciando obtención de token ===');
    console.log('[getToken] Timestamp:', new Date().toISOString());

    const url = process.env.GET_TOKEN;
    console.log('[getToken] URL configurada:', url ? 'Sí' : 'No');
    console.log('[getToken] URL:', url);
    console.log('[getToken] PROVISION_KEY configurada:', process.env.PROVISION_KEY ? 'Sí' : 'No');
    
    try {
        const requestBody = {
            client_id: "izzi_core",
            client_secret: "izzi_core",
            grant_type: "password",
            provision_key: process.env.PROVISION_KEY,
            authenticated_userid: "izzi_core",
            scope: "write"
        };
        
        console.log('[getToken] Request Body:', JSON.stringify({
            ...requestBody,
            client_secret: '***',
            provision_key: requestBody.provision_key ? '***' : 'NO CONFIGURADA'
        }, null, 2));
        
        console.log('[getToken] Enviando petición POST...');
        
        const response = await fetch(`${url}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "aplication/json"
                },
                body: JSON.stringify(requestBody),
            }
        );

        console.log('[getToken] Respuesta recibida');
        console.log('[getToken] Status:', response.status);
        console.log('[getToken] Status Text:', response.statusText);
        console.log('[getToken] OK:', response.ok);
        console.log('[getToken] Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[getToken] ❌ Error en la respuesta');
            console.error('[getToken] Response Body:', errorText);
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[getToken] ✅ Token obtenido exitosamente');
        console.log('[getToken] Response keys:', Object.keys(data));
        console.log('[getToken] Token length:', data.access_token?.length || 0);
        
        return data.access_token;

    } catch (error) {
        console.error('[getToken] ❌ ERROR CRÍTICO al obtener el Access Token');
        console.error('[getToken] Error type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('[getToken] Error message:', error instanceof Error ? error.message : String(error));
        console.error('[getToken] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
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
