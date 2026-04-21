'use client'

import CheckoutDesktopShell from '@/components/organisms/CheckoutDesktopShell'
import CheckoutMobileShell from '@/components/organisms/CheckoutMobileShell'
import { useIzziContent } from '../providers/IzziProvider'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Checkout() {
    const { formattedAddress, coberturaData, globalIzziSelection } = useIzziContent();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

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

    return (
        <>
            <CheckoutMobileShell />
            <CheckoutDesktopShell />
        </>
    )
}
