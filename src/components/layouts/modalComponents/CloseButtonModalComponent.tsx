import { ButtonModalComponentProps } from '@/types/ModalComponentTypes'
import { Button } from '@heroui/react'
import React from 'react'


const CloseButtonModalComponent = ({ text, onClose }: ButtonModalComponentProps) => {

    return (
        <>
            {
                text && (
                    <Button
                        onPress={onClose}
                        className='bg-black w-full max-w-[230px] xl:max-w-[290px] mx-auto xl:mx-0 h-[48px] hover:border-black hover:border hover:bg-transparent hover:text-black text-white rounded-md text-[18px] font-bold'
                    >
                        {text}
                    </Button>
                )
            }
        </>
    )
}

export default CloseButtonModalComponent