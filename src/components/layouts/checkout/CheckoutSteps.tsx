import React from 'react'
import { CheckoutSteps as CheckoutStepsConstants } from '@/constants/CheckoutSteps'
import { useCheckout } from '@/components/providers/CheckoutProvider'
import CheckoutContent from './CheckoutContent'

const CheckoutSteps = () => {
  const stepsArray = Object.values(CheckoutStepsConstants)
  const { currentStep, goToStep, canGoToStep, nextStep, prevStep, totalSteps } = useCheckout()

  return (
    <div className="mx-[var(--spacing-sm)] 4xl:mx-[var(--spacing-xl)] 3xl:mx-[var(--spacing-lg)] 2xl:mx-[var(--spacing-md)] sm:mx-[var(--spacing-sm)]">
      
      {/* Layout unificado que se adapta con Tailwind */}
      <div className='flex flex-col gap-[18px] md:gap-0 md:flex-row md:justify-between md:items-center py-6 border-gradient-fixed-main'>
        {stepsArray.map((stepName, index) => {
          const stepNumber = index + 1
          const isClickable = canGoToStep(stepNumber)
          const isActive = currentStep === stepNumber
          
          return (
            <React.Fragment key={index}>
              {/* Step - se adapta automáticamente */}
              <div data-index={index}
                className={`flex text-center pb-[18px] mb-2 md:mb-0 md:pb-0 py-2 md:py-0 md:flex-col flex-row items-center md:!border-hidden border-gradient-fixed ${
                  isClickable ? 'cursor-pointer hover:opacity-75 transition-opacity' : 'cursor-default'
                }`}
                onClick={() => isClickable ? goToStep(stepNumber) : undefined}
              >
                <span className={`rounded-full w-8 h-8 flex justify-center items-center ${
                  isActive ? 'bg-blue-500 text-white' : 'bg-gray-50'
                }`}>
                  {stepNumber}
                </span>
                <h4 className={`text-[18px] pl-3 md:pl-0 font-bold md:font-normal md:text-[clamp(12px,1.5vw,20px)] ${
                  isActive ? 'text-blue-500' : ''
                }`}>
                  {stepName as string}
                </h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none" className='md:hidden ml-auto'>
                  <path d="M0.666992 26.9997V24.333H27.3337V26.9997H0.666992ZM6.00033 17.4357H7.43099L19.1643
                   5.70999L18.4543 4.97399L17.726 4.27133L6.00033 16.0047V17.4357ZM4.66699 18.769V15.4357L19.626 
                   0.484326C19.7678 0.342326 19.9229 0.238882 20.0913 0.173993C20.2598 0.109104 20.4313 0.0766602 
                   20.606 0.0766602C20.7807 0.0766602 20.9499 0.109104 21.1137 0.173993C21.2774 0.238882 21.4328 
                   0.344883 21.5797 0.491994L22.9517 1.87133C23.0985 2.01333 23.2032 2.16688 23.2657 2.33199C23.3281 
                   2.49733 23.3593 2.66811 23.3593 2.84433C23.3593 3.00944 23.3268 3.17755 23.2617 3.34866C23.1968 3.51977 
                   23.0934 3.6761 22.9517 3.81766L8.00033 18.769H4.66699ZM19.1643 5.70999L18.4543 4.97399L17.726 
                   4.27133L19.1643 5.70999Z" fill="#1C1B1F"/>
                </svg>
              </div>
            
            {/* CheckoutContent - solo en móvil, después del step actual */}
            {currentStep === stepNumber && (
              <div className="md:hidden w-full">
                <CheckoutContent />
              </div>
            )}
          </React.Fragment>
          )
        })}
      </div>
      
      {/* Botones temporales para navegación - TEMPORAL PARA DESARROLLO */}
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border z-50">
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
              className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                step === currentStep
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
      </div>
    </div>
  )
}

export default CheckoutSteps
