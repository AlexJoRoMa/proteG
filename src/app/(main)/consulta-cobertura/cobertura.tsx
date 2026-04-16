'use client'
import React, { useEffect, useState } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps';
import IzziMap from './map';
import CoberturaForm from './form';
import { CoberturaProvider } from '@/components/providers/CoberturaProvider';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import { useSearchParams } from 'next/navigation';
import { preSelectionCookie } from './actions';
import { LocationIcon } from '@/constants/IconsConstants';
import { useIzziContent } from '@/components/providers/IzziProvider';

const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

const FALLBACKS: Record<string, string> = {
    'cobertura.title': 'Comprueba tu cobertura',
    'cobertura.subtitle': 'Ingresa tu dirección y te mostraremos los paquetes y promociones que puedes contratar.',
    'cobertura.direccion.seleccionada': 'Dirección seleccionada:',
    'cobertura.alertaAzul.mensaje': 'Puedes seleccionar tu dirección arrastrando y haciendo clic en el mapa'
};


export default function Cobertura() {
    const { getValue } = useMicrocopies('cobertura');
    const getText = (key: string) => getValue(key) || FALLBACKS[key] || key;
    const searchParams = useSearchParams();
    const planParam = searchParams.get("plan"); //ej: izzi80m_izzitvhd
    const movilParam = searchParams.get("movil"); //ej: movil10gb
    const { addressFielSelected, streetDireccion } = useIzziContent();
    const [initialStreet] = useState(streetDireccion);

    const checkValue = addressFielSelected && streetDireccion !== initialStreet && streetDireccion.length > 0;


    useEffect(() => {

        async function setParams() {
            const cookieData = {
                seleccionPaquete: planParam ?? null,
                seleccionMovil: movilParam ?? null
            }
            await preSelectionCookie(cookieData);
        }
        setParams();
    }, [planParam, movilParam])

    return (
        <>
            <CoberturaProvider>

                <div className="items-center justify-center mb-8 mx-sm xl:mx-xl xl:justify-start">
                    <div className='flex flex-col'>
                        <p className="xsm:text-[20px] lg:text-[32px] font-bold">{getText('cobertura.title')}</p>
                        <p className="xsm:text-[16px] lg:text-[18px]">{getText('cobertura.subtitle')}</p>
                    </div>
                    <APIProvider
                        solutionChannel='2'
                        apiKey={`${mapsKey}`}>
                        <div className='lg:flex lg:flex-col-2 mt-8'>
                            <div className='lg:w-1/2'>
                                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                    <CoberturaForm />
                                </div>
                            </div>
                            {/* Lado derecho de la pagina */}
                            <div className='lg:w-1/2'>
                                {checkValue ?
                                    <div className='pb-4'>
                                        <p className='xsm:text-[20px] lg:text-[24px] font-bold pb-2'>
                                            {getText('cobertura.direccion.seleccionada')}
                                        </p>

                                        <div className='flex items-center gap-2'>
                                            <LocationIcon />
                                            <p className='xsm:text-[16px] lg:text-[18px]'>
                                                {streetDireccion}
                                            </p>
                                        </div>
                                    </div>
                                    : <></>}
                                <div className='bg-blue-700 rounded-lg text-white px-[20px] py-[16px] flex items-center gap-3 mb-4'>
                                    <div className='flex items-center justify-center w-5 h-5 border-1 border-white rounded-full flex-shrink-0'>
                                        <span className='text-[12px] font-bold pl-[1px]'>i</span>
                                    </div>
                                    <p className='fonrt-normal text-[16px] text-white leading-[1.4]'>
                                        {getText('cobertura.alertaAzul.mensaje')}
                                    </p>
                                </div>

                                <IzziMap />

                            </div>
                        </div>
                    </APIProvider>
                </div>
            </CoberturaProvider>
        </>
    )
}
