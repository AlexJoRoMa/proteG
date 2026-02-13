'use client'
import React, { useEffect } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps';
import IzziMap from './map';
import CoberturaForm from './form';
import { CoberturaProvider } from '@/components/providers/CoberturaProvider';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import { useSearchParams } from 'next/navigation';
import { preSelectionCookie } from './actions';

const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

export default function Cobertura() {
    const { getValue } = useMicrocopies('cobertura');
    const searchParams = useSearchParams();
    const planParam = searchParams.get("plan"); //ej: izzi80m_izzitvhd
    const movilParam = searchParams.get("movil"); //ej: movil10gb

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
                        <p className="text-[32px] font-bold">{getValue('cobertura.title')}</p>
                        <p className="text-[18px]">{getValue('cobertura.subtitle')}</p>
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
                            <div className='lg:w-1/2'>
                                <IzziMap />
                            </div>
                        </div>
                    </APIProvider>
                </div>
            </CoberturaProvider>
        </>
    )
}
