'use client'

import { Form, Input } from "@heroui/react";
import { FC, RefObject } from "react";
import { inputStyles } from "@/constants/StylesConstants";
import { InputFilter } from "@/utils/inputFilters";
import ButtonGhost from "@/components/atoms/ButtonGhost";
import { useMicrocopies } from "@/hooks/useMicrocopies";

interface Props {
    formRef: RefObject<HTMLFormElement | null>
    esExtrangero: boolean
}

export const DatosPersonalesForm: FC<Props> = ({ formRef, esExtrangero }) => {
    const { getValue } = useMicrocopies('formulario-datosPersonales');

    return (
        <Form
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
        >
            {/* Nombre */}
            <div className='order-1'>
                <Input
                    label={getValue('datosPersonales.label.nombre')}
                    name="firstName"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder={getValue('datosPersonales.placeholder.nombre')}
                    errorMessage={getValue('datosPersonales.error.nombre')}
                    onInput={(e) => InputFilter(e, 'letras')}
                />
            </div>

            {/* Segundo nombre */}
            <div className='order-2'>
                <Input
                    label={getValue('datosPersonales.label.segundoNombre')}
                    name="secondName"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    className='w-full'
                    placeholder={getValue('datosPersonales.placeholder.segundoNombre')}
                    onInput={(e) => InputFilter(e, 'letras')}
                />
            </div>

            {/* Apellido paterno */}
            <div className='order-3'>
                <Input
                    label={getValue('datosPersonales.label.apellidoPaterno')}
                    name="firstLastName"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder={getValue('datosPersonales.placeholder.apellidoPaterno')}
                    errorMessage={getValue('datosPersonales.error.apellido')}
                    onInput={(e) => InputFilter(e, 'letras')}
                />
            </div>

            {/* Apellido materno */}
            <div className='order-4'>
                <Input
                    label={getValue('datosPersonales.label.apellidoMaterno')}
                    name="secondLastName"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder={getValue('datosPersonales.placeholder.apellidoMaterno')}
                    errorMessage={getValue('datosPersonales.error.apellido')}
                    onInput={(e) => InputFilter(e, 'letras')}
                />
            </div>

            {/* Teléfono */}
            <div className='order-5'>
                <Input
                    label={getValue('datosPersonales.label.telefono')}
                    name="phone"
                    type="tel"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder={getValue('datosPersonales.placeholder.telefono')}
                    errorMessage={getValue('datosPersonales.error.telefono')}
                    onInput={(e) => InputFilter(e, 'numeros')}
                />
            </div>

            {/* Telefono adicional */}
            <div className='order-6'>
                <Input
                    label={getValue('datosPersonales.label.telefonoAdicional')}
                    name="aditionalTel"
                    type="tel"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    className='w-full'
                    placeholder={getValue('datosPersonales.placeholder.telefono')}
                    onInput={(e) => InputFilter(e, 'numeros')}
                />
            </div>

            {/* CURP */}
            <div className='order-7'>
                {
                    esExtrangero ?
                        <Input
                            label={getValue('datosPersonales.label.pasaporte')}
                            name="passport"
                            type="text"
                            radius='sm'
                            variant='bordered'
                            classNames={inputStyles}
                            labelPlacement="outside"
                            isRequired
                            className='w-full'
                            onInput={(e) => InputFilter(e, 'alfanumerico')}
                            placeholder={getValue('datosPersonales.placeholder.pasaporte')}
                            errorMessage={getValue('datosPersonales.error.pasaporte')}
                        /> :
                        <Input
                            label={getValue('datosPersonales.label.curp')}
                            name="curp"
                            type="text"
                            radius='sm'
                            variant='bordered'
                            classNames={inputStyles}
                            labelPlacement="outside"
                            isRequired
                            className='w-full'
                            onInput={(e) => InputFilter(e, 'alfanumerico')}
                            placeholder={getValue('datosPersonales.placeholder.curp')}
                            errorMessage={getValue('datosPersonales.error.curp')}
                        />
                }
                <div className='w-full text-end'>
                    <ButtonGhost
                        classStyles='text-black-0 text-[16px] leading-6 underline font-bold p-0 border-0'
                        text={getValue('datosPersonales.curp')}
                        href="https://www.gob.mx/curp/"
                        external={true}
                    >
                    </ButtonGhost>
                </div>
            </div>

            {/* Correo */}
            <div className='order-8'>
                <Input
                    label={getValue('datosPersonales.label.correo')}
                    name="email"
                    type="email"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder={getValue('datosPersonales.placeholder.correo')}
                    errorMessage={getValue('datosPersonales.error.correo')}
                />
            </div>
        </Form>
    )
}