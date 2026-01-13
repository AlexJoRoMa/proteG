import { IzziSelection, Promotion } from "@/types/ConfiguradorTypes";
import { DatosContratacion } from "@/types/Contratacion";

export async function GetEnvioCodigo(datosContratacion: Partial<DatosContratacion>, globalIzziSelection: IzziSelection | null, promoData: Promotion, precioTotal: number, idTransaction: string, radioState: string) {

    function getFullPackage() {
        const baseDescription = globalIzziSelection?.tituloTriplePlay ? globalIzziSelection.tituloTriplePlay : globalIzziSelection?.titulo || "";
        const extrasOtts = globalIzziSelection?.extrasMap?.ott;

        // Si no hay OTTs seleccionados, retornar solo la descripción base
        if (!Array.isArray(extrasOtts) || extrasOtts.length === 0) {
            return baseDescription;
        }

        // Para cada OTT, usar descripcionCombo si existe, si no usar descripcion
        const descripcionesCombos = extrasOtts
            .map(ott => {
                if (ott.descripcionCombo && ott.descripcionCombo.trim() !== "") {
                    return ott.descripcionCombo;
                }
                return ott.descripcion;
            })
            .filter(desc => desc && desc.trim() !== "");

        // Si no hay descripciones válidas, retornar solo la descripción base
        if (descripcionesCombos.length === 0) {
            return baseDescription;
        }

        // Construir la concatenación según las reglas
        let combosText = "";
        if (descripcionesCombos.length === 1) {
            combosText = descripcionesCombos[0];
        } else if (descripcionesCombos.length === 2) {
            combosText = `${descripcionesCombos[0]} y ${descripcionesCombos[1]}`;
        } else {
            const ultimoCombo = descripcionesCombos[descripcionesCombos.length - 1];
            const restoCombo = descripcionesCombos.slice(0, -1).join(", ");
            combosText = `${restoCombo} y ${ultimoCombo}`;
        }

        return `${baseDescription}. ${combosText}`;
    }

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

    function getPromos() {
        const promosQuote = promoData.promos;

        if (!promosQuote) return [];

        const promosMap = Array.isArray(promosQuote)
            ? promosQuote.map((item) => ({
                "name": item.promoName,
                "amount": item.promoPrice,
                "duration": item.meses,
                "permanent": item.permanente,
                "startMonth": item.mesInicio
            }))
            : [];

        const promos = [...promosMap];

        return promos;
    }

    const izziAhorros = promoData?.promoPackage ? promoData?.promoPackage.find((promo) => promo.name === "izzi ahorro")?.amount : 0;
    const addoms = getAddoms();
    const promoMobile = getPromoMobile();
    const promos = getPromos();


    const BODY = {
        "phone": `${datosContratacion.DatosPersonales?.personal.phone}`,
        "mail": `${datosContratacion.DatosPersonales?.personal.email}`,
        "name": `${datosContratacion.DatosPersonales?.personal.firstName}`,
        "lastname": `${datosContratacion.DatosPersonales?.personal.firstLastName}`,
        "package": getFullPackage(),
        "descriptionPackage": `${globalIzziSelection?.descripcion}`,
        "price": Number(Number(globalIzziSelection?.precioPaquete) - Number(izziAhorros)),
        "addons": addoms.addoms ? addoms.addoms : [],
        "promos": promos,
        "priceAddons": addoms.totalAddoms ? addoms.totalAddoms : 0,
        "priceWithoutPromo": Number(Number(globalIzziSelection?.precioPaquete) + (Number(addoms.totalAddoms) || 0)),
        "priceWithPromo": precioTotal,
        "priceMobile": globalIzziSelection?.extras?.precioPaquete ? Number(globalIzziSelection.extras.precioPaquete) : 0,
        "promoMobile": promoMobile,
        "promoPackage": promoData.promoPackage ? promoData.promoPackage : [],
        "spMovil": globalIzziSelection?.spMovil,
        "spTv": globalIzziSelection?.spTV,
    }

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