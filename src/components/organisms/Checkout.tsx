'use client'

import CheckoutDesktopShell from '@/components/organisms/CheckoutDesktopShell'
import CheckoutMobileShell from '@/components/organisms/CheckoutMobileShell'
import { useIzziContent } from '../providers/IzziProvider';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import izziDataLayerHelpers from '@/utils/izzi-data-layer-helpers';
import { EVENTS, CURRENCY } from '@/lib/tracking/constants';
import { pushToDataLayer } from '@/utils/gtm';

const CHECKOUT_SESSION_STORAGE_KEY = 'izzi-checkout-session-id';

export default function Checkout() {
    const { formattedAddress, coberturaData, globalIzziSelection, precioTotal } = useIzziContent();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const beginCheckoutTrackedRef = useRef(false);

    useEffect(() => {
        // Marcar como hidratado después de mount
        setIsHydrated(true);
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
                // Limpiar claves de sesiones anteriores para evitar contaminación entre flujos
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

    return (
        <>
            <CheckoutMobileShell />
            <CheckoutDesktopShell />
        </>
    );
}
