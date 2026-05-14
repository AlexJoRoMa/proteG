'use client'

import { useCheckout } from "@/components/providers/CheckoutProvider";
import { inputStyles } from "@/constants/StylesConstants";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { DatosContratacion } from "@/types/Contratacion";
import { InputFilter } from "@/utils/inputFilters";
import { Form, Input } from "@heroui/react";
import { FC, RefObject, useEffect, useState } from "react";

interface Props {
    formRef: RefObject<HTMLFormElement | null>;
    isAddressValid: boolean;
    setIsValid: (valid: boolean) => void;
}

export const DireccionFacturacionForm: FC<Props> = ({ formRef, setIsValid, isAddressValid }) => {
    const { getValue } = useMicrocopies('formulario-otraDireccion');
    const { datosContratacion } = useCheckout();

    const direccionFacturacion: Partial<DatosContratacion> = datosContratacion ?? {};
    const datosDireccion = direccionFacturacion.DatosPersonales?.direccionFacturacion;

    const getLocalAdditionalAddressData = () => {
        if (typeof window === 'undefined') return null
        return JSON.parse(localStorage.getItem('PersistentAdditionalAddressData') as string)
    }

    // Estados para controlar los valores de los campos
    const [postalCode, setPostalCode] = useState(() => {
        const local = getLocalAdditionalAddressData()
        return local?.postalCode ?? datosDireccion?.postalCode ?? ""
    })
    const [address, setAddress] = useState(() => {
        const local = getLocalAdditionalAddressData()
        return local?.address ?? datosDireccion?.address ?? ""
    })
    const [exteriorNumber, setExteriorNumber] = useState(() => {
        const local = getLocalAdditionalAddressData()
        return local?.exteriorNumber ?? datosDireccion?.exteriorNumber ?? ""
    })
    const [interiorNumber, setInteriorNumber] = useState(() => {
        const local = getLocalAdditionalAddressData()
        return local?.interiorNumber ?? datosDireccion?.interiorNumber ?? ""
    })
    const [colony, setColony] = useState(() => {
        const local = getLocalAdditionalAddressData()
        return local?.colony ?? datosDireccion?.colony ?? ""
    })
    const [city, setCity] = useState(() => {
        const local = getLocalAdditionalAddressData()
        return local?.city ?? datosDireccion?.city ?? ""
    })
    const [state, setState] = useState(() => {
        const local = getLocalAdditionalAddressData()
        return local?.state ?? datosDireccion?.state ?? ""
    })

    // Estados para controlar si los campos han sido tocados
    const [postalCodeTouched, setPostalCodeTouched] = useState(false);
    const [addressTouched, setAddressTouched] = useState(false);
    const [exteriorNumberTouched, setExteriorNumberTouched] = useState(false);
    const [colonyTouched, setColonyTouched] = useState(false);
    const [cityTouched, setCityTouched] = useState(false);
    const [stateTouched, setStateTouched] = useState(false);

    // Validar el formulario cuando cambien los valores
    useEffect(() => {
        const isFormValid =
            postalCode.trim() !== '' && postalCode.length === 5 &&
            address.trim() !== '' &&
            exteriorNumber.trim() !== '' &&
            colony.trim() !== '' &&
            city.trim() !== '' &&
            state.trim() !== '';

        setIsValid(isFormValid);
        if (isFormValid) {
            writeAdditionalAddressToLocal()
        }
    }, [postalCode, address, exteriorNumber, colony, city, state, setIsValid]);

    useEffect(() => {
        const isAdditionalValid = interiorNumber.trim() !== ''
        if (isAdditionalValid && isAddressValid) {
            writeAdditionalAddressToLocal()
        }
    }, [interiorNumber])

    const writeAdditionalAddressToLocal = () => {
        const persistentAdditionalAddressData = {
            postalCode,
            address,
            exteriorNumber,
            interiorNumber,
            colony,
            city,
            state
        }
        localStorage.setItem('PersistentAdditionalAddressData', JSON.stringify(persistentAdditionalAddressData))
    }

    return (

        <Form
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
            className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-[24px]'
        >
            {/* Codigo postal */}
            <div className='order-1'>
                <Input
                    label={getValue('otraDireccion.label.codigoPostal')}
                    name="postalCode"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    maxLength={5}
                    onInput={(e) => InputFilter(e, 'numeros')}
                    className='w-full'
                    placeholder={getValue('otraDireccion.placeholder.codigoPostal')}
                    errorMessage={getValue('otraDireccion.error.codigoPostal')}
                    value={postalCode}
                    onChange={(e) => {
                        setPostalCode(e.target.value);
                        setPostalCodeTouched(true);
                    }}
                    onBlur={() => setPostalCodeTouched(true)}
                    isInvalid={postalCodeTouched && (postalCode.trim() === '' || postalCode.length < 5)}
                />
            </div>
            {/* Dirección*/}
            <div className='order-2'>
                <Input
                    label={getValue('otraDireccion.label.direccion')}
                    name="address"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    className='w-full'
                    isRequired
                    onInput={(e) => InputFilter(e, 'alfanumerico')}
                    placeholder={getValue('otraDireccion.placeholder.direccion')}
                    errorMessage={getValue('otraDireccion.error.direccion')}
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value);
                        setAddressTouched(true);
                    }}
                    onBlur={() => setAddressTouched(true)}
                    isInvalid={addressTouched && address.trim() === ''}
                />
            </div>
            <div className='grid grid-cols-2 gap-4 order-3 md:contents'>
                {/* Número exterior */}
                <Input
                    label={getValue('otraDireccion.label.numeroExterior')}
                    name="exteriorNumber"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    onInput={(e) => InputFilter(e, 'alfanumerico')}
                    className='w-full col-span-1 md:col-start-1 md:!row-start-2'
                    placeholder={getValue('otraDireccion.placeholder.numeroExterior')}
                    errorMessage={getValue('otraDireccion.error.numeroExterior')}
                    value={exteriorNumber}
                    onChange={(e) => {
                        setExteriorNumber(e.target.value);
                        setExteriorNumberTouched(true);
                    }}
                    onBlur={() => setExteriorNumberTouched(true)}
                    isInvalid={exteriorNumberTouched && exteriorNumber.trim() === ''}
                />
                {/* Número interior */}
                <Input
                    label={getValue('otraDireccion.label.numeroInterior')}
                    name="interiorNumber"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    onInput={(e) => InputFilter(e, 'alfanumerico')}
                    classNames={inputStyles}
                    labelPlacement="outside"
                    className='w-full col-span-1 md:col-start-2 md:!row-start-2'
                    placeholder={getValue('otraDireccion.placeholder.numeroInterior')}
                    value={interiorNumber}
                    onChange={(e) => setInteriorNumber(e.target.value)}
                />
            </div>
            {/* Colonia */}
            <div className='order-4'>
                <Input
                    label={getValue('otraDireccion.label.colonia')}
                    name="colony"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    onInput={(e) => InputFilter(e, 'letras')}
                    placeholder={getValue('otraDireccion.placeholder.colonia')}
                    errorMessage={getValue('otraDireccion.error.colonia')}
                    value={colony}
                    onChange={(e) => {
                        setColony(e.target.value);
                        setColonyTouched(true);
                    }}
                    onBlur={() => setColonyTouched(true)}
                    isInvalid={colonyTouched && colony.trim() === ''}
                />
            </div>
            {/* Alcaldía o Municipo */}
            <div className='order-5'>
                <Input
                    label={getValue('otraDireccion.label.alcaldia')}
                    name="city"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    onInput={(e) => InputFilter(e, 'letras')}
                    className='w-full'
                    placeholder={getValue('otraDireccion.placeholder.alcaldia')}
                    errorMessage={getValue('otraDireccion.error.alcaldia')}
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value);
                        setCityTouched(true);
                    }}
                    onBlur={() => setCityTouched(true)}
                    isInvalid={cityTouched && city.trim() === ''}
                />
            </div>
            {/* Estado */}
            <div className='order-6'>
                <Input
                    label={getValue('otraDireccion.label.estado')}
                    name="state"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    onInput={(e) => InputFilter(e, 'letras')}
                    placeholder={getValue('otraDireccion.placeholder.estado')}
                    errorMessage={getValue('otraDireccion.error.estado')}
                    value={state}
                    onChange={(e) => {
                        setState(e.target.value);
                        setStateTouched(true);
                    }}
                    onBlur={() => setStateTouched(true)}
                    isInvalid={stateTouched && state.trim() === ''}
                />
            </div>
        </Form>
    )
}

