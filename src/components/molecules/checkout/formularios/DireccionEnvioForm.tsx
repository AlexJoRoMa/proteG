'use client'

import { inputStyles } from "@/constants/StylesConstants";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { Form, Input, Switch, Textarea } from "@heroui/react";
import { FC, RefObject } from "react";

interface Props {
    formRef: RefObject<HTMLFormElement | null>;
}

export const DireccionEnvioForm: FC<Props> = ({ formRef }) => {
    const { getValue } = useMicrocopies('formulario-datosInstalacion');

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
            />
        </Form>
    )
}