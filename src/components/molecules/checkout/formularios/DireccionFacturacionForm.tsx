'use client'

import { useCheckout } from "@/components/providers/CheckoutProvider";
import { inputStyles } from "@/constants/StylesConstants";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { DatosContratacion } from "@/types/Contratacion";
import { InputFilter } from "@/utils/inputFilters";
import { Form, Input } from "@heroui/react";
import { FC, RefObject } from "react";

interface Props {
    formRef: RefObject<HTMLFormElement | null>;
}

export const DireccionFacturacionForm: FC<Props> = ({ formRef }) => {
    const { getValue } = useMicrocopies('formulario-otraDireccion');
    const { datosContratacion } = useCheckout();

    const direccionFacturacion: Partial<DatosContratacion> = datosContratacion ?? {};
    const datosDireccion = direccionFacturacion.DatosPersonales?.direccionFacturacion;


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
                    defaultValue={datosDireccion?.postalCode}
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
                    defaultValue={datosDireccion?.address}
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
                    defaultValue={datosDireccion?.exteriorNumber}
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
                    defaultValue={datosDireccion?.interiorNumber}
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
                    defaultValue={datosDireccion?.colony}
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
                    defaultValue={datosDireccion?.city}
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
                    defaultValue={datosDireccion?.state}
                />
            </div>
        </Form>
    )
}
