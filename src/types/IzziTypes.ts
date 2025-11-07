import React, { ReactNode } from "react";
import { CoberturaType, IzziSelection, Promotion, UserAnswers } from "./ConfiguradorTypes";
import { DatosContratacion, ProcessStatus } from "./Contratacion";

// Types de Provider para Proceso de compra
export type ProviderProps = {
    children: ReactNode,
    globalFlag?: boolean,
    setGlobalFlag?: boolean,
}

export type ConfigParams = {
    plan: string | null;
    movil: string | null;
}

export type DataFields = {
    globalFlag: boolean,
    setGlobalFlag: React.Dispatch<React.SetStateAction<boolean>>,
    globalUserAnswers: UserAnswers,
    setGlobalUserAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>,
    globalIzziSelection: IzziSelection | null,
    setGlobalIzziSelection: React.Dispatch<React.SetStateAction<IzziSelection | null>>,
    globalDatosContratacion: Partial<DatosContratacion>,
    setGlobalDatosContratacion: React.Dispatch<React.SetStateAction<Partial<DatosContratacion>>>,
    globalProcessStatus: Partial<ProcessStatus>,
    setGlobalProcessStatus: React.Dispatch<React.SetStateAction<Partial<ProcessStatus>>>,
    formattedAddress: string,
    setFormattedAddress: React.Dispatch<React.SetStateAction<string>>,
    coberturaData: CoberturaType, 
    setCoberturaData: React.Dispatch<React.SetStateAction<CoberturaType>>,
    promoData: Promotion,
    setPromoData: React.Dispatch<React.SetStateAction<Promotion>>,
    precioTotal: number,
    setPrecioTotal: React.Dispatch<React.SetStateAction<number>>,
    precioCombinado: number,
    setPrecioCombinado: React.Dispatch<React.SetStateAction<number>>,
    rpt: string,
    setRpt: React.Dispatch<React.SetStateAction<string>>,
    offnetIzzi: boolean,
    setOffnetIzzi: React.Dispatch<React.SetStateAction<boolean>>,
    offnetSky: boolean,
    setOffnetSky: React.Dispatch<React.SetStateAction<boolean>>
    infoPaquetes: string
    setInfoPaquetes: React.Dispatch<React.SetStateAction<string>>
    clearCheckoutFlow: () => void
    params: ConfigParams
    setParams: React.Dispatch<React.SetStateAction<ConfigParams>>,
    globalCheckedPromotions: boolean,
    setGlobalCheckedPromotions: React.Dispatch<React.SetStateAction<boolean>>
}
