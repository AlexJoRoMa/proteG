import Step1 from '@/components/molecules/checkout/Step1'
import Step2 from '@/components/molecules/checkout/Step2'
import Step3 from '@/components/molecules/checkout/Step3'
import Step4 from '@/components/molecules/checkout/Step4'
import Step5 from '@/components/molecules/checkout/Step5'
import Step6 from '@/components/molecules/checkout/Step6'
import React from 'react'
import { useCheckout } from '@/components/providers/CheckoutProvider'
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
    <>
      {contentSteps.map((content, index) => (
        <div data-step={index + 1} key={index} className={index + 1 === currentStep ? 'block' : 'hidden'}>
          {content}
        </div>
      ))}
    </>

  )
}

export default CheckoutContent
