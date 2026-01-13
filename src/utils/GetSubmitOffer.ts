import { IzziSelection, UserAnswers } from "@/types/ConfiguradorTypes";
import { getOttCategoriesFromContentful, isComboCategory } from "./OttCategoriesHelper";

export async function GetSubmitOffer(processId: string, globalIzziSelection: IzziSelection | null, precioTotal: number, globalUserAnswers: UserAnswers, offNetIzzi: boolean, offNetSky: boolean) {

    async function getAddoms() {
        const extrasMovil = globalIzziSelection?.extras;
        const extrasOtts = globalIzziSelection?.extrasMap?.ott;

        // Obtener las categorías válidas de combo desde Contentful
        const validComboCategories = await getOttCategoriesFromContentful();

        const addomsMovil = extrasMovil ?
            [{
                "extId": extrasMovil.idExtra,
                "extra": {
                    "title": extrasMovil.titulo
                },
                "nuevaCantidad": 1,
                "combo": false,
                "tipoEntrega": "DOMICILIO",
                "sucursalId": "N/A",
                "portabilidadMovil": "N",
                "imei": ""
            }]
            : [];

        const addomsOtts = Array.isArray(extrasOtts)
            ? extrasOtts.map((item) => ({
                "extId": item.idExtra,
                "nuevaCantidad": 1,
                "combo": isComboCategory(item.categoriaExtra, validComboCategories)
            }))
            : [];

        const addoms = [...addomsMovil, ...addomsOtts];

        return addoms;
    }

    const extrasAdoms = getAddoms();

    const DUMMY_BODY = {
        "requestedServices": {
            "product": Number(globalIzziSelection?.idPaquete),
            "productName": globalIzziSelection?.tituloTriplePlay ? globalIzziSelection.tituloTriplePlay : globalIzziSelection?.titulo,
            "negocios": false,
            "termExemptionPrice": 0,
            "extras": extrasAdoms,
            "priceToPay": String(precioTotal),
            "vel": globalUserAnswers.internet?.paquete?.velocidadMinima ? globalUserAnswers.internet?.paquete?.velocidadMinima : 0
        },
        "salesChannel": "WEB",
        "offNetSky": offNetSky,
        "offNetIzzi": offNetIzzi,
        "autoInstalacion": globalIzziSelection?.autoinstalacion,
        "autoInstallOrder": globalIzziSelection?.autoinstalacion ? {
            "autoInstalacion": true,
            "tipoEntrega": "DOMICILIO",
        } : null,
    }

    try {
        const body = JSON.stringify({
            ...DUMMY_BODY,
            processId
        });
        const headers = new Headers({
            "Content-Type": "application/json",
        });

        const response = await fetch("/api/contratacion/submitOffer", {
            method: "POST",
            headers,
            body,
        });

        const data = await response.json();

        return data;

    } catch (err) {
        console.error("Error al generar submitOffer", err);
        throw err;
    }


}