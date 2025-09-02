
//modalExit

export type IzziLogo = {
    altText: string,
    image: {
        fields: {
            file: {
                details: {
                    image: {
                        height: number,
                        width: number
                    }
                },
            url: string,
            }
            title: string
        }
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