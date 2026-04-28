'use client'

import CheckoutContent from '@/components/layouts/checkout/CheckoutContent'
import CheckoutSteps from '@/components/layouts/checkout/CheckoutSteps'
import ResumenContainer from '@/components/molecules/checkout/resumenContainer'

export default function CheckoutMobileShell() {
  return (
    <div className="xl:hidden">
      <CheckoutSteps
        variant="mobile"
        activeStepContent={(
          <div className="mx-[var(--spacing-sm)] my-6">
            <CheckoutContent />
          </div>
        )}
      />

      <div className="h-[190px]">
        <ResumenContainer variant="mobile" />
      </div>
    </div>
  )
}