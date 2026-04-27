/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useControlledAction } from "@/hooks/checkout/useControlledAction";
import { useGlobalProcessStatus } from "@/hooks/checkout/useGlobalProcessStatus";
import { DatosContratacion } from "@/types/Contratacion";
import { GetAttachFile } from "@/utils/GetAttachFile";
import { GetIzziEnroll } from "@/utils/GetIzziEnroll";
import { GetSubmitOffer } from "@/utils/GetSubmitOffer";
import { validatePayment } from "@/utils/validatePayment";
import { GetCapacity } from "@/utils/GetCapacity";
import { GetProcessStatus } from "@/utils/GetProcessStatus";
import { useEffect, useRef, useState } from "react";
import { GetSubmitCapacity } from "@/utils/GetSubmitCapacity";
import { useRouter } from "next/navigation";
import ModalContratacion from "./modals/ModalContratacion";
import { Button } from "@heroui/react";
import { ResumenData } from "@/types/ResumenCompra";
import { useIzziContent } from "@/components/providers/IzziProvider";
import izziDataLayerHelpers from "@/utils/izzi-data-layer-helpers";
import { EVENTS, CURRENCY } from "@/lib/tracking/constants";
import {
    getCheckoutStepTrackingMeta,
    type CheckoutStepMetaSerialized,
} from "@/utils/checkoutStepTracking";
import ResumenDesktop from "./resumenDesktop";
import ResumenMobile from "./resumenMobile";

interface ResumenContainerProps {
    variant: 'mobile' | 'desktop';
}

export default function ResumenContainer({ variant }: ResumenContainerProps) {
    const ATTACH_STATUS_SETTLE_DELAY_MS = 1200;
    const PROCESS_STATUS_WAIT_TIMEOUT_MS = 300000;
    const PROCESS_STATUS_WAIT_INTERVAL_MS = 3000;
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalName, setModalName] = useState<string>("modal-generico");
    const router = useRouter();
    const { globalUserAnswers, coberturaData, offnetIzzi, offnetSky, globalIzziSelection, precioTotal, infoPaquetes, precioCombinado, globalFlagDomicilio, checkSwitch } = useIzziContent();
    const {
        nextStep,
        currentStep,
        validateCurrentStep,
        getAllFormData,
        isStepValid,
        setDatosContratacion,
        datosContratacion,
        setGetCapacity,
        setIzziEnroll,
        izziEnroll,
        processStatus,
        setProcessStatus,
        copyResumen,
        paymentReference,
        isStepCompleted,
        cardRecurrent,
        setIsStepValid
    } = useCheckout();

    const resumenCopys = copyResumen as ResumenData;

    // Referencias
    const datosContratacionRef = useRef<Partial<DatosContratacion>>(null);
    const izziEnrrollRef = useRef(izziEnroll);
    const processStatusRef = useRef(processStatus);
    const stepStatusRef = useRef<boolean | null>(null);
    const isSubmittingRef = useRef(false);
    /** Dedupe por código de paso fijo (10–13, 19, 20), no por índice UI. */
    const trackedStepsRef = useRef<Set<number>>(new Set());
    const addShippingInfoTrackedRef = useRef(false);
    const addPaymentInfoTrackedRef = useRef(false);

    const CHECKOUT_SESSION_STORAGE_KEY = 'izzi-checkout-session-id';

    useEffect(() => {
        datosContratacionRef.current = datosContratacion;
    }, [datosContratacion]);

    useEffect(() => {
        izziEnrrollRef.current = izziEnroll;
    }, [izziEnroll]);

    useEffect(() => {
        processStatusRef.current = processStatus;
    }, [processStatus]);

    useEffect(() => {
        stepStatusRef.current = isStepCompleted(currentStep)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep])

    const isDisabled = loading || (!isStepValid && !stepStatusRef.current);

    // Logica Steps
    // Step 1
    const step1 = async () => {
        nextStep();
    };

    // Step 2
    const step2 = async (stepData: any) => {
        setDatosContratacion((prev) => ({
            ...prev,
            DatosPersonales: stepData
        }));

        if (!addShippingInfoTrackedRef.current && globalIzziSelection && globalIzziSelection.idPaquete && precioTotal) {
            const { buildEcommerceLineItems, normalizeEcommerceValue, pushEcommerceEvent } = izziDataLayerHelpers;
            const ecommerceValue = normalizeEcommerceValue(precioTotal);

            const items = buildEcommerceLineItems(globalIzziSelection, {
                precioTotal: ecommerceValue,
                mainListId: "checkout",
                mainListName: "Checkout - plan principal",
                extrasListId: "checkout",
                extrasListName: "Checkout - extras",
            });

            let checkoutSessionId: string | undefined;
            if (typeof window !== "undefined") {
                const existing = sessionStorage.getItem(CHECKOUT_SESSION_STORAGE_KEY);
                if (existing) {
                    checkoutSessionId = existing;
                }
            }

            const additionalParams: Record<string, unknown> = {};
            if (checkoutSessionId) {
                additionalParams.checkout_session_id = checkoutSessionId;
            }

            pushEcommerceEvent(
                EVENTS.ADD_SHIPPING_INFO,
                {
                    currency: CURRENCY,
                    value: ecommerceValue,
                    shipping_tier: "standard_installation",
                    items,
                },
                Object.keys(additionalParams).length ? additionalParams : undefined
            );

            addShippingInfoTrackedRef.current = true;
        }

        nextStep();
    }

    //Step 3
    const step3 = async (stepData: any) => {
        setDatosContratacion((prev) => ({
            ...prev,
            VerificacionContacto: stepData
        }));

        try {
            setModalName("modal-generico");
            setModalLoading(true);

            // IzziEnroll
            const resultIzziEnroll = await GetIzziEnroll(coberturaData, { ...datosContratacionRef.current, VerificacionContacto: stepData }, offnetIzzi, offnetSky, globalIzziSelection);
            if (!resultIzziEnroll || resultIzziEnroll?.code || resultIzziEnroll?.error) {
                router.push("/error");
            }
            setIzziEnroll(resultIzziEnroll);
            izziEnrrollRef.current = resultIzziEnroll;

            // // ProcessStatus
            await iniciarPolling();

            // SubmitOffer
            await showModaluntilAction(async () => await runSubmitOffer(), null);

            nextStep()

        } catch (err) {
            console.error('Error en step3', err)
            router.push("/error");
        } finally {
            setModalLoading(false);
        }
    };

    // Step 4
    const step4 = async (stepData: any) => {
        setDatosContratacion((prev) => ({
            ...prev,
            DocumentosTitular: stepData
        }));

        datosContratacionRef.current = {
            ...(datosContratacionRef.current ?? {}),
            DocumentosTitular: stepData,
        };

        try {
            const attachCompleted = await runWithModal(
                () => runAttachFiles(),
                "modal-documentos"
            );
            if (!attachCompleted) {
                return;
            }

            if (!globalFlagDomicilio) {
                const capacityCompleted = await runWithModal(async () => {
                    await waitForWaitingForAction();
                    await runGetCapacity(true);
                    return true;
                }, "modal-disponibilidad");

                if (!capacityCompleted) {
                    return;
                }
            }
            nextStep()

        } catch (err) {
            console.error('Error en step4', err)
        }
    }

    // Step 5
    const step5 = async (stepData: any) => {
        setDatosContratacion((prev) => ({
            ...prev,
            Instalacion: stepData
        }));
        nextStep()
    }

    // Step 6
    const step6 = async () => {
        const metodoPago = datosContratacion.Pago?.metodoPago;

        // ValidaPago
        const response = await validatePayment(
            datosContratacion,
            setDatosContratacion,
            processStatusRef.current,
            paymentReference
        );

        if (!response) {
            return;
        }

        if (
            !addPaymentInfoTrackedRef.current &&
            metodoPago &&
            globalIzziSelection &&
            globalIzziSelection.idPaquete &&
            precioTotal
        ) {
            const { buildEcommerceLineItems, normalizeEcommerceValue, pushEcommerceEvent } = izziDataLayerHelpers;
            const ecommerceValue = normalizeEcommerceValue(precioTotal);

            const items = buildEcommerceLineItems(globalIzziSelection, {
                precioTotal: ecommerceValue,
                mainListId: "checkout",
                mainListName: "Checkout - plan principal",
                extrasListId: "checkout",
                extrasListName: "Checkout - extras",
            });

            let checkoutSessionId: string | undefined;
            if (typeof window !== "undefined") {
                const existing = sessionStorage.getItem(CHECKOUT_SESSION_STORAGE_KEY);
                if (existing) {
                    checkoutSessionId = existing;
                }
            }

            let paymentType: string | undefined;
            if (metodoPago === "creditCard") {
                paymentType = "credit_card";
            } else if (metodoPago === "paypal") {
                paymentType = "bank_transfer";
            } else if (metodoPago === "tecnico") {
                paymentType = "oxxo";
            }

            const additionalParams: Record<string, unknown> = {};
            if (checkoutSessionId) {
                additionalParams.checkout_session_id = checkoutSessionId;
            }

            pushEcommerceEvent(
                EVENTS.ADD_PAYMENT_INFO,
                {
                    currency: CURRENCY,
                    value: ecommerceValue,
                    payment_type: paymentType,
                    items,
                },
                Object.keys(additionalParams).length ? additionalParams : undefined
            );

            addPaymentInfoTrackedRef.current = true;
        }

        // Flujo específico para pago con técnico: reintentos + modal
        if (metodoPago === "tecnico") {
            const success = await runWithModal(
                () => runSubmitCapacityWithRetries(),
                "modal-generico"
            );

            if (success) {
                router.push("/thank-you");
            } else {
                console.error("SubmitCapacity failed after 3 attempts for pago tecnico");
                router.push("/error");
            }

            return;
        }

        // Flujo actual para otros métodos de pago
        const submitResponse = await runSubmitCapacity();

        if (submitResponse) {
            router.push("/thank-you");
        }
    }

    // Handlers

    const { iniciarPolling } = useGlobalProcessStatus((finalData) => {
        router.push('/thank-you');
        // logica adicional
    });

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const refreshCurrentProcessStatus = async () => {
        const currentProcessId = izziEnrrollRef.current;
        if (!currentProcessId) {
            return null;
        }

        const updatedStatus = await GetProcessStatus(currentProcessId);
        if (updatedStatus) {
            setProcessStatus(updatedStatus);
            processStatusRef.current = updatedStatus;
        }

        return updatedStatus;
    };

    const waitForWaitingForAction = async () => {
        if (processStatusRef.current.waitingForAction) {
            return processStatusRef.current;
        }

        const startedAt = Date.now();

        while (Date.now() - startedAt < PROCESS_STATUS_WAIT_TIMEOUT_MS) {
            const updatedStatus = await refreshCurrentProcessStatus();
            if (updatedStatus?.waitingForAction) {
                return updatedStatus;
            }

            await sleep(PROCESS_STATUS_WAIT_INTERVAL_MS);
        }

        throw new Error("ProcessStatus no reportó waitingForAction=true a tiempo.");
    };

    const getRequiredAttachInfo = (documentKey: "ine" | "comprobante") => {
        const attachInfo = datosContratacionRef.current?.DocumentosTitular?.[documentKey];
        const currentStatus = processStatusRef.current;

        if (!currentStatus?.accountId || !currentStatus?.accountNumber) {
            throw new Error(`No hay cuenta activa para adjuntar ${documentKey}.`);
        }

        if (!attachInfo?.fileName || !attachInfo?.fileExtension || !attachInfo?.data) {
            throw new Error(`El payload de ${documentKey} no está listo para enviarse.`);
        }

        return attachInfo;
    };

    async function runAttachFiles(): Promise<boolean> {
        await runAttachIne(true);
        await sleep(ATTACH_STATUS_SETTLE_DELAY_MS);
        await refreshCurrentProcessStatus();

        await runAttachComprobante(true);
        await sleep(ATTACH_STATUS_SETTLE_DELAY_MS);
        await refreshCurrentProcessStatus();

        return true;
    }

    const showModaluntilAction = async (
        action: () => Promise<any>,
        modalKey: string | null
    ) => {
        try {
            setProcessStatus((prev) => ({ ...prev, waitingForAction: false }));
            if (modalKey !== null) {
                setModalName(modalKey)
                setModalLoading(true);
            }

            const result = await action();
            if (result?.error) {
                setModalLoading(false)
                return result;
            }

            await new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (processStatusRef.current.waitingForAction === true) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 500);
            });
            return result;
        } finally {
            setModalLoading(false);
        }
    };

    const runWithModal = async <T,>(
        action: () => Promise<T>,
        modalKey: string
    ): Promise<T> => {
        setModalName(modalKey);
        setModalLoading(true);

        try {
            const result = await action();
            return result;
        } finally {
            setModalLoading(false);
        }
    };

    const { trigger: runSubmitOffer, isLoading: loadingOrder } = useControlledAction({
        action: async () => {
            const res = await GetSubmitOffer(izziEnrrollRef.current, globalIzziSelection, precioTotal, globalUserAnswers, offnetIzzi, offnetSky);
            const data = await res;
            if (data?.code) {
                console.error("Error del servicio submitOffer");
                router.push("/error");
            }

            return data;
        },
        resetKey: `step-3-submitOffer`,
        autoExecute: false,
    });

    const { trigger: runAttachIne, isLoading: loadingAttachIne } = useControlledAction({
        action: async () => {
            const attachInfo = getRequiredAttachInfo("ine");

            const res = await GetAttachFile(processStatusRef.current, attachInfo);
            const data = await res;


            // Después de attachFiles, consultar processStatus una vez para actualizar waitingForAction
            if (data?.error || data?.code) {
                throw new Error("Error adjuntando INE.");
            }


            return data;
        },
        resetKey: `step-4-attachFileIne`,
        autoExecute: false,
        onError: (err) => setModalLoading(false),
    });

    const { trigger: runAttachComprobante, isLoading: loadingAttachComprobante } = useControlledAction({
        action: async () => {
            const attachInfo = getRequiredAttachInfo("comprobante");

            const res = await GetAttachFile(processStatusRef.current, attachInfo);
            const data = await res;


            // Después de attachFiles, consultar processStatus una vez para actualizar waitingForAction
            if (data?.error || data?.code) {
                throw new Error("Error adjuntando comprobante.");
            }


            return data;
        },
        resetKey: `step-4-attachFileComprobante`,
        autoExecute: false,
        onError: (err) => setModalLoading(false),
    });

    const { trigger: runGetCapacity, isLoading: loadingCapacity } = useControlledAction({
        action: async () => {
            const res = await GetCapacity(izziEnrrollRef.current);
            const data = await res;

            if (data?.code || data?.error) {
                console.error("Error del servicio getCapacity");
                router.push("/error");
            }
            setGetCapacity(data.quotaSchedule);

        },
        resetKey: `step-4-getCapacity`,
        autoExecute: false,
    });

    const { trigger: runSubmitCapacity, isLoading: loadingSubmitCapacity } = useControlledAction({
        action: async () => {
            const res = await GetSubmitCapacity(izziEnrrollRef.current, datosContratacionRef, checkSwitch, globalFlagDomicilio);
            const data = await res;
            if (data?.code) {
                console.error("Error del servicio getCapacity");
                return false;
            }

            if (data.accountNumber) {
                return true;
            }
        },
        resetKey: `step-6-submitCapacity`,
        autoExecute: false,
    });

    const MAX_SUBMIT_CAPACITY_ATTEMPTS = 3;
    const ATTEMPT_TIMEOUT_MS = 5000;

    const runSubmitCapacityWithTimeout = async (): Promise<boolean> => {
        return Promise.race<boolean>([
            (async () => {
                const result = await runSubmitCapacity();
                return !!result;
            })(),
            new Promise<boolean>((resolve) =>
                setTimeout(() => resolve(false), ATTEMPT_TIMEOUT_MS)
            ),
        ]);
    };

    const runSubmitCapacityWithRetries = async (): Promise<boolean> => {
        for (let attempt = 1; attempt <= MAX_SUBMIT_CAPACITY_ATTEMPTS; attempt++) {
            const success = await runSubmitCapacityWithTimeout();

            if (success) {
                return true;
            }
        }

        return false;
    };

    const steps = globalFlagDomicilio ? [step1, step2, step3, step4, step6] : [step1, step2, step3, step4, step5, step6];

    useEffect(() => {
        if (!globalIzziSelection || !globalIzziSelection.idPaquete) return;
        if (!precioTotal) return;

        const { buildEcommerceLineItems, normalizeEcommerceValue, normalizeUserData, pushEcommerceEvent } =
            izziDataLayerHelpers;
        const ecommerceValue = normalizeEcommerceValue(precioTotal);

        const items = buildEcommerceLineItems(globalIzziSelection, {
            precioTotal: ecommerceValue,
            mainListId: "checkout",
            mainListName: "Checkout - plan principal",
            extrasListId: "checkout",
            extrasListName: "Checkout - extras",
        });

        const stepMeta = getCheckoutStepTrackingMeta(currentStep, globalFlagDomicilio);
        if (!stepMeta) return;

        if (typeof window !== "undefined") {
            sessionStorage.setItem("izzi-checkout-current-step", String(currentStep));
            const serialized: CheckoutStepMetaSerialized = {
                uiStep: stepMeta.uiStep,
                flowStep: stepMeta.flowStep,
                label: stepMeta.label,
                analyticsStepName: stepMeta.analyticsStepName,
            };
            sessionStorage.setItem("izzi-checkout-step-meta", JSON.stringify(serialized));
        }

        if (!trackedStepsRef.current.has(stepMeta.flowStep)) {
            const extraParams: Record<string, unknown> = {
                /** Código fijo de paso (10–13, 19, 20). Pago = siempre 20 aunque el índice UI sea 5 o 6. */
                checkout_step: stepMeta.flowStep,
                checkout_step_ui: stepMeta.uiStep,
                checkout_step_label: stepMeta.label,
                checkout_step_name: stepMeta.analyticsStepName,
            };

            let checkoutSessionId: string | undefined;
            if (typeof window !== "undefined") {
                const existing = sessionStorage.getItem(CHECKOUT_SESSION_STORAGE_KEY);
                if (existing) {
                    checkoutSessionId = existing;
                }
            }

            if (checkoutSessionId) {
                extraParams.checkout_session_id = checkoutSessionId;
            }

            const datosPersonales = datosContratacion?.DatosPersonales?.personal;

            if (datosPersonales) {
                const userData = normalizeUserData({
                    email: datosPersonales.email,
                    phone: datosPersonales.phone,
                    firstName: datosPersonales.firstName,
                    lastName: datosPersonales.firstLastName,
                    street: coberturaData.address,
                    city: coberturaData.municipio,
                    state: coberturaData.estado,
                    postalCode: coberturaData.zipCode,
                });

                extraParams.user_data = userData;
            }

            if (currentStep === 1) {
                extraParams.coverage_verified = true;
                extraParams.coverage_type = "fiber";
                extraParams.coverage_region = coberturaData?.municipio || null;
            }

            pushEcommerceEvent(
                EVENTS.CHECKOUT_PROGRESS,
                {
                    currency: CURRENCY,
                    value: ecommerceValue,
                    items,
                },
                extraParams
            );

            trackedStepsRef.current.add(stepMeta.flowStep);
        }
    }, [currentStep, globalFlagDomicilio, globalIzziSelection, precioTotal, datosContratacion, coberturaData]);

    const handleContinue = async () => {
        if (isSubmittingRef.current) return;

        isSubmittingRef.current = true;
        setLoading(true)
        const step = currentStep;

        try {
            const ok = await validateCurrentStep()
            if (!ok) return;

            const allData = getAllFormData ? getAllFormData() : {}
            const stepData = allData[step] || {};

            const handler = steps[step - 1];
            if (!handler) return;

            await handler(stepData);

            window.scrollTo({ top: 0, behavior: 'smooth' });

        } finally {
            isSubmittingRef.current = false;
            setLoading(false)
        }
    }

    const renderContinueButton = () => (
        <Button
            disabled={isDisabled}
            className='py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full h-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50'
            onPress={handleContinue}
        >
            {loading ? "Procesando..." : "Continuar"}
        </Button>
    );

    return (
        <>
            {
                variant === 'mobile' ? (
                    <div className="fixed bottom-0 left-0 z-40 w-full px-[16px] pt-[24px] pb-[32px] bg-gray-50 shadow-[0_-2px_20px_0_rgba(0,0,0,0.12)]">
                        <ResumenMobile
                            resumenCopys={resumenCopys}
                        >
                            {renderContinueButton}
                        </ResumenMobile>
                    </div>
                ) : (
                    <div className="border rounded-md border-gray-150 w-full px-[16px] pt-[24px] pb-[32px] bg-white-0">
                        <ResumenDesktop
                            resumenCopys={resumenCopys}
                        >
                            {renderContinueButton}
                        </ResumenDesktop>
                    </div>
                )
            }

            <ModalContratacion isOpen={modalLoading} name={modalName} />
        </>
    )
}
