'use client'
import React, {useState} from 'react'
import {Button, Form, Input} from '@heroui/react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {googleMapsKey} from '@/services/google-maps/api';

interface GeocodeType {
    results: AddressType[],
}

interface AddressType {
    formatted_address: string,
    address_components: [{
        long_name: string,
        short_name: string,
        types: string[]
    }]
}

const mapsKey = googleMapsKey;
const mapContainerStyle = { height: "400px"};

const libraries: (
    'places'
)[] = ['places'];

const inputStyles = {
    label: "text-black/50",
    inputWrapper: [
        "bg-transparent",
        "hover: bg-transparent",
        "border-1 border-solid rounded-md",
    ],
    input: [
      "bg-transparent",
      "text-gray-200",
      "placeholder:text-gray-200",
      "hover: bg-transparent",
    ],
    innerWrapper: [
        "bg-transparent",
    ]
  }

export default function Cobertura() {
    const [adressSelected, setAddress] = useState(false) 
    const [center, setMapCenter] = useState({ lat: 19.4294087, lng: -99.1624372 });
    const [street, setStreet] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [data, setData] = useState<GeocodeType>();
    const [error, setError] = useState<string | null>(null);

    const geocodeApi = async (lat: number, lng: number) => {
        try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapsKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: GeocodeType = await response.json();
        setData(data);
        mapAddressFields(data);
        } catch (err) {
        setError('Failed gettin geolocation');
        console.error(err);
        }
    };

    
    const handleLocationChange = () => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, naviError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    function success(position: GeolocationPosition) {
        setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        geocodeApi(position.coords.latitude, position.coords.longitude);
        setAddress(true);
    }
      
    function naviError() {
        console.log(error)
        alert("Sorry, no position available.");
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        console.log(data)
    };


    // TODO: Mapear campos que responde api de google para acceder desde el template
    const mapAddressFields = (data: GeocodeType) => {
        console.log(data)
        if (data && data.results) data.results[0].address_components.map(item => {
            console.log(item);

        })
    }

    return (
        <>
        <div className="items-center justify-center mb-8 mx-sm xl:mx-xl xl:justify-start">
            <div className='flex flex-col'>
                <p className="text-[32px] font-bold">Comprueba tu cobertura</p>
                <p className="text-[18px]">Ingresa tu dirección y te mostraremos los paquetes y promociones que puedes contratar.</p>
            </div>
        
            <div className='lg:flex lg:flex-col-2 mt-8'>
            <div className='lg:w-1/2'>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Form className="w-full max-w-[95%]" onSubmit={onSubmit}>
                        {data && data.results && (
                        <Input
                            isRequired
                            disableAnimation={true}
                            errorMessage="Please enter a value"
                            label="Código postal"
                            labelPlacement="outside"
                            name="address"
                            placeholder="Introduce tu código postal"
                            type="text"
                            value={street}
                            onValueChange={setStreet}
                            classNames={inputStyles}
                        />
                        )}
                        <Input
                            isRequired
                            errorMessage="Please enter a value"
                            label="Dirección"
                            labelPlacement="outside"
                            name="address"
                            placeholder="Introduce tu dirección"
                            type="text"
                            value={street}
                            onValueChange={setStreet}
                            classNames={inputStyles}
                        />
                        
                        {adressSelected ?
                        <Input
                            isRequired
                            errorMessage="Please enter a value"
                            label="Número exterior"
                            labelPlacement="outside"
                            name="address"
                            placeholder="Introduce tu número exterior"
                            type="text"
                            value={street}
                            onValueChange={setStreet}
                            classNames={inputStyles}
                        />
                        : <></> }
                        {adressSelected ?
                        <Input
                            
                            errorMessage="Please enter a value"
                            label="Número interior"
                            labelPlacement="outside"
                            name="address"
                            placeholder="Introduce tu número interior"
                            type="text"
                            value={street}
                            onValueChange={setStreet}
                            classNames={inputStyles}
                        />
                        : <></>}
                        {adressSelected ?
                        <Input
                            isRequired
                            errorMessage="Please enter a value"
                            label="Colonia"
                            labelPlacement="outside"
                            name="address"
                            placeholder="Introduce tu colonia"
                            type="text"
                            value={street}
                            onValueChange={setStreet}
                            classNames={inputStyles}
                        />
                        : <></>}
                        {adressSelected ?
                        <Input
                            
                            errorMessage="Please enter a value"
                            label="Alcaldia o Municipio"
                            labelPlacement="outside"
                            name="address"
                            placeholder="Introduce tu alcaldia"
                            type="text"
                            classNames={inputStyles}
                        />
                        : <></>}
                        {adressSelected ?
                        <Input
                            isRequired
                            errorMessage="Please enter a value"
                            label="Estado"
                            labelPlacement="outside"
                            name="address"
                            placeholder="Introduce tu estado"
                            type="text"
                            classNames={inputStyles}
                        />
                        : <></>}
                        <Input
                            isRequired
                            errorMessage="Please enter a value"
                            label="Nombre"
                            labelPlacement="outside"
                            name="name"
                            placeholder="Introduce tu nombre"
                            type="text"
                            value={name}
                            onValueChange={setName}
                            classNames={inputStyles}
                        />
                        <Input
                            isRequired
                            errorMessage="Please enter a value"
                            label="Número de teléfono"
                            labelPlacement="outside"
                            name="phone"
                            placeholder="Introduce tu teléfono"
                            type="tel"
                            value={phone}
                            onValueChange={setPhone}
                            classNames={inputStyles}
                        />
                        <div className='w-full pb-4 lg:flex lg:col-2'>
                            <Button className='w-full lg:w-1/2' variant='bordered' onPress={handleLocationChange}>
                                utilizar mi ubicación actual
                            </Button>
                            <Button className='w-full lg:w-1/2' type="submit">
                                confirmar dirección
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            {/* TODO: Agregar componente autocomplete directo desde libreria de google */}
                <LoadScript googleMapsApiKey={`${mapsKey}`}
                libraries={libraries}>
                    <GoogleMap
                    mapContainerClassName='lg:w-1/2'
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={15}
                    >
                        {/* Optional: Add markers, info windows, etc. */}
                        {adressSelected ?
                            <Marker position={center} />
                            : <></>    
                        }
                        
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
        </>
)}