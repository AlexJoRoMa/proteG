'use client';

import { useEffect } from 'react';
import { pushToDataLayer } from '@/utils/gtm';
import { EVENTS } from '@/lib/tracking/constants';

interface PageDataTrackerProps {
    pageType: 'home' | 'category' | 'checkout' | 'confirmation' | 'landing' | 'support';
    pageName: string;
    section?: 'residencial' | 'empresarial';
    category?: string;
    checkoutStep?: number;
    transactionId?: string;
}

export default function PageDataTracker({
    pageType,
    pageName,
    section = 'residencial',
    category,
    checkoutStep,
    transactionId,
}: PageDataTrackerProps) {
    useEffect(() => {
        const payload: Record<string, unknown> = {
            page_type: pageType,
            page_name: pageName,
            section,
        };

        if (category) {
            payload.category = category;
        }

        if (typeof checkoutStep === 'number') {
            payload.checkout_step = checkoutStep;
        }

        if (transactionId) {
            payload.transaction_id = transactionId;
        }

        pushToDataLayer(EVENTS.PAGE_DATA, payload);
    }, [pageType, pageName, section, category, checkoutStep, transactionId]);

    return null;
}

