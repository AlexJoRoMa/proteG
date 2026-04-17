'use client'

import CheckoutContent from '@/components/layouts/checkout/CheckoutContent';
import CheckoutSteps from '@/components/layouts/checkout/CheckoutSteps';
import { useIzziContent } from '../providers/IzziProvider';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import izziDataLayerHelpers from '@/utils/izzi-data-layer-helpers';
import { EVENTS, CURRENCY } from '@/lib/tracking/constants';
import { pushToDataLayer } from '@/utils/gtm';

export default function Checkout() {
    const { formattedAddress, coberturaData, globalIzziSelection, precioTotal } = useIzziContent();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const beginCheckoutTrackedRef = useRef(false);
    const addToCartTrackedRef = useRef(false);

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

    useEffect(() => {
        if (!isHydrated) return;

        // page_data básico para checkout
        pushToDataLayer(EVENTS.PAGE_DATA, {
            page_type: 'checkout',
            page_name: 'checkout',
        });
    }, [isHydrated]);

    useEffect(() => {
        if (!isHydrated) return;
        if (!globalIzziSelection || !globalIzziSelection.idPaquete) return;

        const value =
            precioTotal ||
            (globalIzziSelection.precioPaquete ? parseFloat(globalIzziSelection.precioPaquete) || 0 : 0);

        const { buildPlanItem, pushEcommerceEvent } = izziDataLayerHelpers;

        const items = [
            buildPlanItem(
                {
                    id: String(globalIzziSelection.idPaquete),
                    name: globalIzziSelection.tituloTriplePlay ?? globalIzziSelection.titulo,
                    category: 'Bundle',
                    technology: globalIzziSelection.spTV || globalIzziSelection.spMovil ? 'Triple_Play' : 'Doble_Play',
                    price: value,
                    speed: globalIzziSelection.velocidadMinima,
                    channels: globalIzziSelection.canales,
                    contractMonths: globalIzziSelection.tiempoPlan,
                },
                0,
                'checkout',
                'Checkout - plan principal'
            ),
        ];

        if (!addToCartTrackedRef.current) {
            pushEcommerceEvent(
                EVENTS.ADD_TO_CART,
                {
                    currency: CURRENCY,
                    value,
                    items,
                }
            );
            addToCartTrackedRef.current = true;
        }

        if (!beginCheckoutTrackedRef.current) {
            if (typeof window !== 'undefined') {
                const key = 'izzi-begin-checkout-tracked';
                if (!sessionStorage.getItem(key)) {
                    pushEcommerceEvent(
                        EVENTS.BEGIN_CHECKOUT,
                        {
                            currency: CURRENCY,
                            value,
                            items,
                        }
                    );
                    sessionStorage.setItem(key, '1');
                }
            } else {
                pushEcommerceEvent(
                    EVENTS.BEGIN_CHECKOUT,
                    {
                        currency: CURRENCY,
                        value,
                        items,
                    }
                );
            }

            beginCheckoutTrackedRef.current = true;
        }
    }, [isHydrated, globalIzziSelection, precioTotal]);

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
    );
}