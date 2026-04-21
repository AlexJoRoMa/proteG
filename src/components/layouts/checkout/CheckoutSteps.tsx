/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { CheckoutStepsDomiciliado, CheckoutStepsNoDomiciliado } from '@/constants/CheckoutSteps'
import { useCheckout } from '@/components/providers/CheckoutProvider'
import CheckoutContent from './CheckoutContent'
import { CheckStepIcon, EditIcon } from '@/constants/IconsConstants'
import ResumenContainer from '@/components/molecules/checkout/resumenContainer'
import { useIzziContent } from '@/components/providers/IzziProvider'

interface CheckoutStepsProps {
  isDesktop: boolean;
}

const CheckoutSteps = ({ isDesktop }: CheckoutStepsProps) => {
  const { globalFlagDomicilio } = useIzziContent();
  const { currentStep, goToStep, canGoToStep, nextStep, prevStep, totalSteps } = useCheckout()

  const CheckoutStepsConstants = globalFlagDomicilio ? CheckoutStepsDomiciliado : CheckoutStepsNoDomiciliado;
  const stepsArray = Object.values(CheckoutStepsConstants)

  return (
    <>
      <div className="px-[var(--spacing-sm)] 4xl:px-[var(--spacing-xl)] 3xl:px-[var(--spacing-lg)] 2xl:px-[var(--spacing-md)] sm:px-[var(--spacing-sm)] min-[1280px]:px-0 !w-full">

        {/* Layout unificado que se adapta con Tailwind */}
        <div className='flex flex-col min-[1280px]:flex-row min-[1280px]:justify-between items-stretch pt-[24px] pb-[15px] border-gradient-fixed-main w-full'>
          {stepsArray.map((stepName, index) => {
            const stepNumber = index + 1
            const isClickable = canGoToStep(stepNumber)
            const isActive = currentStep === stepNumber
            const isComplete = stepNumber < currentStep

            return (
              <React.Fragment key={index}>
                {/* Step - se adapta automáticamente */}
                <div data-index={index}
                  className={`flex w-full min-[1280px]:w-[16.6%] gap-[8px] text-center py-2 min-[1280px]:py-0 min-[1280px]:items-center min-[1280px]:justify-between mb-0 pb-0 min-[1280px]:flex-col flex-row items-center justify-center min-[1280px]:!border-hidden
                  ${isActive ? "border-none" : "border-b-2 border-b-gray-100 mb-2 min-[1280px]:mb-0 min-[1280px]:pb-0 pb-[18px]"}
                  ${isComplete ? "border-gradient-fixed " : "border-b-2 border-b-gray-100"}
                  ${isClickable ? 'cursor-pointer hover:opacity-75 transition-opacity' : 'cursor-default'
                    }`}
                  onClick={() => isClickable ? goToStep(stepNumber) : undefined}
                >
                  <div className='flex gap-[8px] w-full flex-row min-[1280px]:flex-col items-center min-[1280px]:items-center'>
                    {isComplete ? (
                      <span className='rounded-full w-8 h-8 flex justify-center items-center bg-gray-450'>
                        <CheckStepIcon />
                      </span>
                    ) : (
                      <span className={`rounded-full w-8 h-8 flex justify-center items-center ${isActive ? 'bg-gray-50 text-black-0 font-bold' : 'bg-gray-50 text-[#AEAEB5]'}`}>
                        {stepNumber}
                      </span>
                    )}
                    <h4
                      className={`text-[20px] pl-3 min-[1280px]:pl-0
                      ${isActive || isComplete ? 'font-semibold text-black-0' : 'font-normal'}
                      min-[1280px]:text-[clamp(12px,_1.5vw,_20px)] min-[1280px]:w-[180px] leading-tight
                      ${isActive ? 'text-black-0' : 'text-[#AEAEB5]'}`
                      }
                    >
                      {stepName as string}
                    </h4>
                  </div>
                  {isComplete ? <EditIcon /> : ""}
                </div>

                {/* CheckoutContent - solo en móvil, después del step actual */}
                {!isDesktop && currentStep === stepNumber && (
                  <div className={`min-[1280px]:hidden w-full border-gradient-fixed mb-[8px]`}>
                    <CheckoutContent />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      <div className='block min-[1280px]:hidden'>
        {/* Espacio para posibles futuros elementos laterales */}
        <div className='h-[190px]'>
          <ResumenContainer />
        </div>
      </div>

    </>

  )
}

export default CheckoutSteps
