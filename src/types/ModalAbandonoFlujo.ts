
//modalExit

export type IzziLogo = {
    title: string,
    file: {
        details: {
            image: {
                height: number,
                width: number
            }
        },
        url: string
    }
}

export type ModalCopys = {
    titulo: string,
    descripcion: string,
    textoAbandonoFlujo: string,
    textoPermanenciaFlujo: string,
    infoAdicional: {
        textoLlamanos: string,
        contactoLlamanos: string
    }
}