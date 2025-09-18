'use client'
import CheckoutContent from '@/components/layouts/checkout/CheckoutContent'
import CheckoutSteps from '@/components/layouts/checkout/CheckoutSteps'
import CheckoutProvider from '@/components/providers/CheckoutProvider'
import React from 'react'

const CheckoutPage = () => {
  // Contenido para cada step - componentes específicos para cada paso


  return (
    <main className="min-h-screen bg-gray-50">
      <CheckoutProvider totalSteps={6} initialStep={1}>
        <CheckoutSteps
        />
        <CheckoutContent />
      </CheckoutProvider>
    </main>
  )
}

export default CheckoutPage
