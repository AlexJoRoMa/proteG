'use client'

import CheckoutContent from '@/components/layouts/checkout/CheckoutContent'
import CheckoutSteps from '@/components/layouts/checkout/CheckoutSteps'

export default function Checkout() {
    return (
        <>
            {/* CheckoutSteps maneja móvil + desktop steps, incluye CheckoutContent en móvil */}
            <CheckoutSteps />

            {/* CheckoutContent separado - solo visible en desktop */}
            <div className="hidden xl:block">
                <CheckoutContent />
            </div>

        </>
    )
}