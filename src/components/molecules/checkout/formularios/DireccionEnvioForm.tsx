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

type DireccionData = {
    street: string;
    street2: string;
    reference: string;
}

export const DireccionEnvioForm: FC<Props> = ({ formRef, setIsValid }) => {
    const { getValue } = useMicrocopies('formulario-datosInstalacion');
    const { datosContratacion } = useCheckout();

    const envio: Partial<DatosContratacion> = datosContratacion ?? {};
    const datosEnvio = envio.DatosPersonales?.instalacion;

    const getLocalPropertyByKey = (propertyName: string) => JSON.parse(localStorage.getItem(propertyName) as string) ?? null;

    // Nueva inicializacion de informacion persistente
    const getLocalPersonalData = () => {
        if (typeof window === 'undefined') return null
        return JSON.parse(localStorage.getItem('PersistentPersonalData') ?? 'null')
    }
    const [street, setStreet] = useState(() => {
        const local = getLocalPersonalData()
        return local?.street ?? datosEnvio?.street ?? ""
    })
    const [street2, setStreet2] = useState(() => {
        const local = getLocalPersonalData()
        return local?.street2 ?? datosEnvio?.street2 ?? ""
    })
    const [reference, setReference] = useState(() => {
        const local = getLocalPersonalData()
        return local?.reference ?? datosEnvio?.reference ?? ""
    })

    const [streetTouched, setStreetTouched] = useState(false);
    const [street2Touched, setStreet2Touched] = useState(false);
    const [referenceTouched, setReferenceTouched] = useState(false);

    useEffect(() => {
        const localData: DireccionData = getLocalPropertyByKey('PersistentDireccionData')
        if (!localData) return

        setStreet(localData.street ?? "")
        setStreet2(localData.street2 ?? "")
        setReference(localData.reference ?? "")
    }, [])

    const writeDireccionToLocal = () => {
        localStorage.setItem('PersistentDireccionData', JSON.stringify({
            street,
            street2,
            reference,
        }))
    }

    useEffect(() => {
        const isFormValid =
            street.trim() !== '' &&
            street2.trim() !== '' &&
            reference.trim() !== '';

        setIsValid(isFormValid);

        if (isFormValid) {
            writeDireccionToLocal()
        }
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
                maxLength={40}
                onChange={(e) => {
                    setStreet(e.target.value);
                    setStreetTouched(true);
                }}
                onBlur={() => setStreetTouched(true)}
                isInvalid={streetTouched && street.trim() === ''}
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
                maxLength={40}
                onChange={(e) => {
                    setStreet2(e.target.value);
                    setStreet2Touched(true);
                }}
                onBlur={() => setStreet2Touched(true)}
                isInvalid={street2Touched && street2.trim() === ''}
            />

            <Textarea
                label={getValue('instalacion.label.referencia')}
                name="reference"
                variant='bordered'
                radius='sm'
                classNames={inputStyles}
                labelPlacement="outside"
                className='w-full'
                isRequired
                errorMessage={getValue('instalacion.error.referencia')}
                placeholder={getValue('instalacion.placeholder.referencia')}
                value={reference}
                maxLength={40}
                onChange={(e) => {
                    setReference(e.target.value);
                    setReferenceTouched(true);
                }}
                onBlur={() => setReferenceTouched(true)}
                isInvalid={referenceTouched && reference.trim() === ''}
            />
        </Form>
    )
}