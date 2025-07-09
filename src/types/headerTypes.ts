export type IzziNavbar = {
    internalName: string;
    brandLogo?: Logo;
    navigation: Array<Navigation>;
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
        navigationUrl: string
    }
}