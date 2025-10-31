import { ReactNode } from "react";
import { CoberturaType, IzziSelection, Promotion, UserAnswers } from "./ConfiguradorTypes";

// Types de Provider para Proceso de compra
export type ProviderProps = {
    children: ReactNode,
    globalFlag?: boolean,
    setGlobalFlag?: boolean,
}

export type DataFields = {
    globalFlag: boolean,
    setGlobalFlag: React.Dispatch<React.SetStateAction<boolean>>,
    globalUserAnswers: UserAnswers,
    setGlobalUserAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>,
    globalIzziSelection: IzziSelection | null,
    setGlobalIzziSelection: React.Dispatch<React.SetStateAction<IzziSelection | null>>,
    formattedAddress: string,
    setFormattedAddress: React.Dispatch<React.SetStateAction<string>>,
    coberturaData: CoberturaType, 
    setCoberturaData: React.Dispatch<React.SetStateAction<CoberturaType>>,
    promoData: Promotion,
    setPromoData: React.Dispatch<React.SetStateAction<Promotion>>,
    precioTotal: number,
    setPrecioTotal: React.Dispatch<React.SetStateAction<number>>,
    precioCombinado: number,
    setPrecioCombinado: React.Dispatch<React.SetStateAction<number>>
}
