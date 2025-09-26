'use client'
import React, {useState, useEffect, useRef} from 'react'
import {Button, Form, Input, Checkbox} from '@heroui/react'
import {
    APIProvider,
    AdvancedMarker,
    Map,
    useMap,
    useMapsLibrary,
    useAdvancedMarkerRef,
    MapMouseEvent,
  } from '@vis.gl/react-google-maps';
import { createCookie } from './actions';

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

const LocationIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M8.0019 9.45851C8.4994 9.45851 8.92473 9.28135 9.2779 8.92701C9.63123 8.57268 9.8079 8.14676 9.8079 7.64926C9.8079 7.15176 9.63073 6.72635 9.2764 6.37301C8.92206 6.01985 8.49606 5.84326 7.9984 5.84326C7.5009 5.84326 7.07557 6.02043 6.7224 6.37476C6.36907 6.7291 6.1924 7.1551 6.1924 7.65276C6.1924 8.15026 6.36957 8.5756 6.7239 8.92876C7.07823 9.28193 7.50423 9.45851 8.0019 9.45851ZM8.00015 17.1068C9.95648 15.3554 11.4536 13.6756 12.4914 12.0673C13.5292 10.4589 14.0481 9.05026 14.0481 7.84126C14.0481 6.01826 13.469 4.5196 12.3106 3.34526C11.1523 2.17093 9.71548 1.58376 8.00015 1.58376C6.28481 1.58376 4.84798 2.17093 3.68965 3.34526C2.53131 4.5196 1.95215 6.01826 1.95215 7.84126C1.95215 9.05026 2.47107 10.4589 3.5089 12.0673C4.54673 13.6756 6.04381 15.3554 8.00015 17.1068ZM8.00015 19.1028C5.48348 16.9221 3.59631 14.8927 2.33865 13.0145C1.08098 11.1362 0.452148 9.41176 0.452148 7.84126C0.452148 5.5336 1.19857 3.66534 2.6914 2.23651C4.1844 0.807678 5.95398 0.0932617 8.00015 0.0932617C10.0463 0.0932617 11.8159 0.807678 13.3089 2.23651C14.8017 3.66534 15.5481 5.5336 15.5481 7.84126C15.5481 9.41176 14.9193 11.1362 13.6616 13.0145C12.404 14.8927 10.5168 16.9221 8.00015 19.1028Z" fill="black"/>
        </svg>
    );
};

const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
// const mapContainerStyle = { height: "400px"};


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
    const [postalCode, setPostalCode] = useState("");
    const [street, setStreet] = useState("");
    const [streetNumber, setStreetNumber] = useState("");
    const [aptNumber, setAptNumber] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [locality, setLocality] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [data, setData] = useState<GeocodeType>();
    const [error, setError] = useState<string | null>(null);

    const [lat, setLat] = useState<string>('');
    const [lng, setLng] = useState<string>('');
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLng | google.maps.LatLngLiteral>({ lat: 0, lng: 0 });

    const [selectedPlace, setSelectedPlace] =
        useState<google.maps.places.PlaceResult | null>(null);
    const [markerRef, marker] = useAdvancedMarkerRef();

    const map = useMap();

    const geocodeApi = async (lat: number, lng: number) => {
        try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapsKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: GeocodeType = await response.json();
        setData(data);
        setLat(lat.toString());
        setLng(lng.toString());
        mapAddressFields(data);
        } catch (err) {
        setError('Failed getting geolocation');
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
        // setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        geocodeApi(position.coords.latitude, position.coords.longitude);
        setAddress(true);
    }
      
    function naviError() {
        console.log(error)
        alert("Sorry, no position available.");
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        await createCookie({lat: lat, lng: lng, zipCode: postalCode});

        console.log(data)
    };

    const mapAddressFields = (data: GeocodeType) => {
        if (data && data.results) data.results[0].address_components.map(item => {
            console.log(item);
            switch (item.types[0]) {
                case 'postal_code':
                    setPostalCode(item.long_name)
                    break;
                case 'route':
                    setStreet(item.long_name)
                    break;
                case 'street_number':
                    setStreetNumber(item.long_name)
                    break;
                case 'neighborhood':
                    setNeighborhood(item.long_name)
                    break;
                case 'locality':
                    setLocality(item.long_name)
                    break;
                default:
                    break;
            }

        })
    }

    interface MapHandlerProps {
        place: google.maps.places.PlaceResult | null;
        marker: google.maps.marker.AdvancedMarkerElement | null;
      }
      
      const MapHandler = ({ place, marker }: MapHandlerProps) => {
        const map = useMap();
      
        useEffect(() => {
          if (!map || !place || !marker) return;
      
          if (place.geometry?.viewport) {
            map.fitBounds(place.geometry?.viewport);
          }
          marker.position = place.geometry?.location;
        }, [map, place, marker]);
      
        return null;
      };
      
      interface PlaceAutocompleteProps {
        onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
      }
      
      const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
        const [placeAutocomplete, setPlaceAutocomplete] =
          useState<google.maps.places.Autocomplete | null>(null);
        const inputRef = useRef<HTMLInputElement>(null);
        const places = useMapsLibrary('places');
      
        useEffect(() => {
          if (!places || !inputRef.current) return;
      
          const options = {
            fields: ['name', 'formatted_address', 'geometry.location']
          };
      
          setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
        }, [places]);
      
        useEffect(() => {
          if (!placeAutocomplete) return;
      
          placeAutocomplete.addListener('place_changed', () => {
            geocodeApi(placeAutocomplete.getPlace().geometry?.location?.lat() as number, placeAutocomplete.getPlace().geometry?.location?.lng() as number);
            setAddress(true);
            onPlaceSelect(placeAutocomplete.getPlace());
          });
        }, [onPlaceSelect, placeAutocomplete]);
      
        return (
            <Input ref={inputRef}
                isRequired
                errorMessage="Please enter a value"
                label="Dirección"
                labelPlacement="outside"
                name="address"
                placeholder="Introduce tu dirección"
                type="text"
                classNames={inputStyles}
                value={adressSelected ? street : undefined}
                 />
        );
      };

      const HandleMapClick = (ev: MapMouseEvent) => {
        setMarkerPosition(ev.detail?.latLng as google.maps.LatLng | google.maps.LatLngLiteral);
        if (map){
            map.panTo(ev.detail?.latLng as google.maps.LatLng | google.maps.LatLngLiteral);
        }
        geocodeApi(ev.detail?.latLng?.lat as number, ev.detail?.latLng?.lng as number);
        setAddress(true);
      }
    return (
    <>
        <div className="items-center justify-center mb-8 mx-sm xl:mx-xl xl:justify-start">
            <div className='flex flex-col'>
                <p className="text-[32px] font-bold">Comprueba tu cobertura</p>
                <p className="text-[18px]">Ingresa tu dirección y te mostraremos los paquetes y promociones que puedes contratar.</p>
            </div>
        
            <div className='lg:flex lg:flex-col-2 mt-8'>
            <APIProvider
                solutionChannel='2'
                apiKey={`${mapsKey}`}>
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
                            name="zipCode"
                            placeholder="Introduce tu código postal"
                            type="text"
                            value={postalCode}
                            onValueChange={setPostalCode}
                            classNames={inputStyles}
                        />
                        )}
                        {adressSelected ?
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
                        :
                            <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
                        }
                        <div className='flex col-2 w-full gap-4'>
                            {adressSelected ?
                            <Input
                                isRequired
                                errorMessage="Please enter a value"
                                label="Número exterior"
                                labelPlacement="outside"
                                name="extNumber"
                                placeholder="Introduce tu número exterior"
                                type="text"
                                value={streetNumber}
                                onValueChange={setStreetNumber}
                                classNames={inputStyles}
                                
                            />
                            : <></> }
                            {adressSelected ?
                            <Input
                                
                                errorMessage="Please enter a value"
                                label="Número interior"
                                labelPlacement="outside"
                                name="intNumber"
                                placeholder="Introduce tu número interior"
                                type="text"
                                value={aptNumber}
                                onValueChange={setAptNumber}
                                classNames={inputStyles}
                                className='max-w-[95%]'
                            />
                            : <></>}
                        </div>
                        {adressSelected ?
                        <Input
                            isRequired
                            errorMessage="Please enter a value"
                            label="Colonia"
                            labelPlacement="outside"
                            name="locality"
                            placeholder="Introduce tu colonia"
                            type="text"
                            value={neighborhood}
                            onValueChange={setNeighborhood}
                            classNames={inputStyles}
                        />
                        : <></>}
                        {adressSelected ?
                        <Input
                            
                            errorMessage="Please enter a value"
                            label="Alcaldia o Municipio"
                            labelPlacement="outside"
                            name="locality"
                            placeholder="Introduce tu alcaldia"
                            type="text"
                            value={locality}
                            onValueChange={setLocality}
                            classNames={inputStyles}
                        />
                        : <></>}
                        {adressSelected ?
                        <Input
                            isRequired
                            errorMessage="Please enter a value"
                            label="Estado"
                            labelPlacement="outside"
                            name="state"
                            placeholder="Introduce tu estado"
                            type="text"
                            value={locality}
                            onValueChange={setLocality}
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
                        <Checkbox defaultSelected={false} color="default" className='text-gray-450 pt-4 pb-8'>
                            Acepto los <span className='text-black'>Avisos de Privacidad</span>
                        </Checkbox>
                        <div className='w-full pb-4 lg:flex lg:col-2 gap-4'>
                            <Button startContent={<LocationIcon />} className='w-full lg:w-1/2 sm:my-4 xl:my-0 border border-black sm:text-[18px] xl:text-[12px]' variant='bordered' onPress={handleLocationChange}>
                                utilizar mi ubicación actual
                            </Button>
                            <Button
                                 className={`w-full lg:w-1/2 ${adressSelected ? 'bg-black' : 'bg-gray-150'} text-white sm:text-[18px] xl:text-[14px] xsm:mt-4 lg:mt-0`} isDisabled={!adressSelected} type="submit">
                                confirmar dirección
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            <div className='lg:w-1/2'>
                <Map
                    mapId={'bf51a910020fa25a'}
                    style={{height: '400px'}}
                    defaultCenter={{lat: 19.4311231, lng: -99.1777154}}
                    defaultZoom={10}
                    disableDefaultUI={true}
                    // mapTypeId={'roadmap'}
                    onClick={HandleMapClick}
                >
                <AdvancedMarker ref={markerRef} position={markerPosition} />
                </Map>
                <MapHandler place={selectedPlace} marker={marker} />
            </div>
            </APIProvider>
            </div>
        </div>
        </>
)}