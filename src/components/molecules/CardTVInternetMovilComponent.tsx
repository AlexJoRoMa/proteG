import React from 'react'
import Image from 'next/image'
import ButtonGhost from '../atoms/ButtonGhost'

const CardTVInternetMovilComponent = () => {
  return (
    <div className='px-[16px] md:px-[24px] py-[32px] bg-white w-[384px] h-[596px] rounded-md relative'>
        <div className=' rounded-t-md px-6 py-1 mb-[32px] text-[20px] leading-6 w-full text-center text-white bg-[#FF6C07]'>
            la más vendida
        </div>
        <div className='flex mb-[24px]'>
            <Image
                src=""
                alt="Imagen x"
                width={32}
                height={32}
                className=""
                priority
            />
            <h3>internet de 80 a 100 mb</h3>
        </div>
        <hr className='text-[#FF6C07] mb-[24px]' />
        <p className='line-through text-(--color-gray-200) text-[24px] leading-[32px]'>$510</p>
        <span className='text-[16px] leading-[24px]'>desde</span>
        <span className='text-[56px] font-bold mb-[24px]'>$850</span>
        <span className='text-[16px] leading-[24px]'>al mes</span>
        <p className='text-[16px] leading-[24px]'>Precio con promoción por tres meses. 
        Contrato a 12 meses. Incluye $50 de descuento por domiciliar. Además incluye:</p>
        <div className='grid grid-cols-4 grid-rows-2 gap-4 mb-[32px]'>
            {/*TODO FALTAN IMAGENES */}
        </div>
        <div className='mt-auto'>
            <ButtonGhost classStyles='w-full mb-4 border-[1px solid black] rounded-md text-black text-[16px] md:text-[18px] font-bold'
                 text="saber más" href="#" />
            <ButtonGhost classStyles='w-full rounded-md bg-black text-white border-none font-bold text-[16px] md:text-[18px]'
                text="contratar ahora" href="#" />
        </div>
    </div>
  )
}

export default CardTVInternetMovilComponent
