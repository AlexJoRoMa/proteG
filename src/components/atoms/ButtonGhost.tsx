"use client"

import { Button } from '@heroui/react'
import Link from 'next/link'

type ButtonProps = {
   classStyles: string,
   text: string,
   href?: string, // Nueva prop para el enlace
   external?: boolean, // Para enlaces externos
   disabled?: boolean
}

const ButtonGhost = ({classStyles, text, external, href, disabled}:ButtonProps) => {
  return (
    <>
        <Button color="primary" variant="ghost"
        as={Link}
        className={classStyles}
        data-hover="ghost"
        href={href || '#'} // Usa href si está definido, de lo contrario, usa '#'
        target={external ? '_blank' : '_self'} // Si es externo, abre en nueva pestaña
        rel={external ? 'noopener noreferrer' : undefined} // Añade seguridad para enlaces externos
        isDisabled={disabled}
        >
          {text}
        </Button>
    </>
  )
}

export default ButtonGhost
