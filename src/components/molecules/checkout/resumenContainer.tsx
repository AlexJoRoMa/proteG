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
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from "@heroui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@/constants/IconsConstants";
import { ResumenData } from "@/types/ResumenCompra";
import ResumenContent from "../resumenCompra/resumenContent";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { FormatCurrency } from "@/utils/Currency";
import izziDataLayerHelpers from "@/utils/izzi-data-layer-helpers";
import { EVENTS, CURRENCY } from "@/lib/tracking/constants";

export default function ResumenContainer() {

    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalName, setModalName] = useState<string>("modal-generico");
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
    const trackedStepsRef = useRef<Set<number>>(new Set());

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
        nextStep()
    }

    //Step 3
    const step3 = async (stepData: any) => {
        setDatosContratacion((prev) => ({
            ...prev,
            VerificacionContacto: stepData
        }));

        try {
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
            await showModaluntilAction(async () => await runSubmitOffer(), "modal-generico");

            nextStep()

        } catch (err) {
            console.error('Error en step3', err)
            router.push("/error");
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
            // AttachFiles
            await showModaluntilAction(async () => await runAttachFiles(), "modal-documentos")

            if (!globalFlagDomicilio) {
                // GetCapacity() 
                await showModaluntilAction(async () => await runGetCapacity(true), "modal-disponibilidad")
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

    function runAttachFiles() {
        runAttachIne();
        runAttachComprobante();
    }

    const showModaluntilAction = async (
        action: () => Promise<any>,
        modalKey: string
    ) => {
        try {
            setProcessStatus((prev) => ({ ...prev, waitingForAction: false }));
            setModalName(modalKey)
            setModalLoading(true);

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

    const runWithModal = async (
        action: () => Promise<boolean>,
        modalKey: string
    ): Promise<boolean> => {
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
            const attachInfo = datosContratacionRef.current?.DocumentosTitular && datosContratacionRef.current?.DocumentosTitular.ine;

            const res = await GetAttachFile(processStatusRef.current, attachInfo);
            const data = await res;
            
            // Después de attachFiles, consultar processStatus una vez para actualizar waitingForAction
            if (izziEnroll) {
                const updatedStatus = await GetProcessStatus(izziEnroll);
                if (updatedStatus) {
                    setProcessStatus(updatedStatus);
                }
            }
            
            return data;
        },
        resetKey: `step-4-attachFileIne`,
        autoExecute: false,
        onError: (err) => setModalLoading(false),
    });

    const { trigger: runAttachComprobante, isLoading: loadingAttachComprobante } = useControlledAction({
        action: async () => {
            const attachInfo = datosContratacionRef.current?.DocumentosTitular && datosContratacionRef.current?.DocumentosTitular.comprobante;

            const res = await GetAttachFile(processStatusRef.current, attachInfo);
            const data = await res;
            
            // Después de attachFiles, consultar processStatus una vez para actualizar waitingForAction
            if (izziEnroll) {
                const updatedStatus = await GetProcessStatus(izziEnroll);
                if (updatedStatus) {
                    setProcessStatus(updatedStatus);
                }
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

        const { buildPlanItem, normalizeUserData, pushEcommerceEvent } = izziDataLayerHelpers;

        const items = [
            buildPlanItem(
                {
                    id: String(globalIzziSelection.idPaquete),
                    name: globalIzziSelection.tituloTriplePlay ?? globalIzziSelection.titulo,
                    category: "Bundle",
                    technology: globalIzziSelection.spTV || globalIzziSelection.spMovil ? "Triple_Play" : "Doble_Play",
                    price: precioTotal,
                    speed: globalIzziSelection.velocidadMinima,
                    channels: globalIzziSelection.canales,
                    contractMonths: globalIzziSelection.tiempoPlan,
                },
                0,
                "checkout",
                "Checkout - plan principal"
            ),
        ];

        if (!trackedStepsRef.current.has(currentStep)) {
            const extraParams: Record<string, unknown> = {
                checkout_step: currentStep,
            };

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

            pushEcommerceEvent(
                EVENTS.CHECKOUT_PROGRESS,
                {
                    currency: CURRENCY,
                    value: precioTotal,
                    items,
                },
                extraParams
            );

            trackedStepsRef.current.add(currentStep);
        }
    }, [currentStep, globalIzziSelection, precioTotal, datosContratacion, coberturaData]);

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

            window.scrollTo({ top:0, behavior: 'smooth'});

        } finally {
            isSubmittingRef.current = false;
            setLoading(false)
        }
    }

    // Botón Continuar
    const ContinueButton = (
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
            {/* Desktop */}
            <div className="fixed xl:static bottom-0 left-0 z-40 xl:border xl:rounded-md xl:border-gray-150 w-full px-[16px] pt-[24px] pb-[32px] bg-gray-50 xl:bg-white-0 shadow-[0_-2px_20px_0_rgba(0,0,0,0.12)] xl:shadow-none">
                {/* Header Mobile */}
                <div className="block xl:hidden">
                    <div className="flex justify-between mb-[16px]">
                        <div className="flex flex-col gap-[8px]">
                            <div className="flex gap-[4px] font-normal text-base leading-[24px] text-gray-500 items-baseline">
                                <h3 className="font-extrabold text-[32px] leading-[32px] text-black-0">
                                    {FormatCurrency(Number(precioTotal))}
                                </h3>
                                <h5>{resumenCopys.infoDrawer.plazo}</h5>
                                <p>|</p>
                                <h5 className="font-bold">{infoPaquetes}</h5>

                            </div>
                            <div className="font-bold">{`¡Te ahorras ${FormatCurrency(Number(precioCombinado))} al combinar!`}</div>

                        </div>
                        <button
                            className="w-[40px] h-[40px] rounded-full border-2 border-black-0 flex items-center justify-center"
                            onClick={onOpen}
                        >
                            <ArrowUpIcon />
                        </button>
                    </div>
                </div>

                {/* Desktop Resumen */}
                <div className="hidden xl:block">
                    <h1 className="font-bold leading-[24px] text-xl mb-[32px]">{resumenCopys.titulo}</h1>

                    <ResumenContent copys={resumenCopys} userSelection={globalUserAnswers} />

                </div>

                <div className="xl:pt-[32px] xl:border-t-1 xl:border-t-gray-150 z-50">
                    {ContinueButton}
                </div>
                <ModalContratacion isOpen={modalLoading} name={modalName} />
            </div>

            {/* Drawer Mobile */}
            <Drawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="full"
                placement="bottom"
                hideCloseButton
                classNames={{
                    header: "px-[16px] py-[24px]",
                    body: "px-[16px] py-0 gap-0",
                    footer: "w-full px-[16px] pt-[32px] bottom-0 z-50"
                }}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader
                                className="flex flex-row justify-between items-center"
                            >
                                <h3 className="font-bold text-xl leading-[24px] text-[#11181C]">{resumenCopys.titulo}</h3>
                                <button
                                    className="w-[40px] h-[40px] rounded-full border-2 border-black-0 flex items-center justify-center"
                                    onClick={onClose}
                                >
                                    <ArrowDownIcon />
                                </button>
                            </DrawerHeader>

                            <DrawerBody>
                                <ResumenContent copys={resumenCopys} userSelection={globalUserAnswers} />
                            </DrawerBody>

                            <DrawerFooter>
                                {ContinueButton}
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}
