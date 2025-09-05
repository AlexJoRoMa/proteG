import { ButtonModalComponentProps } from '@/types/ModalComponentTypes'
import { Button } from '@heroui/react'
import Link from 'next/link'
import React from 'react'


const ButtonModalComponent = ({url, text, external}: ButtonModalComponentProps) => {
  return (
    <>
    {
        url && text && (
          <div className="flex justify-center xl:justify-start w-full">
              <Button href={url}
                    className='bg-black w-full max-w-[230px] xl:max-w-[290px] xl:mx-0 h-[48px] hover:border-black hover:border hover:bg-transparent hover:text-black text-white rounded-md text-[18px] font-bold'
                    as={Link}
                    target={external ? '_blank' : '_self'} // Si es externo, abre en nueva pestaña
                    rel={external ? 'noopener noreferrer' : undefined} // Añade seguridad para enlaces externos
                    >
                {text}
            </Button>
          </div>
        )
    }
    </>
  )
}

export default ButtonModalComponent
