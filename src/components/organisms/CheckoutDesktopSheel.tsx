'use client'

import CheckoutContent from '@/components/layouts/checkout/CheckoutContent'
import CheckoutSteps from '@/components/layouts/checkout/CheckoutSteps'
import ResumenContainer from '@/components/molecules/checkout/resumenContainer'

export default function CheckoutDesktopShell() {
  return (
    <div className="hidden xl:block">
      <CheckoutSteps variant="desktop" />

      <div className="my-6 flex mx-[var(--spacing-sm)] 4xl:mx-[var(--spacing-xl)] 3xl:mx-[var(--spacing-lg)] 2xl:mx-[var(--spacing-md)] sm:mx-[var(--spacing-sm)]">
        <div className="w-full xl:w-7/12 mr-auto">
          <CheckoutContent />
        </div>

        <div className="xl:w-4/12">
          <ResumenContainer variant="desktop" />
        </div>
      </div>
    </div>
  )
}