'use client'
import { useContent } from '@/components/providers/CoberturaProvider';
import { Button, Form, Input, useDisclosure, Modal, ModalContent } from '@heroui/react';
import { createCookie } from './actions';
import { CheckCoberturaIcon, CloseBlackIcon, LoaderIcon, LocationIcon } from '@/constants/IconsConstants';
import React, { useEffect, useRef, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import geocodeApi from '@/services/google-maps/api';
import { GeocodeType } from '@/types/CoberturaTypes';
import { useIzziContent } from '@/components/providers/IzziProvider';
import { getOfertas } from '@/services/izzi/configurador';
import TeAyudamosModalComponentConfig from '../../../components/layouts/modals/TeAyudamosModalComponentConfigurador';

const FALLBACKS: Record<string, string> = {
  'cobertura.form.direccion.label': 'Dirección',
  'cobertura.form.codigo.label': 'Código postal',
  'cobertura.form.direccion.placeholder': 'Introduce tu dirección o código postal',
  'cobertura.form.direccion.error': 'Ingresa tu dirección y selecciona uno de la lista',
  'cobertura.form.codigo.placeholder': 'Introduce tu código postal',
  'cobertura.form.codigo.error': 'Ingresa un código postal válido',
  'cobertura.form.numExterno.label': 'Número exterior',
  'cobertura.form.numExterno.placeholder': 'Introduce tu número exterior',
  'cobertura.form.numExterno.error': 'Ingresa un número válido',
  'cobertura.form.numInterno.label': 'Número interior',
  'cobertura.form.numInterno.placeholder': 'Introduce tu número interior',
  'cobertura.form.colonia.label': 'Colonia',
  'cobertura.form.colonia.placeholder': 'Introduce tu colonia',
  'cobertura.form.colonia.error': 'Ingresa una colonia válida',
  'cobertura.form.municipio.label': 'Alcaldia o Municipio (Opc.)',
  'cobertura.form.municipio.placeholder': 'Introduce tu alcaldia',
  'cobertura.form.estado.label': 'Estado',
  'cobertura.form.estado.placeholder': 'Introduce tu estado',
  'obertura.form.estado.error': 'Ingresa un estado válido',
  'cobertura.button.ubicacion': 'utilizar mi ubicación actual',
  'cobertura.button.confirmar': 'confirmar dirección',
  'cobertura.descripcion.direccion': 'Ingresa tu dirección y selecciona uno de la lista',
};

let descriptionText = '';

const inputStyles = (isAddressSelected?: boolean) => ({
  label: "text-black/50",
  inputWrapper: [
    "bg-transparent",
    "hover: bg-transparent",
    "border-1 border-solid rounded-md",
    "!pr-0"
  ],
  input: [
    "bg-transparent",
    isAddressSelected ? "text-black" : "text-gray-200",
    "placeholder:text-gray-200",
    "hover: bg-transparent",
  ],
  innerWrapper: [
    "bg-transparent",
  ],
  description: [
    "text-black",
    "text-[12px]"
  ]
});

const inputDisableStyles = {
  label: "text-black opacity-100",
  inputWrapper: [
    "bg-gray-100",
    "border border-gray-100 border-solid rounded-md",
    "cursor-not-allowed"
  ],
  input: [
    "text-black",
    "placeholder:text-black",
    "cursor-not-allowed"
  ],
  innerWrapper: [
    "bg-transparent",
  ],
  description: [
    "text-black",
    "text-[12px]"
  ]
}

interface AddressParts {
  street: string,
  streetNumber: string,
  aptNumber: string,
  neighborhood: string,
  postalCode: string,
  locality: string,
  state: string,
}
interface GooglePlacesInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  label: string;
  placeholder: string;
  errorMessage?: string;
  description?: boolean;
  onBlur: () => void;
  addressSelected?: boolean;
  clear: () => React.ReactNode;
  onFocus: () => void;
}

const GooglePlacesInput = ({
  value,
  onValueChange,
  onPlaceSelect,
  label,
  placeholder,
  errorMessage,
  description,
  onBlur,
  addressSelected,
  clear,
  onFocus
 }: GooglePlacesInputProps) => {

  const wrapperRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const places = useMapsLibrary('places');
  const isInvalid = !addressSelected && value.trim() !== '';

  useEffect(() => {
    if (!places || autocompleteRef.current) return;

    const input = wrapperRef.current?.querySelector('input') as HTMLInputElement | null;

    if (!input) return;

    autocompleteRef.current = new places.Autocomplete(input, {
      fields: ['name', 'formatted_address', 'geometry.location', 'address_components'],
      componentRestrictions: { country: ['mx'] },
      types: ['address']
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
        description={
          <div className='flex items-center gap-2 mt-1'>
            {description ? <CheckCoberturaIcon /> : ''}
            <span>
              {descriptionText as string}
            </span>
          </div>
        }
        isRequired
        label={label}
        placeholder={placeholder}
        labelPlacement='outside'
        value={value}
        onValueChange={onValueChange}
        errorMessage={isInvalid ? errorMessage : null}
        autoComplete='off'
        name={'address'}
        type='text'
        classNames={inputStyles(addressSelected)}
        isInvalid={isInvalid}
        onBlur={onBlur}
        endContent={description && clear()}
        onFocus={onFocus}
      />
    </div>
  )
}

export default function CoberturaForm() {
  const map = useMap();
  const [error] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasResponse, setHasResponse] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasAddress, setHasAddress] = useState<string>('');
  const { getValue } = useMicrocopies('cobertura');
  const getText = (key: string) => getValue(key) || FALLBACKS[key] || key;
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
    lat,
    setLat,
    lng,
    setLng,
    mode,
    setMode,
    resetCobertura
  } = useContent();
  descriptionText = getText('cobertura.descripcion.direccion');

  const showFields = (addressSelected || hasAddress !== '') && street.trim() !== '';
  const isFieldDisabled = !addressSelected;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { setGlobalFlag, setFormattedAddress, setCoberturaData, setAddressFielSelected, setStreetDireccion } = useIzziContent();

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

    if (isLoading || hasResponse) return;
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
        setHasResponse(true);
        onOpen();
        return;
      }

      setHasResponse(true);
      setFormattedAddress(coveraData.address);
      setGlobalFlag(true);
      setCoberturaData(coveraData);
      setIsLoading(false);

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
      const formatted = result?.results?.[0]?.formatted_address || '';
      setHasAddress(formatted)
    });
    setAddress(true);
    setAddressFielSelected(true);
    setMode('postalCode');
    setMarkerPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
    if (map) map.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
  }

  function naviError() {
    console.error("Geolocation error:", error)
    alert("Sorry, no position available.");
  }

  const formatFullAddress = (data: AddressParts) => {
    const {street, streetNumber, aptNumber, neighborhood, postalCode, locality, state} = data;
     const parts = [
      street,
      streetNumber ? `#${streetNumber}` : null,
      aptNumber ? `Int.${aptNumber}` : null,
      neighborhood ? `Col. ${neighborhood}` : null,
      postalCode ? `C.P .${postalCode}` : null,
      locality ? locality : null,
      state ? state : null,
     ];

     return parts.filter(Boolean).join(', ');
  }

  useEffect(() => {
    const bannerAddress = formatFullAddress({
      street,
      streetNumber,
      aptNumber,
      neighborhood,
      postalCode,
      locality,
      state,
    })

    setStreetDireccion(bannerAddress);
  }, [street, streetNumber, aptNumber, neighborhood, postalCode, locality, state, setStreetDireccion])

  function mapAddressFields(data: GeocodeType) {
    const components = data?.results?.[0]?.address_components ?? [];

    //Se busca si existe un array con administrative_area_level_3
    const getAreaLevel = data?.results?.find(result =>
      result.address_components.some(component =>
        component.types.includes('administrative_area_level_3')
      )
    );

    const typeAreaLevel = getAreaLevel?.address_components ?? [];

    const allComponents = [...components, ...typeAreaLevel]

    let valueLocality = '';
    let valueArealvl3 = '';

    for (const item of allComponents) {
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
            valueLocality = value;
            break;
          case 'administrative_area_level_1':
            setState(value);
            break;
          case 'administrative_area_level_3':
            valueArealvl3 = value;
            break;
          default:
            break;
        }
      }
    }

    if (valueArealvl3) {
      setLocality(valueArealvl3);
    } else if (valueLocality) {
      setLocality(valueLocality);
    }

  }


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
    const addressExist = place?.name || place?.formatted_address || '';
    
    setHasAddress(addressExist);
    setAddress(true);

    if (lat !== 0 && lng !== 0) {
      setLat(lat);
      setLng(lng);
      setMarkerPosition({ lat: lat, lng: lng });
      geocodeApi(lat, lng).then((result) => {
        mapAddressFields(result)
        setAddressFielSelected(true);
      });
      if (map) map.panTo({ lat, lng })
    } 
    if (mode === 'address') {
      setMode('postalCode')
    }
  };

  const handleDirectionChange = (change: string) => {
    const isEmpty = change.trim() === "";
    const wasNotEmpty = street.trim() !== "";

    if (isEmpty && wasNotEmpty) {
      resetForm();
      setAddressFielSelected(false);
      return;
    }

    if(change !== hasAddress){
      setAddress(false)
      setAddressFielSelected(false)
    }
    setStreet(change)
  }

  const resetForm = () => {
    resetCobertura();
  }

  const clearForm = () => {
    return (
      <Button
        onPress={resetForm}
        radius='none'
        isIconOnly={true}
        className='bg-transparent'
      >
        <CloseBlackIcon />
      </Button>
    )
  }

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
          value={street}
          onValueChange={(e) => handleDirectionChange(e)}
          onPlaceSelect={handleGoogglePlace}
          label={getText('cobertura.form.direccion.label')}
          placeholder={getText('cobertura.form.direccion.placeholder')}
          errorMessage={ getText('cobertura.form.direccion.error')}
          description={addressSelected}
          onBlur={() => setTimeout(() =>setIsSearching(false), 300)}
          addressSelected={addressSelected}
          clear={clearForm}
          onFocus={()=>setIsSearching(true)}
        />

        {showFields && (
          <>
          <div className='flex col-2 w-full gap-4'>
            <Input
              isReadOnly={isFieldDisabled}
              isRequired
              label={getText('cobertura.form.numExterno.label')}
              placeholder={getText('cobertura.form.numExterno.placeholder')}
              errorMessage={getText('cobertura.form.numExterno.error')}
              labelPlacement="outside"
              name="extNumber"
              type="text"
              value={streetNumber}
              onValueChange={setStreetNumber}
              classNames={isFieldDisabled ? inputDisableStyles : inputStyles(true)}
            />
            <Input
              isReadOnly={isFieldDisabled}
              label={getText('cobertura.form.numInterno.label')}
              placeholder={getText('cobertura.form.numInterno.placeholder')}
              labelPlacement="outside"
              name="intNumber"
              type="text"
              value={aptNumber}
              onValueChange={setAptNumber}
              classNames={isFieldDisabled ? inputDisableStyles : inputStyles(true)}
              className='max-w-[95%]'
            />
        </div>
          <Input
            isReadOnly
            isRequired
            label={getText('cobertura.form.codigo.label')}
            placeholder={getText('cobertura.form.codigo.placeholder')}
            errorMessage={getText('cobertura.form.codigo.error')}
            labelPlacement="outside"
            name="postalCode"
            type="text"
            value={postalCode}
            onValueChange={setPostalCode}
            classNames={inputDisableStyles}
            maxLength={5}
          />
          <Input
            isReadOnly={isFieldDisabled}
            isRequired
            label={getText('cobertura.form.colonia.label')}
            placeholder={getText('cobertura.form.colonia.placeholder')}
            errorMessage={getText('cobertura.form.colonia.error')}
            labelPlacement="outside"
            name="neighborhood"
            type="text"
            value={neighborhood}
            onValueChange={setNeighborhood}
            classNames={isFieldDisabled ? inputDisableStyles : inputStyles(true)}
          />
          <Input
            isReadOnly
            label={getText('cobertura.form.municipio.label')}
            placeholder={getText('cobertura.form.municipio.placeholder')}
            labelPlacement="outside"
            name="locality"
            type="text"
            value={locality}
            onKeyDown={handleCharPress}
            onValueChange={setLocality}
            classNames={inputDisableStyles}
          />
          <Input
            isReadOnly
            isRequired
            label={getText('cobertura.form.estado.label')}
            placeholder={getText('cobertura.form.estado.placeholder')}
            errorMessage={getText('cobertura.form.estado.error')}
            labelPlacement="outside"
            name="state"
            type="text"
            value={state}
            onKeyDown={handleCharPress}
            onValueChange={setState}
            classNames={inputDisableStyles}
          />
          </>
        )}
        

        <div className='w-full pb-4 lg:flex lg:col-2 gap-4 pt-5'>
          <Button startContent={<LocationIcon />} className='w-full lg:w-1/2 sm:my-4 xl:my-0 border border-black sm:text-[18px] xl:text-[12px]' variant='bordered' onPress={handleLocationChange} isDisabled={hasResponse || isLoading}>
            {getText('cobertura.button.ubicacion')}
          </Button>
          <Button
            className={`w-full lg:w-1/2 ${addressSelected ? 'bg-black' : 'bg-gray-150'} text-white sm:text-[18px] xl:text-[14px] xsm:mt-4 lg:mt-0`} 
            isDisabled={!addressSelected || isSearching || hasResponse || isLoading} type="submit">
            {getText('cobertura.button.confirmar')}
          </Button>
        </div>
      </Form>
    </>
  )
}