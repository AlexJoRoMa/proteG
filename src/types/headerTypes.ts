import { Entry, EntrySkeletonType } from "contentful"

export type IzziNavbar = {
    fields: {
        internalName: string;
        brandLogo?: Logo;
        landingCombos: boolean;
        navigation: Array<Navigation>;
    }
}

export type Logo = {
  fields: {
    title: string,
    description: string,
    file: File
  }
}

export type File = {
    fileName: string,
    url: string
}

export type Navigation = {
    fields: {
        navigationTitle: string,
        navigationUrl: string,
        linkIcon?: Logo,
        internalName?: string, // Para mantener compatibilidad con datos existentes
        typeModal?: 'TeLlamamos' | 'TeAyudamos' // Nuevo campo para especificar el tipo de modal
    }
}

export type HeaderComponentProps = {
    navbarData: Entry<EntrySkeletonType, undefined, string>[] | null,
}

export type HeaderLandingComponentProps = {
    navbarData: Entry<EntrySkeletonType, undefined, string> | null,
    apibarData: Entry<EntrySkeletonType, undefined, string>[] | null,
    clienteTitulo: string,
    llamanosTitulo: string,
}