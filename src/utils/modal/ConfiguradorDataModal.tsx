import { ModalData } from "@/types/ModalComponentTypes";

export const dataModel = (getValueByKey: (key: string) => string): Record<string, ModalData> => ({
    internet: {
        titulo: getValueByKey('modal.titulo'),
        periodo: getValueByKey('modal.periodo'),
        domicilio: getValueByKey('modal.domicilio'),
        header: {
            titulo: {
                preVelocidadMinima: getValueByKey('modal.header.titulo.preVelocidadMinima'),
                posVelocidasMinima: getValueByKey('modal.header.titulo.posVelocidadMinima'),
                unidadVelocidad: getValueByKey('modal.header.titulo.unidadVelocidadMaxima'),
                posVelocidadMaxima: getValueByKey('modal.header.titulo.posVelocidadMaxima'),
                meses: getValueByKey('modal.header.titulo.meses'),
            },
            precio: {
                prePrecio: getValueByKey('modal.header.precio.prePrecio'),
                posPrecio: getValueByKey('modal.header.precio.posPrecio'),
            }
        },
        body: {
            texto1: getValueByKey('modal.body.texto1'),
            textoPromocion1: getValueByKey('modal.body.textoPromocion1'),
            textoPromocion2: getValueByKey('modal.body.textoPromocion2'),
            texto2: getValueByKey('modal.body.texto2'),
            textoDomicilio: getValueByKey('modal.body.textoDomicilio'),
            texto3: getValueByKey('modal.body.texto3'),
            textoPromocion3: getValueByKey('modal.body.textoPromocion3'),
            texto4: getValueByKey('modal.body.texto4'),
            beneficios: {
                titulo1: getValueByKey('modal.body.beneficios.titulo1'),
                descripcion1: getValueByKey('modal.body.beneficios.descripcion1'),
                titulo2: getValueByKey('modal.body.beneficios.titulo2'),
                descripcion2: getValueByKey('modal.body.beneficios.descripcion2'),
            },
            textoBoton: getValueByKey('modal.body.textoBoton'),
        },
        footer: {
            terminos: {
                texto: getValueByKey('modal.footer.terminos.texto'),
                url: getValueByKey('modal.footer.terminos.url'),
            },
            descripcion: getValueByKey('modal.footer.descripcion'),
        },
    },
    tv: {
        titulo: getValueByKey('modal.titulo'),
        periodo: getValueByKey('modal.periodo'),
        header: {
            titulo: {
                preCanales: getValueByKey('modal.header.titulo.preCanales'),
                posCanales: getValueByKey('modal.header.titulo.posCanales'),
            },
            precio: {
                prePrecio: getValueByKey('modal.header.precio.prePrecio'),
                posPrecio: getValueByKey('modal.header.precio.posPrecio'),
            }
        },
        body: {
            texto1: getValueByKey('modal.body.texto1'),
            texto2: getValueByKey('modal.body.texto2'),
            beneficios: {
                titulo1: getValueByKey('modal.body.beneficios.titulo1'),
                descripcion1: getValueByKey('modal.body.beneficios.descripcion1'),
                titulo2: getValueByKey('modal.body.beneficios.titulo2'),
                descripcion2: getValueByKey('modal.body.beneficios.descripcion2'),
            },
            textoBoton: getValueByKey('modal.body.textoBoton'),
        },
        footer: {
            terminos: {
                texto: getValueByKey('modal.footer.terminos.texto'),
                url: getValueByKey('modal.footer.terminos.url'),
            },
            descripcion: getValueByKey('modal.footer.descripcion'),
        },
    },
    movil: {
        titulo: getValueByKey('modal.titulo'),
        periodo: getValueByKey('modal.periodo'),
        header: {
            titulo: {
                preVelocidad: getValueByKey('modal.header.titulo.preVelocidad'),
                posVelocidad: getValueByKey('modal.header.titulo.posVelocidad'),
            },
            precio: {
                prePrecio: getValueByKey('modal.header.precio.prePrecio'),
                posPrecio: getValueByKey('modal.header.precio.posPrecio'),
            }
        },
        body: {
            texto1: getValueByKey('modal.body.texto1'),
            texto2: getValueByKey('modal.body.texto2'),
            beneficios: {
                titulo1: getValueByKey('modal.body.beneficios.titulo1'),
                descripcion1: getValueByKey('modal.body.beneficios.descripcion1'),
                titulo2: getValueByKey('modal.body.beneficios.titulo2'),
                descripcion2: getValueByKey('modal.body.beneficios.descripcion2'),
            },
            textoBoton: getValueByKey('modal.body.textoBoton'),
        },
        footer: {
            terminos: {
                texto: getValueByKey('modal.footer.terminos.texto'),
                url: getValueByKey('modal.footer.terminos.url'),
            },
            descripcion: getValueByKey('modal.footer.descripcion'),
        },
    }
})