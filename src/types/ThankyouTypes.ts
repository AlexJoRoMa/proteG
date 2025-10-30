export interface ThankyouCopys {
    titulo: string,
    subtitulo: string,
    banner: {
        currency: string,
        instalacion: string
    },
    resumen: string,
    info: {
        titulo: string,
        numeroCuenta: string,
        numeroOrden: string,
        horaInstalacion: string,
        metodoPago: string,
        mensaje: {
            texto1: string,
            texto2: string,
        },
    },
    app: {
        titulo: string,
        boton: {
            titulo: string,
            url: string,
        }
    },
    boton: {
        titulo: string,
        url: string
    }
}