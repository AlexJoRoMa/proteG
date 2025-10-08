'use client'

import { Form, Input } from "@heroui/react";
import Link from "next/link";
import { FC, RefObject } from "react";
import { inputStyles } from "@/constants/StylesConstants";
import { InputFilter } from "@/utils/inputFilters";
import ButtonGhost from "@/components/atoms/ButtonGhost";

interface Props {
    formRef: RefObject<HTMLFormElement | null>
    esExtrangero: boolean
}

export const DatosPersonalesForm: FC<Props> = ({ formRef, esExtrangero }) => {

    return (
        <Form
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
        >
            {/* Nombre */}
            <div className='order-1'>
                <Input
                    label="Nombre"
                    name="firstName"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder='Ingresa tu nombre'
                    errorMessage='Ingresa un nombre válido'
                    onInput={(e) => InputFilter(e, 'letras')}
                />
            </div>

            {/* Segundo nombre */}
            <div className='order-2'>
                <Input
                    label="Segundo Nombre"
                    name="secondName"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    className='w-full'
                    placeholder='Ingresa tu segundo nombre'
                    onInput={(e) => InputFilter(e, 'letras')}
                />
            </div>

            {/* Apellido paterno */}
            <div className='order-3'>
                <Input
                    label="Apellido paterno"
                    name="firstLastName"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder='Ingresa tu apellido paterno'
                    errorMessage='Ingresa un apellido válido'
                    onInput={(e) => InputFilter(e, 'letras')}
                />
            </div>

            {/* Apellido materno */}
            <div className='order-4'>
                <Input
                    label="Apellido materno"
                    name="secondLastName"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder='Ingresa tu apellido materno'
                    errorMessage='Ingresa un apellido válido'
                    onInput={(e) => InputFilter(e, 'letras')}
                />
            </div>

            {/* Teléfono */}
            <div className='order-5'>
                <Input
                    label="Número de teléfono"
                    name="phone"
                    type="tel"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder='Ingresa un número'
                    errorMessage='Ingresa un número válido'
                    onInput={(e) => InputFilter(e, 'numeros')}
                />
            </div>

            {/* Telefono adicional */}
            <div className='order-6'>
                <Input
                    label="Teléfono adicional"
                    name="aditionalTel"
                    type="tel"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    className='w-full'
                    placeholder='Ingresa un número'
                    onInput={(e) => InputFilter(e, 'numeros')}
                />
            </div>

            {/* CURP */}
            <div className='order-7'>
                {
                    esExtrangero ?
                        <Input
                            label="Número de pasaporte o licencia de manejo"
                            name="passport"
                            type="text"
                            radius='sm'
                            variant='bordered'
                            classNames={inputStyles}
                            labelPlacement="outside"
                            isRequired
                            className='w-full'
                            onInput={(e) => InputFilter(e, 'alfanumerico')}
                            placeholder='Ingresa tu número de pasaporte o licencia'
                            errorMessage='Ingresa un número de pasaporte o licencia válido'
                        /> :
                        <Input
                            label="CURP"
                            name="curp"
                            type="text"
                            radius='sm'
                            variant='bordered'
                            classNames={inputStyles}
                            labelPlacement="outside"
                            isRequired
                            className='w-full'
                            onInput={(e) => InputFilter(e, 'alfanumerico')}
                            placeholder='GOGM900305HSRMPV59'
                            errorMessage='Ingresa un CURP válido'
                        />
                }
                <div className='w-full text-end'>
                    <ButtonGhost
                        classStyles='text-black-0 text-[16px] leading-6 underline font-bold p-0 border-0'
                        text={"¿No recuerdas tu CURP?"}
                        href="https://www.gob.mx/curp/"
                        external={true}
                    >
                    </ButtonGhost>
                </div>
            </div>

            {/* Correo */}
            <div className='order-8'>
                <Input
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder='Ingresa un correo'
                    errorMessage='Ingresa un correo válido'
                />
            </div>
        </Form>
    )
}