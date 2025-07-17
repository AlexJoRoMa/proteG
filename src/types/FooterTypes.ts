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
        internalName?: string
    }
}

export type FooterComponentProps = {
    contactData: Entry<EntrySkeletonType, undefined, string> | null,
    linksData: Entry<EntrySkeletonType, undefined, string> | null
}