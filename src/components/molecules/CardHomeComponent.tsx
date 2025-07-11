import React from 'react'
import Image from 'next/image'
import ButtonGhost from '../atoms/ButtonGhost'

const CardHomeComponent = () => {
  return (
    <div className='h-[785px] max-h-[785px] flex-col rounded-md'>
        <Image 
          src="https://images.ctfassets.net/lx4ov5kud2ld/DRLtKgFYQOWIl06Y4tLuX/e162d9d44048f19cba09e8d1ea430f26/card1.webp"
          alt="Home Module TV"
          width={384}
          height={216}
          priority
          className="w-full object-cover h-[216px] rounded-t-md"
        />
        <div className='px-6 py-8 bg-(--color-gray-450) h-[calc(785px-216px)] flex flex-col text-white'>
            <p className='font-bold text-2xl leading-8 mb-4 '>
                    contrata 100 y navega por 150 megas durante 6 meses
            </p>
            <p className='mb-4'>
                <span className='align-bottom'>Desde</span>
                <span className='font-bold text-[56px]'>$850</span>
                <span className='align-bottom'>al mes</span>
            </p>
            <p className='mb-6'>
                Precio con promoción solo el primer mes. Incluye $50 de descuento por domiciliar. Incluye:
            </p>
            <div className='grid-cols-4 grid-rows-2 gap-4'>
                
            </div>
            <div className='mt-auto'>
                <ButtonGhost classStyles='w-full mb-4' text='más info' />
                <ButtonGhost classStyles='w-full' text='contratar ahora' />
            </div>
        </div>
    </div>
  )
}

export default CardHomeComponent
