'use client'
import React from 'react'
import { APIProvider } from '@vis.gl/react-google-maps';
import IzziMap from './map';
import CoberturaForm from './form';
import { CoberturaProvider } from '@/components/providers/CoberturaProvider';
import { useMicrocopies } from '@/hooks/useMicrocopies';

const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

export default function Cobertura() {
    const { getValue } = useMicrocopies('cobertura');

    return (
        <>
        <CoberturaProvider
            addressSelected={false}
            selectedPlace={null}
            setSelectedPlace={null}
            markerPosition={{ lat: 0, lng: 0 }}
            setMarkerPosition={{ lat: 0, lng: 0 }}
            postalCode={''}
            setPostalCode={''}
            street={''}
            setStreet={''}
            streetNumber={''}
            setStreetNumber={''}
            aptNumber={''}
            setAptNumber={''}
            neighborhood={''}
            setNeighborhood={''}
            locality={''}
            setLocality={''}
            name={''}
            setName={''}
            phone={''}
            setPhone={''}
            lat={0}
            setLat={0}
            lng={0}
            setLng={0}
            formattedAddress=''
            setFormattedAddress=''>
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
)}