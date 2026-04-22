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
            idExtra: userAnswers.internet?.paquete?.idExtra,
            nombreCode: userAnswers.internet?.paquete?.nombreCode,
            periodicidad: userAnswers.internet?.paquete?.periodicidad,
            titulo: userAnswers.internet?.paquete?.titulo,
            descripcion: userAnswers.internet?.paquete?.descripcion,
            precioPaquete: userAnswers.internet?.paquete?.precioPaquete,
            precioDomiciliacion: userAnswers.internet?.paquete?.precioDomiciliacion,
            tiempoPlan: userAnswers.internet?.paquete?.tiempoPlan,
            velocidadMinima: userAnswers.internet?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.internet?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.internet?.paquete?.extrasIncluidos,
            canales: userAnswers.internet?.paquete?.canales,
            canalesHd: userAnswers.internet?.paquete?.canalesHd,
            spMovil: userAnswers.internet?.paquete?.spMovil,
            spTV: userAnswers.internet?.paquete?.spTV,
            autoinstalacion: userAnswers.internet?.paquete?.autoinstalacion,
            ...(userAnswers.internet?.ott?.planes?.length && userAnswers.internet.ott.planes.length > 0 &&
            {
                extrasMap: {
                    ott: userAnswers.internet.ott.planes
                }
            })
        });
        return;
    }

    // // izzi internet + izzi tv
    if (hasInternet && hasTv && !hasMovil) {
        setIzziSelection({
            idPaquete: userAnswers.tv?.paquete?.idPaquete,
            idExtra: userAnswers.tv?.paquete?.idExtra,
            nombreCode: userAnswers.tv?.paquete?.nombreCode,
            periodicidad: userAnswers.tv?.paquete?.periodicidad,
            titulo: userAnswers.tv?.paquete?.titulo,
            tituloTriplePlay: userAnswers.tv?.paquete?.tituloTriplePlay,
            descripcion: userAnswers.tv?.paquete?.descripcion,
            precioPaquete: userAnswers.tv?.paquete?.precioTriplePlay,
            precioDomiciliacion: userAnswers.tv?.paquete?.precioDomiciliacion,
            tiempoPlan: userAnswers.tv?.paquete?.tiempoPlan,
            velocidadMinima: userAnswers.tv?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.tv?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.tv?.paquete?.extrasIncluidos,
            canales: userAnswers.tv?.paquete?.canales,
            canalesHd: userAnswers.tv?.paquete?.canalesHd,
            spMovil: userAnswers.tv?.paquete?.spMovil,
            spTV: userAnswers.tv?.paquete?.spTV,
            autoinstalacion: userAnswers.tv?.paquete?.autoinstalacion,
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
            idExtra: userAnswers.internet?.paquete?.idExtra,
            nombreCode: userAnswers.internet?.paquete?.nombreCode,
            periodicidad: userAnswers.internet?.paquete?.periodicidad,
            titulo: userAnswers.internet?.paquete?.titulo,
            descripcion: userAnswers.internet?.paquete?.descripcion,
            precioPaquete: userAnswers.internet?.paquete?.precioPaquete,
            precioDomiciliacion: userAnswers.internet?.paquete?.precioDomiciliacion,
            tiempoPlan: userAnswers.internet?.paquete?.tiempoPlan,
            velocidadMinima: userAnswers.internet?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.internet?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.internet?.paquete?.extrasIncluidos,
            canales: userAnswers.internet?.paquete?.canales,
            canalesHd: userAnswers.internet?.paquete?.canalesHd,
            spMovil: userAnswers.internet?.paquete?.spMovil,
            spTV: userAnswers.internet?.paquete?.spTV,
            autoinstalacion: userAnswers.internet?.paquete?.autoinstalacion,
            ...(userAnswers.internet?.ott?.planes?.length && userAnswers.internet.ott.planes.length > 0 &&
            {
                extrasMap: {
                    ott: userAnswers.internet.ott.planes
                }
            }),
            extras: {
                idPaquete: userAnswers.movil?.paquete?.idPaquete,
                idExtra: userAnswers.movil?.paquete?.idExtra,
                titulo: userAnswers.movil?.paquete?.titulo,
                periodicidad: userAnswers.movil?.paquete?.periodicidad,
                descripcion: userAnswers.movil?.paquete?.descripcion,
                precioPaquete: userAnswers.movil?.paquete?.precioPaquete,
                velocidadMinima: userAnswers.movil?.paquete?.velocidadMinima,
                velocidadMaxima: userAnswers.movil?.paquete?.velocidadMaxima,
                extrasIncluidos: userAnswers.movil?.paquete?.extrasIncluidos,
                canales: userAnswers.movil?.paquete?.canales,
                canalesHd: userAnswers.movil?.paquete?.canalesHd,
                spMovil: userAnswers.movil?.paquete?.spMovil,
                spTV: userAnswers.movil?.paquete?.spTV,
                autoinstalacion: userAnswers.movil?.paquete?.autoinstalacion,
            }
        });
        return;
    }

    // // izzi tv
    if (!hasInternet && hasTv && !hasMovil) {
        setIzziSelection({
            idPaquete: userAnswers.tv?.paquete?.idPaquete,
            idExtra: userAnswers.tv?.paquete?.idExtra,
            nombreCode: userAnswers.tv?.paquete?.nombreCode,
            periodicidad: userAnswers.tv?.paquete?.periodicidad,
            titulo: userAnswers.tv?.paquete?.titulo,
            descripcion: userAnswers.tv?.paquete?.descripcion,
            precioPaquete: userAnswers.tv?.paquete?.precioPaquete,
            precioDomiciliacion: userAnswers.tv?.paquete?.precioDomiciliacion,
            tiempoPlan: userAnswers.tv?.paquete?.tiempoPlan,
            velocidadMinima: userAnswers.tv?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.tv?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.tv?.paquete?.extrasIncluidos,
            canales: userAnswers.tv?.paquete?.canales,
            canalesHd: userAnswers.tv?.paquete?.canalesHd,
            spMovil: userAnswers.tv?.paquete?.spMovil,
            spTV: userAnswers.tv?.paquete?.spTV,
            autoinstalacion: userAnswers.tv?.paquete?.autoinstalacion,
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
            idExtra: userAnswers.tv?.paquete?.idExtra,
            nombreCode: userAnswers.tv?.paquete?.nombreCode,
            periodicidad: userAnswers.tv?.paquete?.periodicidad,
            titulo: userAnswers.tv?.paquete?.titulo,
            descripcion: userAnswers.tv?.paquete?.descripcion,
            precioPaquete: userAnswers.tv?.paquete?.precioPaquete,
            precioDomiciliacion: userAnswers.tv?.paquete?.precioDomiciliacion,
            tiempoPlan: userAnswers.tv?.paquete?.tiempoPlan,
            velocidadMinima: userAnswers.tv?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.tv?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.tv?.paquete?.extrasIncluidos,
            canales: userAnswers.tv?.paquete?.canales,
            canalesHd: userAnswers.tv?.paquete?.canalesHd,
            spMovil: userAnswers.tv?.paquete?.spMovil,
            spTV: userAnswers.tv?.paquete?.spTV,
            autoinstalacion: userAnswers.tv?.paquete?.autoinstalacion,
            ...(userAnswers.tv?.ott?.planes.length && userAnswers.tv?.ott?.planes.length > 0 &&
            {
                extrasMap: {
                    ott: userAnswers.tv?.ott?.planes
                }
            }),
            extras: {
                idPaquete: userAnswers.movil?.paquete?.idPaquete,
                idExtra: userAnswers.movil?.paquete?.idExtra,
                periodicidad: userAnswers.movil?.paquete?.periodicidad,
                titulo: userAnswers.movil?.paquete?.titulo,
                descripcion: userAnswers.movil?.paquete?.descripcion,
                precioPaquete: userAnswers.movil?.paquete?.precioPaquete,
                velocidadMinima: userAnswers.movil?.paquete?.velocidadMinima,
                velocidadMaxima: userAnswers.movil?.paquete?.velocidadMaxima,
                extrasIncluidos: userAnswers.movil?.paquete?.extrasIncluidos,
                canales: userAnswers.movil?.paquete?.canales,
                canalesHd: userAnswers.movil?.paquete?.canalesHd,
                spMovil: userAnswers.movil?.paquete?.spMovil,
                spTV: userAnswers.movil?.paquete?.spTV,
                autoinstalacion: userAnswers.movil?.paquete?.autoinstalacion,
            }
        });
        return;
    }

    // // izzi movil
    if (!hasInternet && !hasTv && hasMovil) {
        setIzziSelection({
            idPaquete: userAnswers.movil?.paquete?.idPaquete,
            idExtra: userAnswers.movil?.paquete?.idExtra,
            nombreCode: userAnswers.movil?.paquete?.nombreCode,
            periodicidad: userAnswers.movil?.paquete?.periodicidad,
            titulo: userAnswers.movil?.paquete?.titulo,
            descripcion: userAnswers.movil?.paquete?.descripcion,
            precioPaquete: userAnswers.movil?.paquete?.precioPaquete,
            tiempoPlan: userAnswers.movil?.paquete?.tiempoPlan,
            velocidadMinima: userAnswers.movil?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.movil?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.movil?.paquete?.extrasIncluidos,
            canales: userAnswers.movil?.paquete?.canales,
            canalesHd: userAnswers.movil?.paquete?.canalesHd,
            spMovil: userAnswers.movil?.paquete?.spMovil,
            spTV: userAnswers.movil?.paquete?.spTV,
            autoinstalacion: userAnswers.movil?.paquete?.autoinstalacion,
        });
        return;
    }

    // // izzi internet + izzi tv + izzi movil
    if (hasInternet && hasTv && hasMovil) {
        setIzziSelection({
            idPaquete: userAnswers.tv?.paquete?.idPaquete,
            idExtra: userAnswers.tv?.paquete?.idExtra,
            nombreCode: userAnswers.tv?.paquete?.nombreCode,
            titulo: userAnswers.tv?.paquete?.titulo,
            tituloTriplePlay: userAnswers.tv?.paquete?.tituloTriplePlay,
            periodicidad: userAnswers.tv?.paquete?.periodicidad,
            descripcion: userAnswers.tv?.paquete?.descripcion,
            precioPaquete: userAnswers.tv?.paquete?.precioTriplePlay,
            precioDomiciliacion: userAnswers.tv?.paquete?.precioDomiciliacion,
            tiempoPlan: userAnswers.tv?.paquete?.tiempoPlan,
            velocidadMinima: userAnswers.tv?.paquete?.velocidadMinima,
            velocidadMaxima: userAnswers.tv?.paquete?.velocidadMaxima,
            extrasIncluidos: userAnswers.tv?.paquete?.extrasIncluidos,
            canales: userAnswers.tv?.paquete?.canales,
            canalesHd: userAnswers.tv?.paquete?.canalesHd,
            spMovil: userAnswers.tv?.paquete?.spMovil,
            spTV: userAnswers.tv?.paquete?.spTV,
            autoinstalacion: userAnswers.tv?.paquete?.autoinstalacion,
            ...(userAnswers.tv?.ott?.planes.length && userAnswers.tv?.ott?.planes.length > 0 &&
            {
                extrasMap: {
                    ott: userAnswers.tv?.ott?.planes
                }
            }),
            extras: {
                idPaquete: userAnswers.movil?.paquete?.idPaquete,
                idExtra: userAnswers.movil?.paquete?.idExtra,
                titulo: userAnswers.movil?.paquete?.titulo,
                descripcion: userAnswers.movil?.paquete?.descripcion,
                precioPaquete: userAnswers.movil?.paquete?.precioPaquete,
                periodicidad: userAnswers.movil?.paquete?.periodicidad,
                velocidadMinima: userAnswers.movil?.paquete?.velocidadMinima,
                velocidadMaxima: userAnswers.movil?.paquete?.velocidadMaxima,
                extrasIncluidos: userAnswers.movil?.paquete?.extrasIncluidos,
                canales: userAnswers.movil?.paquete?.canales,
                canalesHd: userAnswers.movil?.paquete?.canalesHd,
                spMovil: userAnswers.movil?.paquete?.spMovil,
                spTV: userAnswers.movil?.paquete?.spTV,
                autoinstalacion: userAnswers.movil?.paquete?.autoinstalacion,
            }
        });
        return;
    }

    // no hay selección
    if (!hasInternet && !hasMovil && !hasTv) {
        setIzziSelection({})
    }

}
