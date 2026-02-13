'use client'

import CheckoutContent from '@/components/layouts/checkout/CheckoutContent'
import CheckoutSteps from '@/components/layouts/checkout/CheckoutSteps'
import { useIzziContent } from '../providers/IzziProvider'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Checkout() {
    const { formattedAddress, coberturaData, globalIzziSelection } = useIzziContent();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Marcar como hidratado después de mount
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1280px)');

        const handleViewportChange = (event: MediaQueryListEvent) => {
            setIsDesktop(event.matches);
        };

        setIsDesktop(mediaQuery.matches);

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleViewportChange);
            return () => mediaQuery.removeEventListener('change', handleViewportChange);
        }

        mediaQuery.addListener(handleViewportChange);
        return () => mediaQuery.removeListener(handleViewportChange);
    }, []);

    useEffect(() => {
        // Solo validar después de la hidratación
        if (!isHydrated) return;

        // Pequeño delay para asegurar que el estado esté sincronizado
        const timer = setTimeout(() => {
            // Verificar múltiples indicadores del flujo
            const hasAddress = formattedAddress && formattedAddress.trim() !== '';
            const hasCoberturaData = coberturaData && Object.keys(coberturaData).length > 0;
            const hasSelection = globalIzziSelection !== null;

            // Solo redirigir si NO tiene ningún indicador del flujo
            if (!hasAddress && !hasCoberturaData && !hasSelection) {
                router.push('/consulta-cobertura');
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [isHydrated, formattedAddress, coberturaData, globalIzziSelection, router]);

    return (
        <>
            {/* CheckoutSteps maneja móvil + desktop steps, incluye CheckoutContent en móvil */}
            <CheckoutSteps isDesktop={isDesktop} />

            {/* CheckoutContent separado - solo visible en desktop */}
            {isDesktop && (
                <div className="hidden xl:block">
                    <CheckoutContent />
                </div>
            )}

        </>
    )
}