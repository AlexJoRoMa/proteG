/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useCheckout } from "@/components/providers/CheckoutProvider"
import { useControlledAction } from "@/hooks/checkout/useControlledAction";
import { useGlobalProcessStatus } from "@/hooks/checkout/useGlobalProcessStatus";
import { DatosContratacion } from "@/types/Contratacion";
import { GetAttachFile } from "@/utils/GetAttachFile";
import { GetIzziEnroll } from "@/utils/GetIzziEnroll";
import { GetSubmitOffer } from "@/utils/GetSubmitOffer";
import { validatePayment } from "@/utils/validatePayment";
import { GetCapacity } from "@/utils/GetCapacity";
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

export default function ResumenContainer() {

    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalName, setModalName] = useState<string>("modal-generico");
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { globalUserAnswers, coberturaData, offnetIzzi, offnetSky, globalIzziSelection, precioTotal, infoPaquetes, precioCombinado, globalFlagDomicilio } = useIzziContent();
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
            const resultIzziEnroll = await GetIzziEnroll(coberturaData, datosContratacionRef, offnetIzzi, offnetSky,  globalIzziSelection);
            if (!resultIzziEnroll || resultIzziEnroll?.code || resultIzziEnroll?.error) {
                router.push("/error");
            }
            setIzziEnroll(resultIzziEnroll);

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
        // ValidaPago
        const response = await validatePayment(datosContratacion, setDatosContratacion, processStatusRef.current, paymentReference);
        const test = true;
        console.log('::::::::::')

        if (/* response  */ test === true) {

            // SubmitCapacity
            const submitResponse = await runSubmitCapacity();

            if (submitResponse) {
                router.push("/thank-you");
            }
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
            const res = await GetSubmitCapacity(izziEnrrollRef.current, datosContratacionRef, cardRecurrent, globalFlagDomicilio);
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

    const steps = globalFlagDomicilio ? [step1, step2, step3, step4, step6] : [step1, step2, step3, step4, step5, step6];

    const handleContinue = async () => {
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

        } finally {
            setLoading(false)
        }
    }

    // Botón Continuar
    const ContinueButton = (
        <Button
            disabled={!isStepValid && !stepStatusRef.current}
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
