import Step1 from '@/components/molecules/checkout/Step1'
import Step2 from '@/components/molecules/checkout/Step2'
import Step3 from '@/components/molecules/checkout/Step3'
import Step4 from '@/components/molecules/checkout/Step4'
import Step5 from '@/components/molecules/checkout/Step5'
import Step6 from '@/components/molecules/checkout/Step6'
import React from 'react'
import { useCheckout } from '@/components/providers/CheckoutProvider'
import ResumenContainer from '@/components/molecules/checkout/resumenContainer'
import { useIzziContent } from '@/components/providers/IzziProvider'

const CheckoutContent = () => {
  const { globalFlagDomicilio } = useIzziContent();
  const { currentStep } = useCheckout()

  const stepContents = [
    <Step1 key="step1" />,
    <Step2 key="step2" />,
    <Step3 key="step3" showWhatsApp={false} />,
    <Step4 key="step4" />,
    <Step5 key="step5" />,
    <Step6 key="step6" />
  ];

    const stepContentsDelivery = [
    <Step1 key="step1" />,
    <Step2 key="step2" />,
    <Step3 key="step3" showWhatsApp={false} />,
    <Step4 key="step4" />,
    <Step6 key="step5" />
  ];

  const contentSteps = globalFlagDomicilio ? stepContentsDelivery : stepContents;

  return (
    <div className='my-6 flex mx-[var(--spacing-sm)] 4xl:mx-[var(--spacing-xl)] 3xl:mx-[var(--spacing-lg)] 2xl:mx-[var(--spacing-md)] sm:mx-[var(--spacing-sm)]'>
      <div className='w-full min-[1280px]:w-7/12 mr-auto block'>
        {
          contentSteps.map((content, index) => (
            <div data-step={index + 1} key={index} className={`${index + 1 === currentStep ? 'block' : 'hidden'}`}>
              {content}
            </div>
          ))
        }
      </div>
      <div className='min-[1280px]:w-4/12 hidden min-[1280px]:block'>
        {/* Espacio para posibles futuros elementos laterales */}
        <ResumenContainer />
      </div>
    </div>

  )
}

export default CheckoutContent
