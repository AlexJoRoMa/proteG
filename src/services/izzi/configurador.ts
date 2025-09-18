import { PackageInfo } from "@/types/ConfiguradorTypes";

async function getToken() {
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


export async function getOfertas() {
    // TODO: aceptar valores dinamicos para el body

    const accessToken = await getToken();

    try {
        const response = await fetch(
            "https://test.izziapiweb.mx/izzi/ms/purchaseServices/sales/offersByType",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    "postalCode": "11320",
                    "latitude": 19.447547,
                    "longitude": -99.1745907,
                    "negocios": false,
                    "sky": false
                }),
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
        return new Response(JSON.stringify({ error: 'API fetch error'}), { status: 500 })
    }

    const data = await response.json();
    return data;

}
