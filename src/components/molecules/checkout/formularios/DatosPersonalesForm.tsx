'use client'

import { Form, Input } from "@heroui/react";
import { FC, RefObject, useEffect, useState } from "react";
import { inputStyles } from "@/constants/StylesConstants";
import { InputFilter, validateCurp, validatePassport } from "@/utils/inputFilters";
import ButtonGhost from "@/components/atoms/ButtonGhost";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { useCheckout } from "@/components/providers/CheckoutProvider";
import { DatosContratacion } from "@/types/Contratacion";

interface Props {
    formRef: RefObject<HTMLFormElement | null>
    esExtrangero: boolean
    setIsValid: (valid: boolean) => void
}

export const DatosPersonalesForm: FC<Props> = ({ formRef, esExtrangero, setIsValid }) => {
    const { datosContratacion } = useCheckout();
    const { getValue } = useMicrocopies('formulario-datosPersonales');

    const personal: Partial<DatosContratacion> = datosContratacion ?? {};
    const datosPersonales = personal.DatosPersonales?.personal;

    const [curp, setCurp] = useState(datosPersonales?.curp ?? "");
    const [passport, setPassport] = useState(datosPersonales?.passport ?? "");
    const [passportValid, setPassportValid] = useState<boolean>(true);
    const [curpValid, setCurpValid] = useState<boolean>(true);
    
    // Estados para validación individual de campos
    const [firstName, setFirstName] = useState(datosPersonales?.firstName ?? "");
    const [secondName, setSecondName] = useState(datosPersonales?.secondName ?? "");
    const [firstLastName, setFirstLastName] = useState(datosPersonales?.firstLastName ?? "");
    const [secondLastName, setSecondLastName] = useState(datosPersonales?.secondLastName ?? "");
    const [phone, setPhone] = useState(datosPersonales?.phone ?? "");
    const [aditionalTel, setAditionalTel] = useState(datosPersonales?.aditionalTel ?? "");
    const [email, setEmail] = useState(datosPersonales?.email ?? "");

    useEffect(() => {
        if (esExtrangero) {
            setPassport(datosPersonales?.passport ?? "");
            setCurp("");
        } else {
            setCurp(datosPersonales?.curp ?? "");
            setPassport("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [esExtrangero]);

    // Validar el formulario completo cuando cambien los valores
    useEffect(() => {
        const isFormValid = 
            firstName.trim() !== '' &&
            firstLastName.trim() !== '' &&
            secondLastName.trim() !== '' &&
            phone.trim() !== '' && phone.length === 10 &&
            email.trim() !== '' && email.includes('@') &&
            (esExtrangero ? (passport.trim() !== '' && passportValid) : (curp.trim() !== '' && curpValid));

        setIsValid(isFormValid);
    }, [firstName, firstLastName, secondLastName, phone, email, curp, passport, curpValid, passportValid, esExtrangero, setIsValid]);

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
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    isInvalid={firstName.trim() === ''}
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
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
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
                    value={firstLastName}
                    onChange={(e) => setFirstLastName(e.target.value)}
                    isInvalid={firstLastName.trim() === ''}
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
                    value={secondLastName}
                    onChange={(e) => setSecondLastName(e.target.value)}
                    isInvalid={secondLastName.trim() === ''}
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
                    maxLength={10}
                    placeholder={getValue('datosPersonales.placeholder.telefono')}
                    errorMessage={getValue('datosPersonales.error.telefono')}
                    onInput={(e) => InputFilter(e, 'numeros')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    isInvalid={phone.trim() === '' || phone.length < 10}
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
                    maxLength={10}
                    placeholder={getValue('datosPersonales.placeholder.telefono')}
                    onInput={(e) => InputFilter(e, 'numeros')}
                    value={aditionalTel}
                    onChange={(e) => setAditionalTel(e.target.value)}
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
                            minLength={7}
                            maxLength={13}
                            value={passport}
                            onChange={(e) => {
                                const value = e.target.value;
                                const clean = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '');
                                setPassport(clean);

                                const { isValid } = validatePassport(clean);
                                setPassportValid(isValid);
                            }}
                            placeholder={getValue('datosPersonales.placeholder.pasaporte')}
                            errorMessage={getValue('datosPersonales.error.pasaporte')}
                            isInvalid={!passportValid || passport.trim() === ''}
                            onBlur={(e) => {
                                const { clean, isValid } = validatePassport(e.target.value);
                                e.target.value = clean;

                                setPassport(clean);
                                setPassportValid(isValid);
                            }}
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
                            maxLength={18}
                            value={curp}
                            onChange={(e) => {
                                const value = e.target.value;
                                const clean = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '');
                                setCurp(clean);

                                const { isValid } = validateCurp(clean);
                                setCurpValid(isValid);
                            }}
                            placeholder={getValue('datosPersonales.placeholder.curp')}
                            errorMessage={getValue('datosPersonales.error.curp')}
                            isInvalid={!curpValid || curp.trim() === ''}
                            onBlur={(e) => {
                                const { clean, isValid } = validateCurp(e.target.value);
                                e.target.value = clean;

                                setCurp(clean);
                                setCurpValid(isValid);
                            }}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={email.trim() === '' || !email.includes('@')}
                />
            </div>
        </Form>
    )
}