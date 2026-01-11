/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useCheckout } from "@/components/providers/CheckoutProvider";
import { inputStyles } from "@/constants/StylesConstants";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { DatosContratacion } from "@/types/Contratacion";
import { Form, Input, Switch, Textarea } from "@heroui/react";
import { FC, RefObject, useEffect, useState } from "react";

interface Props {
    formRef: RefObject<HTMLFormElement | null>;
    setIsValid: (valid: boolean) => void;
}

export const DireccionEnvioForm: FC<Props> = ({ formRef, setIsValid }) => {
    const { getValue } = useMicrocopies('formulario-datosInstalacion');
    const { datosContratacion } = useCheckout();

    const envio: Partial<DatosContratacion> = datosContratacion ?? {};
    const datosEnvio = envio.DatosPersonales?.instalacion;

    // Estados para controlar los valores de los campos
    const [street, setStreet] = useState(datosEnvio?.street ?? "");
    const [street2, setStreet2] = useState(datosEnvio?.street2 ?? "");
    const [reference, setReference] = useState(datosEnvio?.reference ?? "");

    // Validar el formulario cuando cambien los valores
    useEffect(() => {
        const isFormValid = 
            street.trim() !== '' &&
            street2.trim() !== '' &&
            reference.trim() !== '';

        setIsValid(isFormValid);
    }, [street, street2, reference, setIsValid]);

    return (
        <Form
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
            className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'
        >
            <Input
                label={getValue('instalacion.label.calle')}
                name="street"
                type="text"
                variant='bordered'
                radius='sm'
                classNames={inputStyles}
                labelPlacement="outside"
                className='w-full !mt-[34px]'
                isRequired
                placeholder={getValue('instalacion.placeholder.calle')}
                errorMessage={getValue('instalacion.error.calle')}
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                isInvalid={street.trim() === ''}
            />

            <Input
                label={getValue('instalacion.label.calle2')}
                name="street2"
                type="text"
                variant='bordered'
                radius='sm'
                classNames={inputStyles}
                labelPlacement="outside"
                className='w-full !mt-[34px]'
                isRequired
                placeholder={getValue('instalacion.placeholder.calle2')}
                errorMessage={getValue('instalacion.error.calle2')}
                value={street2}
                onChange={(e) => setStreet2(e.target.value)}
                isInvalid={street2.trim() === ''}
            />
            <Textarea
                label={getValue('instalacion.label.referencia')}
                name="reference"
                type="textarea"
                variant='bordered'
                radius='sm'
                classNames={inputStyles}
                labelPlacement="outside"
                className='w-full'
                isRequired
                errorMessage={getValue('instalacion.error.referencia')}
                placeholder={getValue('instalacion.placeholder.referencia')}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                isInvalid={reference.trim() === ''}
            />
        </Form>
    )
}