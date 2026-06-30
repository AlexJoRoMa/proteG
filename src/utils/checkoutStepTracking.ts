import {
    CheckoutStepsDomiciliado,
    CheckoutStepsNoDomiciliado,
} from '@/constants/CheckoutSteps';

/** Identificador estable en analytics (no cambia si el paso UI es 5 o 6 según flujo). */
export const CHECKOUT_FLOW_STEP = {
    PACKAGE: 10,
    PERSONAL: 11,
    CONTACT: 12,
    DOCUMENTS: 13,
    INSTALLATION: 19,
    PAYMENT: 20,
} as const;

export type CheckoutAnalyticsStepName =
    | 'package_configuration'
    | 'personal_data'
    | 'contact_verification'
    | 'documents'
    | 'installation_date'
    | 'payment';

type FlowMeta = {
    uiStep: number;
    flowStep: number;
    label: string;
    analyticsStepName: CheckoutAnalyticsStepName;
};

const NO_DOMICILIADO: Record<number, Omit<FlowMeta, 'uiStep'>> = {
    1: {
        flowStep: CHECKOUT_FLOW_STEP.PACKAGE,
        label: CheckoutStepsNoDomiciliado.STEP1,
        analyticsStepName: 'package_configuration',
    },
    2: {
        flowStep: CHECKOUT_FLOW_STEP.PERSONAL,
        label: CheckoutStepsNoDomiciliado.STEP2,
        analyticsStepName: 'personal_data',
    },
    3: {
        flowStep: CHECKOUT_FLOW_STEP.CONTACT,
        label: CheckoutStepsNoDomiciliado.STEP3,
        analyticsStepName: 'contact_verification',
    },
    4: {
        flowStep: CHECKOUT_FLOW_STEP.DOCUMENTS,
        label: CheckoutStepsNoDomiciliado.STEP4,
        analyticsStepName: 'documents',
    },
    5: {
        flowStep: CHECKOUT_FLOW_STEP.INSTALLATION,
        label: CheckoutStepsNoDomiciliado.STEP5,
        analyticsStepName: 'installation_date',
    },
    6: {
        flowStep: CHECKOUT_FLOW_STEP.PAYMENT,
        label: CheckoutStepsNoDomiciliado.STEP6,
        analyticsStepName: 'payment',
    },
};

const DOMICILIADO: Record<number, Omit<FlowMeta, 'uiStep'>> = {
    1: {
        flowStep: CHECKOUT_FLOW_STEP.PACKAGE,
        label: CheckoutStepsDomiciliado.STEP1,
        analyticsStepName: 'package_configuration',
    },
    2: {
        flowStep: CHECKOUT_FLOW_STEP.PERSONAL,
        label: CheckoutStepsDomiciliado.STEP2,
        analyticsStepName: 'personal_data',
    },
    3: {
        flowStep: CHECKOUT_FLOW_STEP.CONTACT,
        label: CheckoutStepsDomiciliado.STEP3,
        analyticsStepName: 'contact_verification',
    },
    4: {
        flowStep: CHECKOUT_FLOW_STEP.DOCUMENTS,
        label: CheckoutStepsDomiciliado.STEP4,
        analyticsStepName: 'documents',
    },
    5: {
        flowStep: CHECKOUT_FLOW_STEP.PAYMENT,
        label: CheckoutStepsDomiciliado.STEP5,
        analyticsStepName: 'payment',
    },
};

/**
 * Paso UI (1…6 o 1…5) + flujo domicilio → código fijo, etiqueta de pestaña y nombre para dataLayer.
 * En flujo domiciliado, UI paso 5 es siempre pago → flowStep 20 (nunca 19).
 */
export function getCheckoutStepTrackingMeta(
    uiStep: number,
    globalFlagDomicilio: boolean
): FlowMeta | null {
    const table = globalFlagDomicilio ? DOMICILIADO : NO_DOMICILIADO;
    const row = table[uiStep];
    if (!row) return null;
    return { uiStep, ...row };
}

export type CheckoutStepMetaSerialized = {
    uiStep: number;
    flowStep: number;
    label: string;
    analyticsStepName: CheckoutAnalyticsStepName;
};
