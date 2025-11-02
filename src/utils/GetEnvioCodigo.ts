import { IzziSelection, Promotion } from "@/types/ConfiguradorTypes";
import { DatosContratacion } from "@/types/Contratacion";

export async function GetEnvioCodigo(datosContratacion: Partial<DatosContratacion>, globalIzziSelection: IzziSelection | null, promoData: Promotion, precioTotal: number, idTransaction: string, radioState: string) {

    function getAddoms() {
        const extrasMovil = globalIzziSelection?.extras;
        const extrasOtts = globalIzziSelection?.extrasMap?.ott;

        const addomsMovil = extrasMovil ?
            [{
                "name": extrasMovil.titulo,
                "price": Number(extrasMovil.precioPaquete) || 0
            }]
            : [];

        const addomsOtts = Array.isArray(extrasOtts)
            ? extrasOtts.map((item) => ({
                "name": item.titulo,
                "price": Number(item.costo) || 0
            }))
            : [];

        const addoms = [...addomsMovil, ...addomsOtts];
        const totalAddoms = addoms.reduce((acc, item) => acc + item.price, 0)

        return { addoms, totalAddoms };
    }

    function getPromoMobile() {
        if (!promoData.promos) return 0;

        const promoTotal = promoData.promos.filter(item => item.promoMovil === true)
            .reduce((acc, item) => acc + Math.abs(Number(item.promoPrice || 0)), 0);

        return promoTotal;
    }

    const izziAhorros = promoData?.promoPackage ? promoData?.promoPackage.find((promo) => promo.name === "izzi ahorro")?.amount : 0;
    const addoms = getAddoms();
    const promoMobile = getPromoMobile();


    const BODY = {
        "phone": `${datosContratacion.DatosPersonales?.personal.phone}`,
        "mail": `${datosContratacion.DatosPersonales?.personal.email}`,
        "name": `${datosContratacion.DatosPersonales?.personal.firstName}`,
        "lastname": `${datosContratacion.DatosPersonales?.personal.firstLastName}`,
        "package": globalIzziSelection?.tituloTriplePlay ? globalIzziSelection.tituloTriplePlay : globalIzziSelection?.titulo,
        "descriptionPackage": `${globalIzziSelection?.descripcion}`,
        "price": Number(Number(globalIzziSelection?.precioPaquete) - Number(izziAhorros)),
        "addons": addoms.addoms ? addoms.addoms : [],
        "promos": promoData.promos ? promoData.promos : [],
        "priceAddons": addoms.totalAddoms ? addoms.totalAddoms : 0,
        "priceWithoutPromo": Number(Number(globalIzziSelection?.precioPaquete) + (Number(addoms.totalAddoms) || 0)),
        "priceWithPromo": precioTotal,
        "priceMobile": globalIzziSelection?.extras?.precioPaquete ? Number(globalIzziSelection.extras.precioPaquete) : 0,
        "promoMobile": promoMobile,
        "promoPackage": promoData.promoPackage ? promoData.promoPackage : [],
        "spMovil": globalIzziSelection?.spMovil,
        "spTv": globalIzziSelection?.spTV,
    }
    console.log('body - envioCodigo:', BODY)

    try {

        const body = JSON.stringify({
            ...BODY,
            idTransaction,
        });

        const headers = new Headers({
            "Content-Type": "application/json",
            "x-origin": "PORTALVL",
            "medio": radioState === "Correo Electrónico" ? "CORREO" : radioState === "WhatsApp" ? "WHATSAPP" : "SMS",
            "oferta": "IZZI",
        });

        const response = await fetch("/api/contratacion/verificacionContacto/envioCodigo", {
            method: "POST",
            headers,
            body,
        });

        const data = await response.json();
        if (!data) throw new Error("Invalid response from server");

        return data;

    } catch (err) {
        console.error("Error al enviar codigo", err);
        throw err;
    }
}