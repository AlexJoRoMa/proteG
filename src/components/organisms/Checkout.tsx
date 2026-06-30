'use client'

import CheckoutContent from '@/components/layouts/checkout/CheckoutContent'
import CheckoutSteps from '@/components/layouts/checkout/CheckoutSteps'
import ResumenContainer from '@/components/molecules/checkout/resumenContainer'
import { useIzziContent } from '../providers/IzziProvider';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import izziDataLayerHelpers from '@/utils/izzi-data-layer-helpers';
import { EVENTS, CURRENCY } from '@/lib/tracking/constants';
import { pushToDataLayer } from '@/utils/gtm';

const CHECKOUT_SESSION_STORAGE_KEY = 'izzi-checkout-session-id';
const DESKTOP_BREAKPOINT = 1024;

export default function Checkout() {
    const { formattedAddress, coberturaData, globalIzziSelection, precioTotal } = useIzziContent();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const beginCheckoutTrackedRef = useRef(false);

    useEffect(() => {
        const updateViewport = () => {
            setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
        };

        updateViewport();
        window.addEventListener('resize', updateViewport);
        setIsHydrated(true);

        return () => window.removeEventListener('resize', updateViewport);
    }, []);

    useEffect(() => {
        // Solo validar despues de la hidratacion
        if (!isHydrated) return;

        // Pequeno delay para asegurar que el estado este sincronizado
        const timer = setTimeout(() => {
            // Verificar multiples indicadores del flujo
            const hasAddress = formattedAddress && formattedAddress.trim() !== '';
            const hasCoberturaData = coberturaData && Object.keys(coberturaData).length > 0;
            const hasSelection = globalIzziSelection !== null;

            // Solo redirigir si NO tiene ningun indicador del flujo
            if (!hasAddress && !hasCoberturaData && !hasSelection) {
                router.push('/consulta-cobertura');
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [isHydrated, formattedAddress, coberturaData, globalIzziSelection, router]);

    useEffect(() => {
        if (!isHydrated) return;

        // page_data basico para checkout
        pushToDataLayer(EVENTS.PAGE_DATA, {
            page_type: 'checkout',
            page_name: 'checkout',
        });
    }, [isHydrated]);

    useEffect(() => {
        if (!isHydrated) return;
        if (!globalIzziSelection || !globalIzziSelection.idPaquete) return;

        const { buildEcommerceLineItems, normalizeEcommerceValue, pushEcommerceEvent, generateCheckoutSessionId } =
            izziDataLayerHelpers;

        const rawValue =
            precioTotal ||
            (globalIzziSelection.precioPaquete ? parseFloat(globalIzziSelection.precioPaquete) || 0 : 0);
        const value = normalizeEcommerceValue(rawValue);

        const items = buildEcommerceLineItems(globalIzziSelection, {
            precioTotal: value,
            mainListId: 'checkout',
            mainListName: 'Checkout - plan principal',
            extrasListId: 'checkout',
            extrasListName: 'Checkout - extras',
        });

        if (!beginCheckoutTrackedRef.current) {
            let checkoutSessionId: string | undefined;

            if (typeof window !== 'undefined') {
                // Limpiar claves de sesiones anteriores para evitar contaminacion entre flujos
                sessionStorage.removeItem('izzi-purchase-tracked');
                sessionStorage.removeItem('izzi-checkout-current-step');

                checkoutSessionId = generateCheckoutSessionId();
                sessionStorage.setItem(CHECKOUT_SESSION_STORAGE_KEY, checkoutSessionId);
            }

            const additionalParams: Record<string, unknown> = {};
            if (checkoutSessionId) {
                additionalParams.checkout_session_id = checkoutSessionId;
            }

            pushEcommerceEvent(
                EVENTS.BEGIN_CHECKOUT,
                {
                    currency: CURRENCY,
                    value,
                    items,
                },
                Object.keys(additionalParams).length ? additionalParams : undefined
            );

            beginCheckoutTrackedRef.current = true;
        }
    }, [isHydrated, globalIzziSelection, precioTotal]);

    if (!isHydrated) {
        return null;
    }

    return (
        <CheckoutSteps
            isDesktop={isDesktop}
            contentSlot={(
                <div className="mx-[var(--spacing-sm)] sm:mx-[var(--spacing-sm)] my-6 xl:flex">
                    <div className="w-full xl:w-7/12 xl:mr-auto">
                        <CheckoutContent />
                    </div>

                    <div className={`w-full xl:w-4/12`}>
                        <ResumenContainer variant={isDesktop ? 'desktop' : 'mobile'} />
                    </div>
                </div>
            )}
        />
    );
}
