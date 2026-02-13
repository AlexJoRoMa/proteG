'use client'
import { useContent } from '@/components/providers/CoberturaProvider';
import { Button, Form, Input, Checkbox, useDisclosure, Modal, ModalContent } from '@heroui/react';
import { createCookie } from './actions';
import { LoaderIcon, LocationIcon } from '@/constants/IconsConstants';
import { useEffect, useRef, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import geocodeApi from '@/services/google-maps/api';
import { GeocodeType } from '@/types/CoberturaTypes';
import { useIzziContent } from '@/components/providers/IzziProvider';
import { getOfertas } from '@/services/izzi/configurador';
import TeAyudamosModalComponentConfig from '../../../components/layouts/modals/TeAyudamosModalComponentConfigurador';
import { InputFilter } from '@/utils/inputFilters';


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

type Mode = 'address' | 'postalCode';

interface GooglePlacesInputProps {
  mode: Mode;
  value: string;
  onValueChange: (value: string) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  label: string;
  placeholder: string;
  errorMessage?: string;
}

const GooglePlacesInput = ({ mode, value, onValueChange, onPlaceSelect, label, placeholder, errorMessage }: GooglePlacesInputProps) => {

  const wrapperRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || autocompleteRef.current) return;

    const input = wrapperRef.current?.querySelector('input') as HTMLInputElement | null;

    if (!input) return;

    autocompleteRef.current = new places.Autocomplete(input, {
      fields: ['name', 'formatted_address', 'geometry.location', 'address_components'],
      componentRestrictions: { country: ['mx'] },
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.geometry) {
        onPlaceSelect(place);
      }
    });
  }, [places, onPlaceSelect]);

  return (
    <div ref={wrapperRef} className='w-full'>
      <Input
        isRequired
        label={label}
        placeholder={placeholder}
        labelPlacement='outside'
        value={value}
        onValueChange={onValueChange}
        errorMessage={errorMessage}
        name={mode === 'postalCode' ? 'zipCode' : 'address'}
        type='text'
        classNames={inputStyles}
        maxLength={mode === 'postalCode' ? 5 : undefined}
        onInput={
          mode === 'postalCode' ?
            (e) => InputFilter(e, 'numeros') :
            undefined
        }
      />
    </div>
  )
}

export default function CoberturaForm() {
  const map = useMap();
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [error] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getValue } = useMicrocopies('cobertura');
  const { getValue2 } = useMicrocopies('contrataahoramodal');
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
    mode,
    setMode
  } = useContent();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { setGlobalFlag, setFormattedAddress, setCoberturaData } = useIzziContent();


  const modalData = {
    title: getValue2('stickyModal.title'),
    column1: {
      title: getValue2('stickyModal.column1.title'),
      row1: {
        text: getValue2('stickyModal.column1.row1.text'),
        tel: getValue2('stickyModal.column1.row1.tel'),
      },
      row2: {
        link: getValue2('stickyModal.column1.row2.link'),
      },
      row3: {
        wpp: {
          text: getValue2('stickyModal.column1.row3.wpp.text'),
          tel: getValue2('stickyModal.column1.row3.wpp.tel'),
          promoText: getValue2('stickyModal.column1.row3.wpp.promoText'),
        },
      },
    },
    column2: {
      title: getValue2('stickyModal.column2.title'),
      row1: {
        text: getValue2('stickyModal.column2.row1.text'),
        tel: getValue2('stickyModal.column2.row1.tel'),
      },
      row2: {
        link: {
          text: getValue2('stickyModal.column2.row2.link.text'),
          url: getValue2('stickyModal.column2.row2.link.url'),
        },
      },
      row3: {
        wpp: {
          text: getValue2('stickyModal.column2.row3.wpp.text'),
          tel: getValue2('stickyModal.column2.row3.wpp.tel'),
          promoText: getValue2('stickyModal.column2.row3.wpp.promoText'),
        },
      },
    },
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {


    e.preventDefault();
    setIsLoading(true);

    const coveraData = {
      lat: lat.toString(),
      lng: lng.toString(),
      zipCode: postalCode,
      address: `${street}, ${streetNumber}, ${locality}`,
      municipio: locality,
      colonia: neighborhood,
      calle: street,
      numExt: streetNumber,
      estado: state
    }

    try {

      const response = await getOfertas(coveraData)

      if (response.message === 'Address is in a WIZZ coverage area') {

        setIsLoading(false);
        onOpen();
        return;
      }

      setFormattedAddress(coveraData.address);
      setGlobalFlag(true);
      setCoberturaData(coveraData);

      await createCookie(coveraData);

    } catch (error) {
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
    const data = geocodeApi(position.coords.latitude, position.coords.longitude);
    data.then((result) => {
      mapAddressFields(result);
    });
    setAddress(true);
    setMode('postalCode');
    setMarkerPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
    if (map) map.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
  }

  function naviError() {
    console.error("Geolocation error:", error)
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

  /* 
  Se creo handleGogglePlace para poder actualizar el mapa, el Marker y tambien el formulario
  
  */
  const handleGoogglePlace = (place: google.maps.places.PlaceResult | null) => {
    if (place) setSelectedPlace(place)
    const lat = place?.geometry?.location?.lat() ?? 0;
    const lng = place?.geometry?.location?.lng() ?? 0;

    if (lat !== 0 && lng !== 0) {
      setLat(lat);
      setLng(lng);
      setMarkerPosition({ lat: lat, lng: lng });
      geocodeApi(lat, lng).then((result) => {
        mapAddressFields(result)
        setAddress(true);
      });
      if (map) map.panTo({ lat, lng })
    }
    if (mode === 'address') {
      setMode('postalCode')
    }
  };


  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop='blur'
        size='2xl'
        classNames={{ wrapper: 'z-[50]' }}
      >
        <ModalContent>
          {(onClose) => (
            <TeAyudamosModalComponentConfig modalData={modalData} onClose={onClose} />
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
        <GooglePlacesInput
          mode={mode}
          value={postalCode}
          onValueChange={setPostalCode}
          onPlaceSelect={handleGoogglePlace}
          label={
            mode === 'address' ?
              getValue('cobertura.form.direccion.label') :
              getValue('cobertura.form.codigo.label')
          }
          placeholder={
            mode === 'address' ?
              getValue('cobertura.form.direccion.placeholder') :
              getValue('cobertura.form.codigo.placeholder')
          }
          errorMessage={
            mode === 'postalCode' ?
              getValue('cobertura.form.codigo.error') :
              undefined
          }
        />

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
          : <></>
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
            : <></>}
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
          maxLength={100}
          minLength={3}
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
          minLength={10}
          classNames={inputStyles}
        />
        <div>
          <Checkbox isRequired={true} isSelected={isSelected} onValueChange={setIsSelected} defaultSelected={false} color="default" className='text-gray-450 pt-4 pb-8' />
          <span className='mr-1'>{getValue('cobertura.form.privacidad.label')}</span>
          <a target='_blank' rel='noopener noreferrer' href={getValue('cobertura.form.privacidad.Aviso.link') as string} >
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