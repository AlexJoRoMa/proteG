/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useCheckout } from "@/components/providers/CheckoutProvider";
import { inputStyles } from "@/constants/StylesConstants";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { DatosContratacion } from "@/types/Contratacion";
import { Form, Input, Switch, Textarea } from "@heroui/react";
import { FC, RefObject } from "react";

interface Props {
    formRef: RefObject<HTMLFormElement | null>;
}

export const DireccionEnvioForm: FC<Props> = ({ formRef }) => {
    const { getValue } = useMicrocopies('formulario-datosInstalacion');
    const { datosContratacion } = useCheckout();

    const envio: Partial<DatosContratacion> = datosContratacion ?? {};
    const datosEnvio = envio.DatosPersonales?.instalacion;


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
                defaultValue={datosEnvio?.street}
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
                placeholder={getValue('instalacion.placeholder.referencia')}
                defaultValue={datosEnvio?.reference}
            />
        </Form>
    )
}