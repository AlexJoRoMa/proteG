'use client'

import { DataFields, ProviderProps } from "@/types/IzziTypes";
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
    const [globalFlagDomicilio, setGlobalFlagDomicilio] = useState<boolean>(false);
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
    const [ahorroTotal, setAhorroTotal] = useState<number>(0);
    const [checkSwitch, setCheckSwitch] = useState<boolean>(false);
    const [totalSinDescuento, setTotalSinDescuento] = useState<number>(0);
    const [addressFielSelected, setAddressFielSelected] = useState<boolean>(false);
    const [streetDireccion, setStreetDireccion] = useState<string>("");
    const [coloniaError, setColoniaError] = useState<boolean>(false);
    const [checkedPromotions, setCheckedPromotions] = useState<boolean>(false);

    const cleanLocalConfiguratorData = () => {
        localStorage.removeItem('PersistentPersonalData')
        localStorage.removeItem('PersistentDireccionData')
        localStorage.removeItem('PersistentBillingData')
        localStorage.removeItem('PersistentAdditionalAddressData')
    }


    const clearCheckoutFlow = useCallback(() => {
        setGlobalDatosContratacion({});
        setGlobalIzziSelection(null);
        setGlobalProcessStatus({});
        setGlobalUserAnswers({});
        setGlobalFlagDomicilio(false);
        setCheckSwitch(false);
        cleanLocalConfiguratorData();

        sessionStorage.removeItem("izzi-checkout-current-step");
        sessionStorage.removeItem("izzi-checkout-step-meta");
    }, []);


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
            checkedPromotions,
            setCheckedPromotions,
            ahorroTotal,
            setAhorroTotal,
            globalFlagDomicilio,
            setGlobalFlagDomicilio,
            checkSwitch,
            setCheckSwitch,
            totalSinDescuento,
            setTotalSinDescuento,
            addressFielSelected,
            setAddressFielSelected,
            streetDireccion,
            setStreetDireccion,
            coloniaError,
            setColoniaError
        }}>
            {children}
        </izziContext.Provider>
    )
}