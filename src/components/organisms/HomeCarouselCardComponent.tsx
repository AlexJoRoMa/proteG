import React from 'react'
import CardHomeComponent from '../molecules/CardHomeComponent'
import CarouselComponent from '../molecules/CarouselComponent'
import { CarouselProvider } from '@/utils/CarouselProvider'

const HomeCarouselCardComponent = () => {
  
  return (
    <div className='HomeCarouselCardComponent'>
        <CarouselProvider qtyCarousels={1} carouselConfigs={[{ options: { align: 'start' } }]} >
           <CarouselComponent buttons={true} dots={true}>
              <CardHomeComponent />
              <CardHomeComponent />
              <CardHomeComponent />
              <CardHomeComponent />
              <CardHomeComponent />
              <CardHomeComponent />
           </CarouselComponent>
        </CarouselProvider>
    </div>
  )
}

export default HomeCarouselCardComponent
