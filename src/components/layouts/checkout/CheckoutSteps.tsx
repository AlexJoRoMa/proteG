/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { CheckoutStepsDomiciliado, CheckoutStepsNoDomiciliado } from '@/constants/CheckoutSteps'
import { useCheckout } from '@/components/providers/CheckoutProvider'
import { CheckStepIcon, EditIcon } from '@/constants/IconsConstants'
import { useIzziContent } from '@/components/providers/IzziProvider'

interface CheckoutStepsProps {
  variant: 'mobile' | 'desktop';
  activeStepContent?: React.ReactNode;
}

const CheckoutSteps = ({ variant, activeStepContent }: CheckoutStepsProps) => {
  const { globalFlagDomicilio } = useIzziContent();
  const { currentStep, goToStep, canGoToStep } = useCheckout()
  const isMobile = variant === 'mobile';

  const checkoutSteps = globalFlagDomicilio ? CheckoutStepsDomiciliado : CheckoutStepsNoDomiciliado;
  const stepsArray = Object.values(checkoutSteps)

  return (
    <div className="px-[var(--spacing-sm)] 4xl:px-[var(--spacing-xl)] 3xl:px-[var(--spacing-lg)] 2xl:px-[var(--spacing-md)] sm:px-[var(--spacing-sm)] xl:px-0 !w-full">
      <div className={`${isMobile ? 'flex flex-col items-stretch' : 'flex justify-between items-stretch'} pt-[24px] pb-[15px] border-gradient-fixed-main w-full`}>
        {stepsArray.map((stepName, index) => {
          const stepNumber = index + 1
          const isClickable = canGoToStep(stepNumber)
          const isActive = currentStep === stepNumber
          const isComplete = stepNumber < currentStep
          const stepStateClasses = isActive
            ? 'border-none'
            : isComplete
              ? 'border-gradient-fixed'
              : 'border-b-1 border-b-gray-100'
          const stepSpacingClasses = isMobile ? 'mb-2 pb-[18px]' : 'mb-0 pb-0'
        return (
            <React.Fragment key={index}>
              <div
                data-index={index}
                className={`flex gap-[8px] text-center ${isMobile ? 'w-full py-2 flex-row items-center justify-center' : 'w-[16.6%] py-0 flex-col items-center justify-between'} ${isMobile ? stepStateClasses : ''} ${stepSpacingClasses} ${isClickable ? 'cursor-pointer hover:opacity-75 transition-opacity' : 'cursor-default'}`}
                onClick={() => isClickable ? goToStep(stepNumber) : undefined}
              >
                <div className={`flex gap-[8px] w-full ${isMobile ? 'flex-row items-center' : 'flex-col items-center'}`}>
                  {isComplete ? (
                    <span className="rounded-full w-8 h-8 flex justify-center items-center bg-gray-450">
                      <CheckStepIcon />
                    </span>
                  ) : (
                    <span className={`rounded-full w-8 h-8 flex justify-center items-center ${isActive ? 'bg-gray-50 text-black-0 font-bold' : 'bg-gray-50 text-[#AEAEB5]'}`}>
                      {stepNumber}
                    </span>
                  )}

            <h4
                    className={`text-[20px] ${isMobile ? 'pl-3' : 'pl-0 text-[clamp(12px,1.5vw,20px)] w-[180px] leading-tight'} ${isActive || isComplete ? 'font-semibold text-black-0' : 'font-normal'} ${isActive ? 'text-black-0' : 'text-[#AEAEB5]'}`}
                  >
                    {stepName as string}
                  </h4>
                </div>

                {isComplete ? <EditIcon /> : null}
              </div>

      {isMobile && currentStep === stepNumber && activeStepContent ? (
                <div className="w-full border-gradient-fixed mb-[8px]">
                  {activeStepContent}
                </div>
              ) : null}
            </React.Fragment>
          )
        })}
      </div>

    </div>

  )
}

export default CheckoutSteps
