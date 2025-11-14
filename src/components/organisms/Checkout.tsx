'use client'

import CheckoutContent from '@/components/layouts/checkout/CheckoutContent'
import CheckoutSteps from '@/components/layouts/checkout/CheckoutSteps'
import { useIzziContent } from '../providers/IzziProvider'
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function Checkout() {
    const { formattedAddress } = useIzziContent();

    const address = formattedAddress;

    useEffect(() => {
        if (!address) {
            redirect('/cobertura');
        }
    }, [address]);

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