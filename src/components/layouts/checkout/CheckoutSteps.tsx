import React from 'react'
import { CheckoutStepsDomiciliado, CheckoutStepsNoDomiciliado } from '@/constants/CheckoutSteps'
import { useCheckout } from '@/components/providers/CheckoutProvider'
import { CheckStepIcon, EditIcon } from '@/constants/IconsConstants'
import { useIzziContent } from '@/components/providers/IzziProvider'

interface CheckoutStepsProps {
  variant?: 'mobile' | 'desktop';
  activeStepContent?: React.ReactNode;
  contentSlot?: React.ReactNode;
  isDesktop?: boolean;
}

const CheckoutSteps = ({
  variant,
  activeStepContent,
  contentSlot,
  isDesktop,
}: CheckoutStepsProps) => {
  const { globalFlagDomicilio } = useIzziContent();
  const { currentStep, goToStep, canGoToStep } = useCheckout();

  const resolvedIsDesktop = typeof isDesktop === 'boolean'
    ? isDesktop
    : variant === 'desktop';

  const checkoutSteps = globalFlagDomicilio ? CheckoutStepsDomiciliado : CheckoutStepsNoDomiciliado;
  const stepsArray = Object.values(checkoutSteps);
  const sharedContentSlot = contentSlot ?? activeStepContent;

  return (
    <div className="px-[var(--spacing-sm)] 4xl:px-[var(--spacing-xl)] 3xl:px-[var(--spacing-lg)] 2xl:px-[var(--spacing-md)] sm:px-[var(--spacing-sm)] xl:px-0 !w-full">
      <div className="flex flex-col xl:flex-row xl:flex-wrap items-stretch pt-[24px] pb-[15px] border-gradient-fixed-main w-full justify-around">
        {stepsArray.map((stepName, index) => {
          const stepNumber = index + 1;
          const isClickable = canGoToStep(stepNumber);
          const isActive = currentStep === stepNumber;
          const isComplete = stepNumber < currentStep;
          const stepStateClasses = isActive
            ? 'border-none'
            : isComplete && !resolvedIsDesktop
              ? 'border-gradient-fixed'
              : 'border-b-1 border-b-gray-100';

          return (
            <div
              key={index}
              data-index={index}
              style={{ order: resolvedIsDesktop ? stepNumber : (stepNumber * 2) - 1 }}
              className={`flex gap-[8px] text-center w-full py-2 flex-row items-center justify-center xl:w-[16.6%] xl:py-0 xl:flex-col xl:items-center xl:justify-between ${stepStateClasses} xl:border-none mb-2 pb-[18px] xl:mb-0 xl:pb-0 ${isClickable ? 'cursor-pointer hover:opacity-75 transition-opacity' : 'cursor-default'}`}
              onClick={() => isClickable ? goToStep(stepNumber) : undefined}
            >
              <div className="flex gap-[8px] w-full flex-row items-center xl:flex-col xl:items-center">
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
                  className={`text-[20px] pl-3 xl:pl-0 xl:text-[clamp(12px,1.5vw,20px)] xl:w-[180px] xl:leading-tight ${isActive || isComplete ? 'font-semibold text-black-0' : 'font-normal'} ${isActive ? 'text-black-0' : 'text-[#AEAEB5]'}`}
                >
                  {stepName as string}
                </h4>
              </div>

              {isComplete ? <EditIcon /> : null}
            </div>
          );
        })}

               {sharedContentSlot ? (
          <div
            className="w-full border-gradient-fixed border-gradient-fixed-main-desktop mb-[8px] xl:border-none xl:mb-0"
            style={{ order: resolvedIsDesktop ? stepsArray.length + 1 : currentStep * 2 }}
          >
            {sharedContentSlot}
          </div>
        ) : null}

      </div>


    </div>
  );
}

export default CheckoutSteps
