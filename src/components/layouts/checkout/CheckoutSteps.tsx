import React from 'react'

const CheckoutSteps = () => {
  return (
    <div className='flex flex-col gap-[18px] md:gap-0 md:flex-row justify-between  md:items-center py-6 border-gradient-fixed-main mx-[var(--spacing-sm)]
                    4xl:mx-[var(--spacing-xl)] 3xl:mx-[var(--spacing-lg)] 2xl:mx-[var(--spacing-md)] sm:mx-[var(--spacing-sm)]'>
        <div className='flex text-center pb-[18px] mb-2 md:mb-0 md:pb-0 py-2 md:py-0 md:flex-col flex-row items-center md:!border-hidden border-gradient-fixed'>
            <span className='rounded-full w-8 h-8 flex justify-center items-center bg-gray-50'>1</span>
            <h4 className='text-[18px]  pl-3 md:pl-0 font-bold md:font-normal md:text-[clamp(12px,1.5vw,20px)]'>Paquete seleccionado</h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none" className='md:hidden ml-auto'>
            <path d="M0.666992 26.9997V24.333H27.3337V26.9997H0.666992ZM6.00033 17.4357H7.43099L19.1643 5.70999L18.4543 4.97399L17.726 4.27133L6.00033 16.0047V17.4357ZM4.66699 18.769V15.4357L19.626 0.484326C19.7678 0.342326 19.9229 0.238882 20.0913 0.173993C20.2598 0.109104 20.4313 0.0766602 20.606 0.0766602C20.7807 0.0766602 20.9499 0.109104 21.1137 0.173993C21.2774 0.238882 21.4328 0.344883 21.5797 0.491994L22.9517 1.87133C23.0985 2.01333 23.2032 2.16688 23.2657 2.33199C23.3281 2.49733 23.3593 2.66811 23.3593 2.84433C23.3593 3.00944 23.3268 3.17755 23.2617 3.34866C23.1968 3.51977 23.0934 3.6761 22.9517 3.81766L8.00033 18.769H4.66699ZM19.1643 5.70999L18.4543 4.97399L17.726 4.27133L19.1643 5.70999Z" fill="#1C1B1F"/>
            </svg>
        </div>
        <div className='flex text-center pb-[18px] mb-2 md:mb-0 md:pb-0 py-2 md:py-0 md:flex-col flex-row items-center md:!border-hidden border-gradient-fixed'>
            <span className='rounded-full w-8 h-8 flex justify-center items-center bg-gray-50'>2</span>
            <h4 className='text-[18px] pl-3 md:pl-0 font-bold md:font-normal md:text-[clamp(12px,1.5vw,20px)]'>Datos personales</h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none" className='md:hidden ml-auto'>
            <path d="M0.666992 26.9997V24.333H27.3337V26.9997H0.666992ZM6.00033 17.4357H7.43099L19.1643 5.70999L18.4543 4.97399L17.726 4.27133L6.00033 16.0047V17.4357ZM4.66699 18.769V15.4357L19.626 0.484326C19.7678 0.342326 19.9229 0.238882 20.0913 0.173993C20.2598 0.109104 20.4313 0.0766602 20.606 0.0766602C20.7807 0.0766602 20.9499 0.109104 21.1137 0.173993C21.2774 0.238882 21.4328 0.344883 21.5797 0.491994L22.9517 1.87133C23.0985 2.01333 23.2032 2.16688 23.2657 2.33199C23.3281 2.49733 23.3593 2.66811 23.3593 2.84433C23.3593 3.00944 23.3268 3.17755 23.2617 3.34866C23.1968 3.51977 23.0934 3.6761 22.9517 3.81766L8.00033 18.769H4.66699ZM19.1643 5.70999L18.4543 4.97399L17.726 4.27133L19.1643 5.70999Z" fill="#1C1B1F"/>
            </svg>
        </div>
        <div className='flex text-center pb-[18px] mb-2 md:mb-0 md:pb-0 py-2 md:py-0 md:flex-col flex-row items-center md:!border-hidden border-gradient-fixed'>
            <span className='rounded-full w-8 h-8 flex justify-center items-center bg-gray-50'>3</span>
            <h4 className='text-[18px] pl-3 md:pl-0 font-bold md:font-normal md:text-[clamp(12px,1.5vw,20px)]'>Documentos del titular</h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none" className='md:hidden ml-auto'>
            <path d="M0.666992 26.9997V24.333H27.3337V26.9997H0.666992ZM6.00033 17.4357H7.43099L19.1643 5.70999L18.4543 4.97399L17.726 4.27133L6.00033 16.0047V17.4357ZM4.66699 18.769V15.4357L19.626 0.484326C19.7678 0.342326 19.9229 0.238882 20.0913 0.173993C20.2598 0.109104 20.4313 0.0766602 20.606 0.0766602C20.7807 0.0766602 20.9499 0.109104 21.1137 0.173993C21.2774 0.238882 21.4328 0.344883 21.5797 0.491994L22.9517 1.87133C23.0985 2.01333 23.2032 2.16688 23.2657 2.33199C23.3281 2.49733 23.3593 2.66811 23.3593 2.84433C23.3593 3.00944 23.3268 3.17755 23.2617 3.34866C23.1968 3.51977 23.0934 3.6761 22.9517 3.81766L8.00033 18.769H4.66699ZM19.1643 5.70999L18.4543 4.97399L17.726 4.27133L19.1643 5.70999Z" fill="#1C1B1F"/>
            </svg>
        </div>
        <div className='flex text-center pb-[18px] mb-2 md:mb-0 md:pb-0 py-2 md:py-0 md:flex-col flex-row items-center md:!border-hidden border-gradient-fixed'>
            <span className='rounded-full w-8 h-8 flex justify-center items-center bg-gray-50'>4</span>
            <h4 className='text-[18px] pl-3 md:pl-0 font-bold md:font-normal md:text-[clamp(12px,1.5vw,20px)]'>Verificación de contacto</h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none" className='md:hidden ml-auto'>
            <path d="M0.666992 26.9997V24.333H27.3337V26.9997H0.666992ZM6.00033 17.4357H7.43099L19.1643 5.70999L18.4543 4.97399L17.726 4.27133L6.00033 16.0047V17.4357ZM4.66699 18.769V15.4357L19.626 0.484326C19.7678 0.342326 19.9229 0.238882 20.0913 0.173993C20.2598 0.109104 20.4313 0.0766602 20.606 0.0766602C20.7807 0.0766602 20.9499 0.109104 21.1137 0.173993C21.2774 0.238882 21.4328 0.344883 21.5797 0.491994L22.9517 1.87133C23.0985 2.01333 23.2032 2.16688 23.2657 2.33199C23.3281 2.49733 23.3593 2.66811 23.3593 2.84433C23.3593 3.00944 23.3268 3.17755 23.2617 3.34866C23.1968 3.51977 23.0934 3.6761 22.9517 3.81766L8.00033 18.769H4.66699ZM19.1643 5.70999L18.4543 4.97399L17.726 4.27133L19.1643 5.70999Z" fill="#1C1B1F"/>
            </svg>
        </div>
        <div className='flex text-center pb-[18px] mb-2 md:mb-0 md:pb-0 py-2 md:py-0 md:flex-col flex-row items-center md:!border-hidden border-gradient-fixed'>
            <span className='rounded-full w-8 h-8 flex justify-center items-center bg-gray-50'>5</span>
            <h4 className='text-[18px] pl-3 md:pl-0 font-bold md:font-normal md:text-[clamp(12px,1.5vw,20px)]'>Fecha y hora de instalación</h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none" className='md:hidden ml-auto'>
            <path d="M0.666992 26.9997V24.333H27.3337V26.9997H0.666992ZM6.00033 17.4357H7.43099L19.1643 5.70999L18.4543 4.97399L17.726 4.27133L6.00033 16.0047V17.4357ZM4.66699 18.769V15.4357L19.626 0.484326C19.7678 0.342326 19.9229 0.238882 20.0913 0.173993C20.2598 0.109104 20.4313 0.0766602 20.606 0.0766602C20.7807 0.0766602 20.9499 0.109104 21.1137 0.173993C21.2774 0.238882 21.4328 0.344883 21.5797 0.491994L22.9517 1.87133C23.0985 2.01333 23.2032 2.16688 23.2657 2.33199C23.3281 2.49733 23.3593 2.66811 23.3593 2.84433C23.3593 3.00944 23.3268 3.17755 23.2617 3.34866C23.1968 3.51977 23.0934 3.6761 22.9517 3.81766L8.00033 18.769H4.66699ZM19.1643 5.70999L18.4543 4.97399L17.726 4.27133L19.1643 5.70999Z" fill="#1C1B1F"/>
            </svg>
        </div>
        <div className='flex text-center pb-[18px] mb-2 md:mb-0 md:pb-0 py-2 md:py-0 md:flex-col flex-row items-center md:!border-hidden border-gradient-fixed'>
            <span className='rounded-full w-8 h-8 flex justify-center items-center bg-gray-50'>6</span>
            <h4 className='text-[18px] pl-3 md:pl-0 font-bold md:font-normal md:text-[clamp(12px,1.5vw,20px)]'>Pago</h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none" className='md:hidden ml-auto'>
            <path d="M0.666992 26.9997V24.333H27.3337V26.9997H0.666992ZM6.00033 17.4357H7.43099L19.1643 5.70999L18.4543 4.97399L17.726 4.27133L6.00033 16.0047V17.4357ZM4.66699 18.769V15.4357L19.626 0.484326C19.7678 0.342326 19.9229 0.238882 20.0913 0.173993C20.2598 0.109104 20.4313 0.0766602 20.606 0.0766602C20.7807 0.0766602 20.9499 0.109104 21.1137 0.173993C21.2774 0.238882 21.4328 0.344883 21.5797 0.491994L22.9517 1.87133C23.0985 2.01333 23.2032 2.16688 23.2657 2.33199C23.3281 2.49733 23.3593 2.66811 23.3593 2.84433C23.3593 3.00944 23.3268 3.17755 23.2617 3.34866C23.1968 3.51977 23.0934 3.6761 22.9517 3.81766L8.00033 18.769H4.66699ZM19.1643 5.70999L18.4543 4.97399L17.726 4.27133L19.1643 5.70999Z" fill="#1C1B1F"/>
            </svg>
        </div>
    </div>
  )
}

export default CheckoutSteps
