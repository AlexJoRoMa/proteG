'use client'

import { inputStyles } from "@/constants/StylesConstants";
import { Form, Input, Switch, Textarea } from "@heroui/react";
import { FC, RefObject } from "react";

interface Props {
    formRef: RefObject<HTMLFormElement | null>;
}

export const DireccionEnvioForm: FC<Props> = ({ formRef }) => (
    <Form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'
    >
        <Input
            label="Entre las calles:"
            name="street"
            type="text"
            variant='bordered'
            radius='sm'
            classNames={inputStyles}
            labelPlacement="outside"
            className='w-full !mt-[34px]'
            placeholder='indica las calles entre las que se encuentra'
        />
        <Textarea
            label="Referencia"
            name="reference"
            type="textarea"
            variant='bordered'
            radius='sm'
            classNames={inputStyles}
            labelPlacement="outside"
            className='w-full'
            placeholder='indica alguna referencia para nuestro técnico, por ejemplo: “casa a un lado del Oxxo”.'
        />
    </Form>

)