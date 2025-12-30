'use client'
import { useContent } from '@/components/providers/CoberturaProvider';
import {Button, Form, Input, Checkbox, useDisclosure, Modal, ModalContent} from '@heroui/react';
import { createCookie } from './actions';
import { LoaderIcon, LocationIcon } from '@/constants/IconsConstants';
import { useEffect, useRef, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import geocodeApi from '@/services/google-maps/api';
import { GeocodeType } from '@/types/CoberturaTypes';
import { useIzziContent } from '@/components/providers/IzziProvider';
import { getOfertas } from '@/services/izzi/configurador';
import TeLlamamosModalComponent from '../../../components/layouts/modals/TeLlamamosModalComponent';



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

export default function CoberturaForm() {
    const map = useMap();
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const [error] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { getValue } = useMicrocopies('cobertura');
    const { addressSelected, setAddress, setSelectedPlace, setMarkerPosition,
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
      } = useContent();
    
    const {isOpen, onOpen, onOpenChange } = useDisclosure();
    
    const { setGlobalFlag, setFormattedAddress, setCoberturaData } = useIzziContent();

    
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
            fields: ['name', 'formatted_address', 'geometry.location'],
            componentRestrictions: { country: ['mx'] }
          };
      
          setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
        }, [places]);
      
        useEffect(() => {
          if (!placeAutocomplete) return;
      
          placeAutocomplete.addListener('place_changed', () => {
            const lat = placeAutocomplete.getPlace().geometry?.location?.lat() as number;
            const lng = placeAutocomplete.getPlace().geometry?.location?.lng() as number;
            if(lat && lng){
                setLat(lat);
                setLng(lng);
                const data = geocodeApi(lat, lng);
                data.then((result) => {
                    mapAddressFields(result);  
                });
                setAddress(true);
                onPlaceSelect(placeAutocomplete.getPlace());
                setMarkerPosition({lat, lng});
                if(map) map.panTo({lat, lng})
            }
          });
        }, [onPlaceSelect, placeAutocomplete]);

        return (
            <Input ref={inputRef}
                isRequired
                label={getValue('cobertura.form.direccion.label')}
                placeholder={getValue('cobertura.form.direccion.placeholder')}
                errorMessage={getValue('cobertura.form.direccion.error')}
                labelPlacement="outside"
                name="address"
                type="text"
                classNames={inputStyles}
                value={addressSelected ? street : undefined}
                 />
        );
      };

    /* const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('🐸 aqui configurador ')
        e.preventDefault();
        setFormattedAddress(`${street}, ${streetNumber}, ${locality}`);
        setGlobalFlag(true);
        setCoberturaData({
            lat: lat.toString(), 
            lng: lng.toString(), 
            zipCode: postalCode, 
            address: `${street}, ${streetNumber}, ${locality}`, 
            municipio: locality, 
            colonia: neighborhood,
            calle: street,
            numExt: streetNumber,
            estado: state
        });
        setIsLoading(true);
        await createCookie({lat: lat.toString(), lng: lng.toString(), zipCode: postalCode, address: `${street}, ${streetNumber}, ${locality}`});
    }; */

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      console.log('🐸 aqui Wizz ')

      e.preventDefault();
      setIsLoading(true);

      const coveraData = {
        lat: lat.toString(),
        lng: lng.toString(),
        zipCode: postalCode,
        address: `${street}, ${streetNumber}, ${locality}`, 
      }

      try{
        
        const response = await getOfertas(coveraData)
        console.log(' 🐋 check response', response);
        if(response.message === 'Address is in a WIZZ coverage area'){
            console.log(' 🐋 check WIZZ modal');
            setIsLoading(false);
            onOpen();
            return;
        }

        setFormattedAddress(coveraData.address);
        setGlobalFlag(true);
        setCoberturaData({
            ...coveraData,
            municipio: locality, 
            colonia: neighborhood,
            calle: street,
            numExt: streetNumber,
            estado: state
        });

        await createCookie(coveraData);
      
      } catch(error){
        console.error("Error validacion Wizz ", error)
        setIsLoading(false);
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
        const data =  geocodeApi(position.coords.latitude, position.coords.longitude);
        data.then((result) => {
            mapAddressFields(result);
        });
        setAddress(true);
        setMarkerPosition({lat: position.coords.latitude, lng: position.coords.longitude});
        if(map) map.panTo({lat: position.coords.latitude, lng: position.coords.longitude});
    }
      
    function naviError() {
        console.log(error)
        alert("Sorry, no position available.");
    }

function mapAddressFields(data: GeocodeType) {
    const components = data?.results?.[0]?.address_components ?? [];
  
    for (const item of components) {
      const value = item.long_name;
  
      for (const type of item.types) {
        switch (type) {
          case 'postal_code':
            setPostalCode(value);
            break;
          case 'route':
            setStreet(value);
            break;
          case 'street_number':
            setStreetNumber(value);
            break;
          case 'neighborhood':
          case 'sublocality':
          case 'sublocality_level_1': 
            setNeighborhood(value);
            break;
          case 'locality':
            setLocality(value);
            break;
          case 'administrative_area_level_1':
            setState(value);
            break;
          default:
            break;
        }
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'];
    
    if (allowedKeys.includes(e.key)) {
        return;
    }
    

    if (!/\d/.test(e.key)) {
        e.preventDefault();
    }
  };

  
const handleCharPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Tab'
  ];

  if (allowedKeys.includes(e.key)) {
    return;
  }

  // Solo letras (mayúsculas y minúsculas), opcionalmente espacios
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(e.key)) {
    e.preventDefault();
  }
};


      return (
        <>
        <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop='blur'
        size='2xl'
        classNames={{ wrapper: 'z-[100]'}}
        >
          <ModalContent>
            {(onClose)=> (
            <TeLlamamosModalComponent />
          )} 
          </ModalContent>
        </Modal>


        {isLoading &&
            
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
            <div className="w-[104px] h-[104px]">
                <LoaderIcon />
            </div>
        </div>
        }
        <Form className="w-full max-w-[95%]" onSubmit={onSubmit}>
            {addressSelected && (
            <Input
                isRequired
                disableAnimation={true}
                label={getValue('cobertura.form.codigo.label')}
                placeholder={getValue('cobertura.form.codigo.placeholder')}
                errorMessage={getValue('cobertura.form.codigo.error')}
                labelPlacement="outside"
                name="zipCode"
                type="text"
                value={postalCode}
                onValueChange={setPostalCode}
                classNames={inputStyles}
            />
            )}
            {addressSelected ?
                <Input
                    isRequired
                    label={getValue('cobertura.form.direccion.label')}
                    placeholder={getValue('cobertura.form.direccion.placeholder')}
                    errorMessage={getValue('cobertura.form.direccion.error')}
                    labelPlacement="outside"
                    name="address"
                    type="text"
                    value={street}
                    onValueChange={setStreet}
                    classNames={inputStyles}
                />
            :
                <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
            }
            <div className='flex col-2 w-full gap-4'>
                {addressSelected ?
                <Input
                    isRequired
                    label={getValue('cobertura.form.numExterno.label')}
                    placeholder={getValue('cobertura.form.numExterno.placeholder')}
                    errorMessage={getValue('cobertura.form.numExterno.error')}
                    labelPlacement="outside"
                    name="extNumber"
                    type="text"
                    value={streetNumber}
                    onValueChange={setStreetNumber}
                    classNames={inputStyles}
                    
                />
                : <></> }
                {addressSelected ?
                <Input
                    label={getValue('cobertura.form.numInterno.label')}
                    placeholder={getValue('cobertura.form.numInterno.placeholder')}
                    labelPlacement="outside"
                    name="intNumber"
                    type="text"
                    value={aptNumber}
                    onValueChange={setAptNumber}
                    classNames={inputStyles}
                    className='max-w-[95%]'
                />
                : <></>}
            </div>
            {addressSelected ?
            <Input
                isRequired
                label={getValue('cobertura.form.colonia.label')}
                placeholder={getValue('cobertura.form.colonia.placeholder')}
                errorMessage={getValue('cobertura.form.colonia.error')}
                labelPlacement="outside"
                name="locality"
                type="text"
                value={neighborhood}
                onValueChange={setNeighborhood}
                classNames={inputStyles}
            />
            : <></>}
            {addressSelected ?
            <Input
                label={getValue('cobertura.form.municipio.label')}
                placeholder={getValue('cobertura.form.municipio.placeholder')}
                labelPlacement="outside"
                name="locality"
                type="text"
                value={locality}
                onKeyDown={handleCharPress}
                onValueChange={setLocality}
                classNames={inputStyles}
            />
            : <></>}
            {addressSelected ?
            <Input
                isRequired
                label={getValue('cobertura.form.estado.label')}
                placeholder={getValue('cobertura.form.estado.placeholder')}
                errorMessage={getValue('cobertura.form.estado.error')}
                labelPlacement="outside"
                name="state"
                type="text"
                value={state}
                onKeyDown={handleCharPress}
                onValueChange={setState}
                classNames={inputStyles}
            />
            : <></>}
            <Input
                isRequired
                label={getValue('cobertura.form.nombre.label')}
                placeholder={getValue('cobertura.form.nombre.placeholder')}
                errorMessage={getValue('cobertura.form.nombre.error')}
                labelPlacement="outside"
                name="name"
                type="text"
                value={name}
                onKeyDown={handleCharPress}
                onValueChange={setName}
                classNames={inputStyles}
            />
            <Input
                isRequired
                label={getValue('cobertura.form.telefono.label')}
                placeholder={getValue('cobertura.form.telefono.placeholder')}
                errorMessage={getValue('cobertura.form.telefono.error')}
                labelPlacement="outside"
                name="phone"
                type="tel"
                value={phone}
                onValueChange={setPhone}
                onKeyDown={handleKeyPress}
                maxLength={10}
                classNames={inputStyles}
            /> 
            <div>
            <Checkbox isRequired={true} isSelected={isSelected} onValueChange={setIsSelected} defaultSelected={false} color="default" className='text-gray-450 pt-4 pb-8' />
                <span className='mr-1'>{getValue('cobertura.form.privacidad.label')}</span>
                <a target='_blank' href={getValue('cobertura.form.privacidad.Aviso.link') as string} >
                <span className='font-bold'>{getValue('cobertura.form.privacidad.Aviso') as string}</span>
                </a>
            </div>
            <div className='w-full pb-4 lg:flex lg:col-2 gap-4'>
                <Button startContent={<LocationIcon />} className='w-full lg:w-1/2 sm:my-4 xl:my-0 border border-black sm:text-[18px] xl:text-[12px]' variant='bordered' onPress={handleLocationChange}>
                {getValue('cobertura.button.ubicacion')}
                </Button>
                <Button
                        className={`w-full lg:w-1/2 ${addressSelected ? 'bg-black' : 'bg-gray-150'} text-white sm:text-[18px] xl:text-[14px] xsm:mt-4 lg:mt-0`} isDisabled={addressSelected && isSelected ? false : true} type="submit">
                    {getValue('cobertura.button.confirmar')}
                </Button>
            </div>
        </Form>
        </>
      )
}