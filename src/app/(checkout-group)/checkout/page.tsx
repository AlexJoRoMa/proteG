'use client'
import CheckoutContent from '@/components/layouts/checkout/CheckoutContent'
import CheckoutSteps from '@/components/layouts/checkout/CheckoutSteps'
import CheckoutProvider from '@/components/providers/CheckoutProvider'
import React from 'react'

const CheckoutPage = () => {
  return (
    <main className="min-h-screen">
      <CheckoutProvider totalSteps={6} initialStep={2}>
        {/* CheckoutSteps maneja móvil + desktop steps, incluye CheckoutContent en móvil */}
        <CheckoutSteps />
        
        {/* CheckoutContent separado - solo visible en desktop */}
        <div className="hidden md:block">
          <CheckoutContent />
        </div>
      </CheckoutProvider>
    </main>
  )
}

export default CheckoutPage
