import { IzziSelection, UserAnswers } from "@/types/ConfiguradorTypes";
import { Dispatch, SetStateAction } from "react";

export function IzziSelectionGuard(userAnswers: UserAnswers, setIzziSelection: Dispatch<SetStateAction<IzziSelection | null>>) {

    const hasInternet = !!userAnswers.internet;
    const hasTv = !!userAnswers.tv;
    const hasMovil = !!userAnswers.movil;

    // izzi internet
    if (hasInternet && !hasTv && !hasMovil) {
        setIzziSelection({
            idPaquete: userAnswers.internet?.paquete?.idPaquete,
            titulo: userAnswers.internet?.paquete?.titulo,
            descripcion: userAnswers.internet?.paquete?.descripcion,
            precioPaquete: userAnswers.internet?.paquete?.precioPaquete,
            precioAhorro: userAnswers.internet?.paquete?.precioAhorro,
            velocidadMinima: userAnswers.internet?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.internet?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.internet?.paquete?.extrasIncluidos,
            canales: userAnswers.internet?.paquete?.canales,
            canalesHd: userAnswers.internet?.paquete?.canalesHd,
        });
        return;
    }

    // // izzi internet + izzi tv
    if (hasInternet && hasTv && !hasMovil) {
        setIzziSelection({
            idPaquete: userAnswers.tv?.paquete?.idPaquete,
            titulo: userAnswers.tv?.paquete?.titulo,
            descripcion: userAnswers.tv?.paquete?.descripcion,
            precioPaquete: userAnswers.tv?.paquete?.precioPaquete,
            precioAhorro: userAnswers.tv?.paquete?.precioAhorro,
            velocidadMinima: userAnswers.tv?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.tv?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.tv?.paquete?.extrasIncluidos,
            canales: userAnswers.tv?.paquete?.canales,
            canalesHd: userAnswers.tv?.paquete?.canalesHd,
            ...(userAnswers.tv?.ott?.planes.length && userAnswers.tv?.ott?.planes.length > 0 &&
            {
                extrasMap: {
                    ott: userAnswers.tv?.ott?.planes
                }
            })
        });
        return;
    }

    // // izzi internet + izzi movil
    if (hasInternet && !hasTv && hasMovil) {
        setIzziSelection({
            idPaquete: userAnswers.internet?.paquete?.idPaquete,
            titulo: userAnswers.internet?.paquete?.titulo,
            descripcion: userAnswers.internet?.paquete?.descripcion,
            precioPaquete: userAnswers.internet?.paquete?.precioPaquete,
            precioAhorro: userAnswers.internet?.paquete?.precioAhorro,
            velocidadMinima: userAnswers.internet?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.internet?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.internet?.paquete?.extrasIncluidos,
            canales: userAnswers.internet?.paquete?.canales,
            canalesHd: userAnswers.internet?.paquete?.canalesHd,
            extras: {
                idPaquete: userAnswers.movil?.paquete?.idPaquete,
                titulo: userAnswers.movil?.paquete?.titulo,
                descripcion: userAnswers.movil?.paquete?.descripcion,
                precioPaquete: userAnswers.movil?.paquete?.precioPaquete,
                precioAhorro: userAnswers.movil?.paquete?.precioAhorro,
                velocidadMinima: userAnswers.movil?.paquete?.velocidadMinima,
                velocidadMaxima: userAnswers.movil?.paquete?.velocidadMaxima,
                extrasIncluidos: userAnswers.movil?.paquete?.extrasIncluidos,
                canales: userAnswers.movil?.paquete?.canales,
                canalesHd: userAnswers.movil?.paquete?.canalesHd,
            }
        });
        return;
    }

    // // izzi tv
    if (!hasInternet && hasTv && !hasMovil) {
        setIzziSelection({
            idPaquete: userAnswers.tv?.paquete?.idPaquete,
            titulo: userAnswers.tv?.paquete?.titulo,
            descripcion: userAnswers.tv?.paquete?.descripcion,
            precioPaquete: userAnswers.tv?.paquete?.precioPaquete,
            precioAhorro: userAnswers.tv?.paquete?.precioAhorro,
            velocidadMinima: userAnswers.tv?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.tv?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.tv?.paquete?.extrasIncluidos,
            canales: userAnswers.tv?.paquete?.canales,
            canalesHd: userAnswers.tv?.paquete?.canalesHd,
            ...(userAnswers.tv?.ott?.planes.length && userAnswers.tv?.ott?.planes.length > 0 &&
            {
                extrasMap: {
                    ott: userAnswers.tv?.ott?.planes
                }
            })
        });
        return;
    }

    // // izzi tv + izzi movil
    if (!hasInternet && hasTv && hasMovil) {
        setIzziSelection({
            idPaquete: userAnswers.tv?.paquete?.idPaquete,
            titulo: userAnswers.tv?.paquete?.titulo,
            descripcion: userAnswers.tv?.paquete?.descripcion,
            precioPaquete: userAnswers.tv?.paquete?.precioPaquete,
            precioAhorro: userAnswers.tv?.paquete?.precioAhorro,
            velocidadMinima: userAnswers.tv?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.tv?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.tv?.paquete?.extrasIncluidos,
            canales: userAnswers.tv?.paquete?.canales,
            canalesHd: userAnswers.tv?.paquete?.canalesHd,
            ...(userAnswers.tv?.ott?.planes.length && userAnswers.tv?.ott?.planes.length > 0 &&
            {
                extrasMap: {
                    ott: userAnswers.tv?.ott?.planes
                }
            }),
            extras: {
                idPaquete: userAnswers.movil?.paquete?.idPaquete,
                titulo: userAnswers.movil?.paquete?.titulo,
                descripcion: userAnswers.movil?.paquete?.descripcion,
                precioPaquete: userAnswers.movil?.paquete?.precioPaquete,
                precioAhorro: userAnswers.movil?.paquete?.precioAhorro,
                velocidadMinima: userAnswers.movil?.paquete?.velocidadMinima,
                velocidadMaxima: userAnswers.movil?.paquete?.velocidadMaxima,
                extrasIncluidos: userAnswers.movil?.paquete?.extrasIncluidos,
                canales: userAnswers.movil?.paquete?.canales,
                canalesHd: userAnswers.movil?.paquete?.canalesHd,
            }
        });
        return;
    }

    // // izzi movil
    if (!hasInternet && !hasTv && hasMovil) {
        setIzziSelection({
            idPaquete: userAnswers.movil?.paquete?.idPaquete,
            titulo: userAnswers.movil?.paquete?.titulo,
            descripcion: userAnswers.movil?.paquete?.descripcion,
            precioPaquete: userAnswers.movil?.paquete?.precioPaquete,
            precioAhorro: userAnswers.movil?.paquete?.precioAhorro,
            velocidadMinima: userAnswers.movil?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.movil?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.movil?.paquete?.extrasIncluidos,
            canales: userAnswers.movil?.paquete?.canales,
            canalesHd: userAnswers.movil?.paquete?.canalesHd,
        });
        return;
    }

    // // izzi internet + izzi tv + izzi movil
    if (hasInternet && hasTv && hasMovil) {
        setIzziSelection({
            idPaquete: userAnswers.tv?.paquete?.idPaquete,
            titulo: userAnswers.tv?.paquete?.titulo,
            descripcion: userAnswers.tv?.paquete?.descripcion,
            precioPaquete: userAnswers.tv?.paquete?.precioPaquete,
            precioAhorro: userAnswers.tv?.paquete?.precioAhorro,
            velocidadMinima: userAnswers.tv?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.tv?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.tv?.paquete?.extrasIncluidos,
            canales: userAnswers.tv?.paquete?.canales,
            canalesHd: userAnswers.tv?.paquete?.canalesHd,
            ...(userAnswers.tv?.ott?.planes.length && userAnswers.tv?.ott?.planes.length > 0 &&
            {
                extrasMap: {
                    ott: userAnswers.tv?.ott?.planes
                }
            }),
            extras: {
                idPaquete: userAnswers.movil?.paquete?.idPaquete,
                titulo: userAnswers.movil?.paquete?.titulo,
                descripcion: userAnswers.movil?.paquete?.descripcion,
                precioPaquete: userAnswers.movil?.paquete?.precioPaquete,
                precioAhorro: userAnswers.movil?.paquete?.precioAhorro,
                velocidadMinima: userAnswers.movil?.paquete?.velocidadMinima,
                velocidadMaxima: userAnswers.movil?.paquete?.velocidadMaxima,
                extrasIncluidos: userAnswers.movil?.paquete?.extrasIncluidos,
                canales: userAnswers.movil?.paquete?.canales,
                canalesHd: userAnswers.movil?.paquete?.canalesHd,
            }
        });
        return;
    }

    // no hay selección
    if (!hasInternet && !hasMovil && !hasTv) {
        setIzziSelection({})
    }

}
