import React from 'react'

type PriceComponentProps = {
  textBeforePrice?: string;
  textAfterPrice?: string;
  price?: string;
};

const PriceComponent = ({textBeforePrice, textAfterPrice, price}: PriceComponentProps) => {
  return (
    <>
    <div>
        <span className='align-bottom xl:text-[18px] text-[16px]'>{textBeforePrice as string}</span>
        <span className='font-bold xl:text-[56px] text-[48px]'>{price as string}</span>
        <span className='align-bottom xl:text-[18px] text-[16px]'>{textAfterPrice as string}</span>
    </div>

    </>
  )
}

export default PriceComponent
