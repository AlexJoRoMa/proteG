import Step1 from '@/components/molecules/checkout/Step1'
import Step2 from '@/components/molecules/checkout/Step2'
import Step3 from '@/components/molecules/checkout/Step3'
import Step4 from '@/components/molecules/checkout/Step4'
import Step5 from '@/components/molecules/checkout/Step5'
import Step6 from '@/components/molecules/checkout/Step6'
import React from 'react'
import { useCheckout } from '@/components/providers/CheckoutProvider'

const CheckoutContent = () => {
  const { currentStep } = useCheckout()

  const stepContents = [
    <Step1 key="step1" />,
    <Step2 key="step2" />,
    <Step3 key="step3" />,
    <Step4 key="step4" />,
    <Step5 key="step5" />,
    <Step6 key="step6" />
  ]

  return (
    <div className='mt-6 flex mx-[var(--spacing-sm)] 4xl:mx-[var(--spacing-xl)] 3xl:mx-[var(--spacing-lg)] 2xl:mx-[var(--spacing-md)] sm:mx-[var(--spacing-sm)]'>
      <div className='xl:w-8/12 mr-auto inline-block'>
        {
          stepContents.map((content, index) => (
            <div data-step={index + 1} key={index} className={`${index + 1 === currentStep ? 'block' : 'hidden'}`}>
              {content}
            </div>
          ))
        }
      </div>
      <div className='xl:w-3/12 hidden sm:inline-block'>
        elemento lateral
        {/* Espacio para posibles futuros elementos laterales */}
      </div>
    </div>

  )
}

export default CheckoutContent
