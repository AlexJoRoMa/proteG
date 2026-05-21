'use client'
import React, { useEffect, useState, useRef } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps';
import IzziMap from './map';
import CoberturaForm from './form';
import { CoberturaProvider } from '@/components/providers/CoberturaProvider';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import { useSearchParams } from 'next/navigation';
import { preSelectionCookie } from './actions';
import { LocationIcon, InfoIcon } from '@/constants/IconsConstants';
import { useIzziContent } from '@/components/providers/IzziProvider';

const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

const FALLBACKS: Record<string, string> = {
    'cobertura.title': 'Descubre los servicios de izzi disponibles en tu zona',
    'cobertura.subtitle': 'Consulta los paquetes, velocidades y promociones disponibles en tu hogar.',
    'cobertura.direccion.seleccionada': 'Dirección seleccionada:',
    'cobertura.alertaAzul.mensaje': 'Ayudanos a ubicar tu dirección en el mapa',
    'cobertura.seleccionaLista.mensaje': 'Escribe tu dirección y selecciona la mejor sugerencia',
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

    const mapRef = useRef<HTMLDivElement>(null);
    const goToMap = (e?: React.MouseEvent) => {
        if(e){
            e.preventDefault();
            e.stopPropagation();
        }
        mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start'});
    };

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
                    <div className='flex flex-col gap-y-2'>
                        <p className="xsm:text-[20px] lg:text-[32px] font-bold">{getText('cobertura.title')}</p>
                    </div>
                    <APIProvider
                        solutionChannel='2'
                        apiKey={`${mapsKey}`}>
                        <div className='lg:flex lg:flex-col-2 mt-3'>
                            <div className='lg:w-1/2'>
                            <p className="xsm:text-[16px] lg:text-[18px] mt-1">{getText('cobertura.subtitle')}</p>
                            {!checkValue ? 
                                <p className="xsm:text-[16px] lg:text-[18px] mt-5 font-bold">{getText('cobertura.seleccionaLista.mensaje')}</p>
                            : <></>}
                                <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-5">
                                    <CoberturaForm onGoMap={goToMap}/>
                                </div>
                            </div>


                            {/* Lado derecho de la pagina */}
                            <div  ref={mapRef}  className='lg:w-1/2'>
                                {checkValue ?
                                    <div  className='pb-4'>
                                        <p className='xsm:text-[20px] lg:text-[24px] font-bold pb-2 xsm:mt-6 lg:mt-0'>
                                            {getText('cobertura.direccion.seleccionada')}
                                        </p>

                                        <div className='flex items-center gap-2 '>
                                            <div className='flex-shrink-0'>
                                                <LocationIcon />
                                            </div>
                                            
                                            <p className='xsm:text-[16px] lg:text-[18px]'>
                                                {streetDireccion}
                                            </p>
                                        </div>
                                    </div>
                                    : <></>}

                                <div className='bg-blue-700 rounded-lg text-white px-[20px] py-[16px] flex items-center gap-3 mb-4 xsm:mt-3 lg:mt-0'>
                                    <div className='flex-shrink-0'>
                                        <InfoIcon />
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
