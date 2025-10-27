'use client'

import { useCheckout } from "@/components/providers/CheckoutProvider"
import { useControlledAction } from "@/hooks/checkout/useControlledAction";
import { useGlobalProcessStatus } from "@/hooks/checkout/useGlobalProcessStatus";
import { DatosContratacion, StatusFlujo } from "@/types/Contratacion";
import { GetAttachFile } from "@/utils/GetAttachFile";
import { GetIzziEnroll } from "@/utils/GetIzziEnroll";
import { GetSubmitOffer } from "@/utils/GetSubmitOffer";
import { validatePayment } from "@/utils/validatePayment";
import { GetCapacity } from "@/utils/GetCapacity";
import { useEffect, useRef, useState } from "react";
import { GetSubmitCapacity } from "@/utils/GetSubmitCapacity";
import { useRouter } from "next/navigation";
import ModalContratacion from "./modals/ModalContratacion";
import ModalFechaInvalida from "./modals/ModalFechaInvalida";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from "@heroui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@/constants/IconsConstants";
import { ResumenData } from "@/types/ResumenCompra";

export default function ResumenContainer() {

    const [loading, setLoading] = useState(false);
    const [checkInstalacion, setCheckInstalacion] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalNewDate, setModalNewDate] = useState(false);
    const [modalName, setModalName] = useState<string>("modal-generico");
    const router = useRouter();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const {
        nextStep,
        goToStep,
        currentStep,
        totalSteps,
        validateCurrentStep,
        getAllFormData,
        isStepValid,
        setDatosContratacion,
        datosContratacion,
        setIsStepValid,
        setGetCapacity,
        setIzziEnroll,
        izziEnroll,
        processStatus,
        setProcessStatus,
        getIntentosInstalacion,
        setGetIntentosInstalacion,
        statusStep,
        setStatusStep,
        copyResumen,
    } = useCheckout();

    const datosContratacionRef = useRef<Partial<DatosContratacion>>(null);
    const izziEnrrollRef = useRef(izziEnroll);
    const processStatusRef = useRef(processStatus);

    const resumenCopys = copyResumen as ResumenData;

    useEffect(() => {
        datosContratacionRef.current = datosContratacion;
    }, [datosContratacion]);

    useEffect(() => {
        izziEnrrollRef.current = izziEnroll;
    }, [izziEnroll]);

    useEffect(() => {
        processStatusRef.current = processStatus;
    }, [processStatus]);

    function handleModalNewDate() {
        setModalNewDate(false);
        goToStep(5);
    }

    const showModaluntilAction = async (
        action: () => Promise<any>,
        modalKey: string
    ) => {
        try {
            setModalName(modalKey)
            setModalLoading(true);

            const result = await action();

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

    const { iniciarPolling } = useGlobalProcessStatus((finalData) => {
        console.log('proceso finalizado', finalData);
        router.push('/thank-you');
        // logica adicional
    });

    const { trigger: runSubmitOffer, isLoading: loadingOrder } = useControlledAction({
        action: async () => {
            const res = await GetSubmitOffer(izziEnrrollRef.current);
            const data = await res;
            if (data?.code) {
                throw new Error("Error del servicio submitOffer");
            }

            return data;
        },
        resetKey: `step-3-submitOffer`,
        autoExecute: false,
        // onSuccess: (data) => console.log('submitOffer success.', data),
        // onError: (err) => console.error('submitOffer error:', err),
        // onLoadingChange: (loading) => { 
        //     setModalLoading(loading)
        // },
    });

    const { trigger: runAttachIne, isLoading: loadingAttachIne } = useControlledAction({
        action: async () => {
            const attachInfo = datosContratacionRef.current?.DocumentosTitular && datosContratacionRef.current?.DocumentosTitular.ine;

            const res = await GetAttachFile(processStatus, attachInfo);
            const data = await res;
            console.log('data attachIne:', data)
            return data;
        },
        resetKey: `step-4-attachFileIne`,
        autoExecute: false,
        // onSuccess: (data) => console.log('submitOffer success.', data),
        // onError: (err) => console.error('submitOffer error:', err),
        // onLoadingChange: (loading) => setModalLoading(loading),
    });

    const { trigger: runAttachComprobante, isLoading: loadingAttachComprobante } = useControlledAction({
        action: async () => {
            const attachInfo = datosContratacionRef.current?.DocumentosTitular && datosContratacionRef.current?.DocumentosTitular.comprobante;

            const res = await GetAttachFile(processStatus, attachInfo);
            const data = await res;
            console.log('data attachComprobante:', data)
            return data;
        },
        resetKey: `step-4-attachFileComprobante`,
        autoExecute: false,
        // onSuccess: (data) => console.log('submitOffer success.', data),
        // onError: (err) => console.error('submitOffer error:', err),
        // onLoadingChange: (loading) => setModalLoading(loading),
    });

    const { trigger: runGetCapacity, isLoading: loadingCapacity } = useControlledAction({
        action: async () => {
            const res = await GetCapacity(izziEnrrollRef.current);
            const data = await res;
            if (data?.code) {
                throw new Error("Error del servicio getCapacity");
            }
            setGetCapacity(data.quotaSchedule);

        },
        resetKey: `step-4-getCapacity`,
        autoExecute: false,
        // onSuccess: (data) => console.log('submitOffer success.', data),
        // onError: (err) => console.error('submitOffer error:', err),
        // onLoadingChange: (loading) => setModalLoading(loading),
    });

    const { trigger: runCheckCapacity, isLoading: loadingCheckCapacity } = useControlledAction({
        action: async () => {
            const res = await GetCapacity(izziEnrrollRef.current);
            const data = await res;

            if (data?.code) {
                throw new Error("Error del servicio getCapacity");
            }

            const checkData = data.quotaSchedule;
            const available = checkData.find((info: { cvTimeslot: string | undefined; requestedShipDate: string | undefined; }) =>
                info.cvTimeslot === datosContratacionRef.current?.Instalacion?.cvTimeslot &&
                info.requestedShipDate === datosContratacionRef.current?.Instalacion?.requestedShipDate);

            if (available) {
                setCheckInstalacion(true);
            } else {
                setCheckInstalacion(false);
            }
        },
        resetKey: `step-6-getCapacity`,
        autoExecute: false,
        // onSuccess: (data) => console.log('submitOffer success.', data),
        // onError: (err) => console.error('submitOffer error:', err),
        // onLoadingChange: (loading) => setModalLoading(loading),
    });

    const { trigger: runSubmitCapacity, isLoading: loadingSubmitCapacity } = useControlledAction({
        action: async () => {
            const res = await GetSubmitCapacity(izziEnrrollRef.current, datosContratacionRef);
            const data = await res;
            if (data?.code) {
                throw new Error("Error del servicio getCapacity");
            }
        },
        resetKey: `step-6-submitCapacity`,
        autoExecute: false,
        // onSuccess: (data) => console.log('submitOffer success.', data),
        // onError: (err) => console.error('submitOffer error:', err),
        // onLoadingChange: (loading) => setModalLoading(loading),
    });

    const handleContinue = async () => {
        setLoading(true)
        try {
            const ok = await validateCurrentStep()
            if (!ok) return

            const allData = getAllFormData ? getAllFormData() : {}
            const stepData = allData[currentStep] || {}

            switch (currentStep) {
                case 1: {
                    setStatusStep((prev) => ({
                        ...prev,
                        [`step${currentStep}`]: {
                            completado: true
                        }
                    }));
                    nextStep()
                    break
                }
                case 2: {
                    setDatosContratacion((prev) => ({
                        ...prev,
                        DatosPersonales: stepData
                    }));
                    setStatusStep((prev) => ({
                        ...prev,
                        [`step${currentStep}`]: {
                            completado: true
                        }
                    }));

                    setIsStepValid(false)
                    nextStep()
                    break
                }
                case 3: {
                    setDatosContratacion((prev) => ({
                        ...prev,
                        VerificacionContacto: stepData
                    }));
                    setStatusStep((prev) => ({
                        ...prev,
                        [`step${currentStep}`]: {
                            completado: true
                        }
                    }));

                    try {
                        // IzziEnroll
                        const resultIzziEnroll = await GetIzziEnroll();
                        setIzziEnroll(resultIzziEnroll);

                        // // ProcessStatus
                        iniciarPolling();

                        // SubmitOffer
                        await showModaluntilAction(async () => await runSubmitOffer(), "modal-generico");

                        setIsStepValid(false)
                        nextStep()

                    } catch (err) {
                        console.error('Error en step3', err)
                    }

                    break
                }
                case 4: {
                    setDatosContratacion((prev) => ({
                        ...prev,
                        DocumentosTitular: stepData
                    }));
                    setStatusStep((prev) => ({
                        ...prev,
                        [`step${currentStep}`]: {
                            completado: true
                        }
                    }));

                    datosContratacionRef.current = {
                        ...(datosContratacionRef.current ?? {}),
                        DocumentosTitular: stepData,
                    };

                    try {
                        await Promise.all([
                            // AttachFiles
                            await showModaluntilAction(async () => await runAttachIne(), "modal-documentos"),
                            await showModaluntilAction(async () => await runAttachComprobante(), "modal-documentos"),

                            // GetCapacity() 
                            await showModaluntilAction(async () => await runGetCapacity(), "modal-disponibilidad"),
                        ]);

                        setIsStepValid(false)
                        nextStep()

                    } catch (err) {
                        console.error('Error en step4', err)
                    }

                    break
                }
                case 5: {
                    setDatosContratacion((prev) => ({
                        ...prev,
                        Instalacion: stepData
                    }));
                    setStatusStep((prev) => ({
                        ...prev,
                        [`step${currentStep}`]: {
                            completado: true
                        }
                    }));

                    setIsStepValid(true)
                    nextStep()
                    break
                }
                case 6: {
                    await validatePayment(datosContratacion, setDatosContratacion, processStatusRef.current);

                    if (datosContratacionRef.current?.Pago?.success === true) {
                        setStatusStep((prev) => ({
                            ...prev,
                            [`step${currentStep}`]: {
                                completado: true
                            }
                        }));

                        if (getIntentosInstalacion <= 3) {
                            await runCheckCapacity();

                            if (checkInstalacion) {
                                await runSubmitCapacity();
                                //TODO: redireccion a thank you page
                            } else {
                                setGetIntentosInstalacion(getIntentosInstalacion + 1)
                                setModalNewDate(true);
                            }
                        } else {
                            //TODO: redireccion a thank you page
                        }
                    }

                    setIsStepValid(true)
                    break
                }
            }

        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="fixed xl:static bottom-0 left-0 z-40 xl:border xl:rounded-md xl:border-gray-150 w-full px-[16px] pt-[24px] pb-[32px] bg-gray-50 xl:bg-white-0 shadow-[0_-2px_20px_0_rgba(0,0,0,0.12)] xl:shadow-none">
                <div className="block xl:hidden">
                    <div className="flex justify-between mb-[16px]">
                        <div className="flex flex-col gap-[8px]">
                            <div className="flex gap-[4px] font-normal text-base leading-[24px] text-gray-500 items-baseline">
                                <h3 className="font-extrabold text-[32px] leading-[32px] text-black-0">
                                    $XXXX
                                </h3>
                                <h5>{resumenCopys.infoDrawer.plazo}</h5>
                                <p>|</p>
                                <h5 className="font-bold">test</h5>

                                {/* <h5 className="font-bold">{infoPaquetes}</h5> */}
                            </div>
                            <div className="font-bold">¡Te ahorras XXXX al combinar!</div>

                            {/* <div className="font-bold">{infoDrawerContent}</div> */}
                        </div>
                        <button
                            className="w-[40px] h-[40px] rounded-full border-2 border-black-0 flex items-center justify-center"
                            onClick={onOpen}
                        >
                            <ArrowUpIcon />
                        </button>
                    </div>
                </div>

                <div className="hidden xl:block">
                    <h1 className="font-bold leading-[24px] text-xl mb-[32px]">Resumen de pedido</h1>

                    {/* <ResumenContent copys={resumenCopys} userSelection={userAnswers}/> */}
                    <div className="mb-[24px]">
                        {'Contenido resumen de compra'}
                    </div>

                </div>

                <div className="xl:pt-[32px] xl:border-t-1 xl:border-t-gray-150">
                    <button
                        onClick={handleContinue}
                        disabled={!isStepValid && !statusStep[`step${currentStep}` as keyof StatusFlujo]?.completado}
                        className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                    >
                        {loading ? "Procesando..." : "Continuar"}
                    </button>

                </div>
                <ModalContratacion isOpen={modalLoading} name={modalName} />
                <ModalFechaInvalida isOpen={modalNewDate} setModal={handleModalNewDate} />
            </div>

            <Drawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="full"
                placement="bottom"
                hideCloseButton
                classNames={{
                    header: "px-[16px] py-[24px]",
                    body: "px-[16px] py-0 gap-0",
                    footer: "w-full px-[16px] pt-[32px]"
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
                                {/* <ResumenContent copys={resumenCopys} userSelection={userAnswers}/> */}

                                <div className="mb-[24px]">
                                    {'Contenido resumen de compra'}
                                </div>
                            </DrawerBody>

                            <DrawerFooter>
                                <div className="flex flex-col w-full">
                                    <button
                                        onClick={handleContinue}
                                        disabled={!isStepValid && !statusStep[`step${currentStep}` as keyof StatusFlujo]?.completado}
                                        className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                                    >
                                        {loading ? "Procesando..." : "Continuar"}
                                    </button>
                                </div>

                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}

