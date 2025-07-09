"use client"

import { Button } from '@heroui/react'

type ButtonProps = {
   classStyles:string,
   text:string
}

const ButtonGhost = ({classStyles, text}:ButtonProps) => {
  return (
    <>
        <Button color="primary" variant="ghost"
        className={classStyles}
        data-hover="ghost">
          {text}
        </Button>
    </>
  )
}

export default ButtonGhost
