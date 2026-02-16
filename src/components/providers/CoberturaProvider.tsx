'use client'

import { DataFields, ProviderProps } from "@/types/CoberturaTypes";
import { createContext, useContext, useState } from "react";

const coberturaContext = createContext<DataFields | undefined>(undefined);

export const useContent = () => {
    const ctx = useContext(coberturaContext);
    if (!ctx) {
        throw new Error('useContent se debe usar dentro del CoberturaProvider')
    }
    return ctx;
}

export const CoberturaProvider = ({
    children,
}: ProviderProps) => {
    const [addressSelected, setAddress] = useState<boolean>(false);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLng | google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
    const [postalCode, setPostalCode] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [streetNumber, setStreetNumber] = useState<string>('');
    const [aptNumber, setAptNumber] = useState<string>('');
    const [neighborhood, setNeighborhood] = useState<string>('');
    const [locality, setLocality] = useState<string>('');
    const [state, setState] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [lat, setLat] = useState<number>(0);
    const [lng, setLng] = useState<number>(0);
    const [mode, setMode] = useState<'address' | 'postalCode'>('address');

    return (
        <coberturaContext.Provider
            value={{
                addressSelected,
                setAddress,
                selectedPlace,
                setSelectedPlace,
                markerPosition,
                setMarkerPosition,
                postalCode, 
                setPostalCode,
                street, 
                setStreet,
                streetNumber, 
                setStreetNumber,
                aptNumber, 
                setAptNumber,
                neighborhood, 
                setNeighborhood,
                locality, 
                setLocality,
                state,
                setState,
                name, 
                setName,
                phone, 
                setPhone,
                lat,
                setLat,
                lng,
                setLng,
                mode, 
                setMode
            }}
        >
            {children}
        </coberturaContext.Provider>
    )
}