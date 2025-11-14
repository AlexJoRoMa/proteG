/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { CheckoutSteps as CheckoutStepsConstants } from '@/constants/CheckoutSteps'
import { useCheckout } from '@/components/providers/CheckoutProvider'
import CheckoutContent from './CheckoutContent'
import { CheckStepIcon, EditIcon } from '@/constants/IconsConstants'
import ResumenContainer from '@/components/molecules/checkout/resumenContainer'

const CheckoutSteps = () => {
  const stepsArray = Object.values(CheckoutStepsConstants)
  const { currentStep, goToStep, canGoToStep, nextStep, prevStep, totalSteps } = useCheckout()

  return (
    <>
      <div className="px-[var(--spacing-sm)] 4xl:px-[var(--spacing-xl)] 3xl:px-[var(--spacing-lg)] 2xl:px-[var(--spacing-md)] sm:px-[var(--spacing-sm)] xl:px-0 !w-full">

        {/* Layout unificado que se adapta con Tailwind */}
        <div className='flex flex-col xl:flex-row xl:justify-between items-stretch pt-[24px] pb-[15px] border-gradient-fixed-main w-full'>
          {stepsArray.map((stepName, index) => {
            const stepNumber = index + 1
            const isClickable = canGoToStep(stepNumber)
            const isActive = currentStep === stepNumber
            const isComplete = stepNumber < currentStep

            return (
              <React.Fragment key={index}>
                {/* Step - se adapta automáticamente */}
                <div data-index={index}
                  className={`flex w-full xl:w-[16.6%] gap-[8px] text-center py-2 xl:py-0 xl:items-center xl:justify-between mb-0 pb-0 xl:flex-col flex-row items-center justify-center xl:!border-hidden 
                  ${isActive ? "border-none" : "border-b-2 border-b-gray-100 mb-2 xl:mb-0 xl:pb-0 pb-[18px]"}
                  ${isComplete ? "border-gradient-fixed " : "border-b-2 border-b-gray-100"}
                  ${isClickable ? 'cursor-pointer hover:opacity-75 transition-opacity' : 'cursor-default'
                    }`}
                  onClick={() => isClickable ? goToStep(stepNumber) : undefined}
                >
                  <div className='flex gap-[8px] w-full flex-row xl:flex-col items-center xl:items-center'>
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
                      className={`text-[20px] pl-3 xl:pl-0
                      ${isActive || isComplete ? 'font-semibold text-black-0' : 'font-normal'}
                      xl:text-[clamp(12px, 1.5vw, 20px)] xl:w-[180px] leading-tight
                      ${isActive ? 'text-black-0' : 'text-[#AEAEB5]'}`
                      }
                    >
                      {stepName as string}
                    </h4>
                  </div>
                  {isComplete ? <EditIcon /> : ""}
                </div>

                {/* CheckoutContent - solo en móvil, después del step actual */}
                {currentStep === stepNumber && (
                  <div className={`xl:hidden w-full border-gradient-fixed mb-[8px]`}>
                    <CheckoutContent />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Botones temporales para navegación - TEMPORAL PARA DESARROLLO */}
        {/* <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border z-50">
          <div className="text-sm font-semibold mb-2 text-gray-700">
            Navegación temporal (Step {currentStep} de {totalSteps})
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              ← Anterior
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === totalSteps}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              Siguiente →
            </button>
          </div>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <button
                key={step}
                onClick={() => goToStep(step)}
                disabled={!canGoToStep(step)}
                className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${step === currentStep
                  ? 'bg-blue-500 text-white'
                  : canGoToStep(step)
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div> */}
      </div>

      <div className='block xl:hidden'>
        {/* Espacio para posibles futuros elementos laterales */}
        <div className='h-[190px]'>
          <ResumenContainer />
        </div>
      </div>

    </>

  )
}

export default CheckoutSteps
