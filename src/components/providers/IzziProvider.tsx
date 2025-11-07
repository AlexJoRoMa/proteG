'use client'

import { ConfigParams, DataFields, ProviderProps } from "@/types/IzziTypes";
import { createContext, useCallback, useContext, useState } from "react";
import { CoberturaType, IzziSelection, Promotion, UserAnswers } from "@/types/ConfiguradorTypes";
import { DatosContratacion, ProcessStatus } from "@/types/Contratacion";

const izziContext = createContext<DataFields | undefined>(undefined);

export const useIzziContent = () => {
    const ctx = useContext(izziContext);

    if (!ctx) {
        throw new Error('useRecomendadorContent se debe usar dentro del RecomendadorProvider')
    }

    return ctx;
}

export const IzziProvider = ({
    children,
}: ProviderProps) => {
    const [globalFlag, setGlobalFlag] = useState<boolean>(false);
    const [globalUserAnswers, setGlobalUserAnswers] = useState<UserAnswers>({});
    const [globalIzziSelection, setGlobalIzziSelection] = useState<IzziSelection | null>(null);
    const [globalDatosContratacion, setGlobalDatosContratacion] = useState<Partial<DatosContratacion>>({});
    const [globalProcessStatus, setGlobalProcessStatus] = useState<Partial<ProcessStatus>>({});
    const [formattedAddress, setFormattedAddress] = useState<string>('');
    const [coberturaData, setCoberturaData] = useState<CoberturaType>({});
    const [promoData, setPromoData] = useState<Promotion>({});
    const [precioTotal, setPrecioTotal] = useState<number>(0);
    const [precioCombinado, setPrecioCombinado] = useState<number>(0);
    const [rpt, setRpt] = useState<string>('');
    const [offnetIzzi, setOffnetIzzi] = useState<boolean>(false);
    const [offnetSky, setOffnetSky] = useState<boolean>(false);
    const [infoPaquetes, setInfoPaquetes] = useState<string>("");
    const [params, setParams] = useState<ConfigParams>({ plan: null, movil: null });
    const [globalCheckedPromotions, setGlobalCheckedPromotions] = useState<boolean>(false);

    const clearCheckoutFlow = useCallback(() => {
        setGlobalDatosContratacion({});
        setGlobalIzziSelection(null);
        setGlobalProcessStatus({});
        setGlobalUserAnswers({});
        setParams({ plan: null, movil: null })
    }, [])


    return (
        <izziContext.Provider value={{
            globalFlag, setGlobalFlag,
            globalUserAnswers,
            setGlobalUserAnswers,
            globalIzziSelection,
            setGlobalIzziSelection,
            globalDatosContratacion,
            setGlobalDatosContratacion,
            globalProcessStatus,
            setGlobalProcessStatus,
            formattedAddress,
            setFormattedAddress,
            coberturaData,
            setCoberturaData,
            promoData,
            setPromoData,
            precioTotal,
            setPrecioTotal,
            precioCombinado,
            setPrecioCombinado,
            rpt,
            setRpt,
            offnetIzzi,
            setOffnetIzzi,
            offnetSky,
            setOffnetSky,
            infoPaquetes,
            setInfoPaquetes,
            clearCheckoutFlow,
            params,
            setParams,
            globalCheckedPromotions,
            setGlobalCheckedPromotions
        }}>
            {children}
        </izziContext.Provider>
    )
}