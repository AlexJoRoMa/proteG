import Image from 'next/image'
import React from 'react'

const CheckoutHeader = () => {
  return (
    <header>
      <div className='flex justify-between md:justify-around items-center py-4 px-4 md:px-0 md:pb-6 md:pt-[52px] border-b border-gray-150 w-screen'>
        <Image 
          src="https://izzipromocionesmx.com/wp-content/uploads/2024/12/cropped-Logo-Izzi.png"
          width={81} 
          height={32} 
          alt="Logo Izzi" 
          className='h-8'
        />
        <h1 
          className='text-xl md:text-[24px] leading-6 md:leading-8 font-semibold text-gray-800'
        >
          Contratación
        </h1>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className='cursor-pointer'>
          <path d="M23.9999 8.00006L8 24M7.99993 8L23.9999 23.9999" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </header>
  )
}

export default CheckoutHeader
