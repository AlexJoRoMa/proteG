'use client'

import { inputStyles } from "@/constants/StylesConstants";
import { InputFilter } from "@/utils/inputFilters";
import { Form, Input } from "@heroui/react";
import { FC, RefObject } from "react";

interface Props {
    formRef: RefObject<HTMLFormElement | null>;
}

export const DireccionFacturacionForm: FC<Props> = ({ formRef }) => (

    <Form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-[24px]'
    >
        {/* Codigo postal */}
        <div className='order-1'>
            <Input
                label="Código postal"
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
                placeholder='Ingresa tu Código postal'
                errorMessage='Ingresa un código postal válido'
            />
        </div>
        {/* Dirección*/}
        <div className='order-2'>
            <Input
                label="Dirección"
                name="address"
                type="text"
                variant='bordered'
                radius='sm'
                classNames={inputStyles}
                labelPlacement="outside"
                className='w-full'
                onInput={(e) => InputFilter(e, 'letras')}
                placeholder='Ingresa tu dirección'
            />
        </div>
        <div className='grid grid-cols-2 gap-4 order-3 md:contents'>
            {/* Número exterior */}
            <Input
                label="Número exterior"
                name="exteriorNumber"
                type="text"
                variant='bordered'
                radius='sm'
                classNames={inputStyles}
                labelPlacement="outside"
                isRequired
                onInput={(e) => InputFilter(e, 'numeros')}
                className='w-full col-span-1 md:col-start-1 md:!row-start-2'
                placeholder='Ingresa el número exterior'
                errorMessage='Ingresa un número válido'
            />
            {/* Número interior */}
            <Input
                label="Número interior (Opc.)"
                name="interiorNumber"
                type="text"
                variant='bordered'
                radius='sm'
                onInput={(e) => InputFilter(e, 'numeros')}
                classNames={inputStyles}
                labelPlacement="outside"
                className='w-full col-span-1 md:col-start-2 md:!row-start-2'
                placeholder='Ingresa el número interior'
            />
        </div>
        {/* Colonia */}
        <div className='order-4'>
            <Input
                label="Colonia"
                name="colony"
                type="text"
                variant='bordered'
                radius='sm'
                classNames={inputStyles}
                labelPlacement="outside"
                isRequired
                className='w-full'
                onInput={(e) => InputFilter(e, 'letras')}
                placeholder='Ingresa tu colonia'
                errorMessage='Ingresa una colonia válida'
            />
        </div>
        {/* Alcaldía o Municipo */}
        <div className='order-5'>
            <Input
                label="Alcaldía o Municipo"
                name="city"
                type="text"
                variant='bordered'
                radius='sm'
                classNames={inputStyles}
                labelPlacement="outside"
                isRequired
                onInput={(e) => InputFilter(e, 'letras')}
                className='w-full'
                placeholder='Ingresa tu alcaldía o municipio'
                errorMessage='Ingresa una alcaldía o municipio válido'
            />
        </div>
        {/* Estado */}
        <div className='order-6'>
            <Input
                label="Estado"
                name="state"
                type="text"
                variant='bordered'
                radius='sm'
                classNames={inputStyles}
                labelPlacement="outside"
                isRequired
                className='w-full'
                onInput={(e) => InputFilter(e, 'letras')}
                placeholder='Ingresa tu estado'
                errorMessage='Ingresa un estado válido'
            />
        </div>
    </Form>
)
