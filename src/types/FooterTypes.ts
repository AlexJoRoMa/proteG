import { Entry, EntrySkeletonType } from "contentful"

export type IzziFooter = {
    internalName: string;
    footerContactSection: Array<Contact>;
}

export type Contact = {
    fields: {
        topCopy: string,
        bottomCopy: string, 
        contactNumber: string,
        contactLinks: Array<Navigation>
    }
}


export type IzziFooterLinks = {
        internalName: string;
        footerLinkSection: Array<Link>;
}

export type Link = {
    fields: {
        internalName: string,
        footerLink: Array<Navigation>,
        navigationTitle?: string,
        navigationUrl?: string
    }
}

export type Navigation = {
    fields: {
        navigationTitle: string,
        navigationUrl: string,
        footerLink?: Array<Navigation>,
        internalName?: string,
        linkIcon?: Icon,
        backgroundColor?: colorPickerType
    }
}

export type Icon = {
    fields: { 
        title: string,
        file: File
    }
}

export type File = {
    url: string, 
    fileName: string
}

export type FooterComponentProps = {
    FooterData: Entry<EntrySkeletonType, undefined, string> | null
}

export type IzziCopyright = {
    fields: {
        internalName: string,
        copyright: string, 
        footerIzziLogo: Icon,
        footerProfecoLogo: Icon,
        footerProfecoLink: string
    }
}

export type colorPickerType = {
    id: string;
    name: string;
    value: string;
  }