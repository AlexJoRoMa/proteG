import { PriceComponentProps } from '@/types/ModalComponentTypes'
import React from 'react'

const PriceComponent = ({textBeforePrice, textAfterPrice, price, align='vertical'}: PriceComponentProps) => {
  return (
    <>
    <div className={`flex ${align === 'vertical' ? 'justify-start' : align === 'horizontal' ? 'md:relative md:bottom-[90px] xl:bottom-[90px] md:-mb-[90px] md:justify-end' : 'justify-start'} items-baseline flex-wrap`}>
        <span className='align-bottom xl:text-[18px] text-[16px]'>{textBeforePrice as string}</span>
        <span className='font-bold xl:text-[56px] text-[48px]'>{price as string}</span>
        <span className='align-bottom xl:text-[18px] text-[16px]'>{textAfterPrice as string}</span>
    </div>

    </>
  )
}

export default PriceComponent
