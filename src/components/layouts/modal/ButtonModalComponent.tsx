import { Button } from '@heroui/react'
import Link from 'next/link'
import React from 'react'

type ButtonModalComponentProps = {
  url?: string;
  text?: string;
  external?: boolean; // Indica si el enlace es externo
};

const ButtonModalComponent = ({url, text, external}: ButtonModalComponentProps) => {
  return (
    <>
    {
        url && text && (
            <Button href={url}
                    className='bg-black w-full max-w-[230px] xl:max-w-[290px] mx-auto xl:mx-0 h-[48px] hover:border-black hover:border hover:bg-transparent hover:text-black text-white rounded-md text-[18px] font-bold'
                    as={Link}
                    target={external ? '_blank' : '_self'} // Si es externo, abre en nueva pestaña
                    rel={external ? 'noopener noreferrer' : undefined} // Añade seguridad para enlaces externos
                    >
                {text}
            </Button>
        )
    }
    </>
  )
}

export default ButtonModalComponent
