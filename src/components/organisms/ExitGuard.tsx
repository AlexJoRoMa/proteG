import { contentfulClient } from "@/services/contentful/client";
import ExitGuardContent from "../molecules/ExitGuardContent";
import { EntrySkeletonType } from "contentful";
import { IzziLogo, ModalCopys } from "@/types/ModalAbandonoFlujo";
import { getCopyForComponent } from "@/services/contentful/components";


export default async function ExitGuard() {

    const izziIcon = await contentfulClient.getAsset('5AhxzvJzSwpHKFCFR1cZaG').then((asset) => {
        return asset
    }) as unknown as EntrySkeletonType<IzziLogo>;


    const copysModalExit = await getCopyForComponent('Modal-salir-flujo').then((entry) => {
        return entry.modal
    }) as unknown as ModalCopys;

    return (
        <ExitGuardContent
            icon={izziIcon}
            text={copysModalExit}
        />
    )
}

