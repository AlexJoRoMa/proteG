'use client'
import React, {useRef} from 'react'
import {Button, Form, Input} from '@heroui/react'
import { Autocomplete, GoogleMap, LoadScript, PlaceAutocompleteElement } from '@react-google-maps/api';

const mapContainerStyle = { height: "400px", width: "50%" };
const center = { lat: 19.4294087, lng: -99.1624372 }; // Example coordinates

const libraries: (
    | 'drawing'
    | 'geometry'
    | 'localContext'
    | 'places'
    | 'visualization'
)[] = ['places'];

function handleGeolocation() {
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
      });
}

export default function Cobertura() {
    const [email, setEmail] = React.useState("");
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit = (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        setSubmitted(data);
    };

    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if(autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if(place.geometry && place.geometry.location) {
                const location = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };
                console.log("Location: ", place);
                console.log("coords: ", location);
            } else {
                console.log("Location not found");
            }
        } else {
            console.log("Autocomplete not ready");
        }
    };

    return (
        <>
        <div className="items-center justify-center mb-8 mx-sm xl:mx-xl xl:justify-start">
            <div className='flex flex-col'>
                <p className="text-[32px] font-bold">Comprueba tu cobertura</p>
                <p className="text-[18px]">Ingresa tu dirección y te mostraremos los paquetes y promociones que puedes contratar.</p>
            </div>
        
            <div className='flex flex-col-2 mt-8'>
                <div className='w-1/2'>
                <Button onPress={handleGeolocation}>
                    utilizar mi ubicación actual
                </Button>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Form className="w-full max-w-xs" onSubmit={onSubmit}>
                        <Input
                            isRequired
                            errorMessage="Please enter a valid email"
                            label="Email"
                            labelPlacement="outside"
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            value={email}
                            onValueChange={setEmail}
                        />
                        <Button type="submit" variant="bordered">
                            Submit
                        </Button>
                        {submitted && (
                            <div className="text-small text-default-500">
                            You submitted: <code>{JSON.stringify(submitted)}</code>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
                <LoadScript googleMapsApiKey='AIzaSyD-eoqjwSEEiNrhDLflqPm5hBsLaUTGSXI'
                libraries={['places']}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={15}
                    >
                        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                            <input type="text" name="" id="" placeholder='buscar lugar' />
                        </Autocomplete>
                        {/* Optional: Add markers, info windows, etc. */}
                        {/* <Marker position={center} /> */}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
        </>
)}