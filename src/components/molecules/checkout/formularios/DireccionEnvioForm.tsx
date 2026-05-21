'use client'

import { useCheckout } from "@/components/providers/CheckoutProvider";
import { inputStyles } from "@/constants/StylesConstants";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { DatosContratacion } from "@/types/Contratacion";
import { Form, Input, Textarea } from "@heroui/react";
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

    const getLocalDireccionData = () => {
        if (typeof window === 'undefined') return null
        return JSON.parse(localStorage.getItem('PersistentDireccionData') ?? 'null')
    }
    const [street, setStreet] = useState(() => {
        const local = getLocalDireccionData()
        return local?.street ?? datosEnvio?.street ?? ""
    })
    const [street2, setStreet2] = useState(() => {
        const local = getLocalDireccionData()
        return local?.street2 ?? datosEnvio?.street2 ?? ""
    })
    const [reference, setReference] = useState(() => {
        const local = getLocalDireccionData()
        return local?.reference ?? datosEnvio?.reference ?? ""
    })

    const writeDireccionToLocal = () => {
        localStorage.setItem('PersistentDireccionData', JSON.stringify({
            street,
            street2,
            reference,
        }))
    }

    useEffect(() => {
        const isFormValid = true;

        setIsValid(isFormValid);

        writeDireccionToLocal();

    }, [street, street2, reference]);

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
                placeholder={getValue('instalacion.placeholder.calle')}
                value={street}
                maxLength={40}
                onChange={(e) => {
                    setStreet(e.target.value);
                }}
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
                placeholder={getValue('instalacion.placeholder.calle2')}
                value={street2}
                maxLength={40}
                onChange={(e) => {
                    setStreet2(e.target.value);
                }}
            />

            <Textarea
                label={getValue('instalacion.label.referencia')}
                name="reference"
                variant='bordered'
                radius='sm'
                classNames={inputStyles}
                labelPlacement="outside"
                className='w-full'
                placeholder={getValue('instalacion.placeholder.referencia')}
                value={reference}
                maxLength={40}
                onChange={(e) => {
                    setReference(e.target.value);
                }}
            />
        </Form>
    )
}