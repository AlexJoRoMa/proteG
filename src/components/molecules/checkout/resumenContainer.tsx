'use client'

import { useCheckout } from "@/components/providers/CheckoutProvider"
import { useControlledAction } from "@/hooks/checkout/useControlledAction";
import { useGlobalProcessStatus } from "@/hooks/checkout/useGlobalProcessStatus";
import { AttacheFilesProps } from "@/types/Contratacion";
import { GetAttachFile } from "@/utils/GetAttachFile";
import { GetIzziEnroll } from "@/utils/GetIzziEnroll";
import { GetSubmitOffer } from "@/utils/GetSubmitOffer";
import { validatePayment } from "@/utils/validatePayment";
import { useEffect, useRef, useState } from "react";

export default function ResumenContainer() {

    const [loading, setLoading] = useState(false);
    const [contratacion, setContratacion] = useState();
    const [shouldRunAttach, setShouldRunAttach] = useState(false);

    const {
        nextStep,
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
    } = useCheckout();

    const datosContratacionRef = useRef(datosContratacion);
    const izziEnrrollRef = useRef(izziEnroll);

    useEffect(() => {
        datosContratacionRef.current = datosContratacion;
    }, [datosContratacion]);

    useEffect(() => {
        izziEnrrollRef.current = izziEnroll;
    }, [izziEnroll]);

    useEffect(() => {
        if (!shouldRunAttach) return;
        if (!datosContratacionRef.current) return;

        runAttachFile();
        setShouldRunAttach(false);
    }, [shouldRunAttach]);

    const { iniciarPolling } = useGlobalProcessStatus((finalData) => {
        console.log('proceso finalizado', finalData);
        // logica adicional
    });

    const { trigger: runSubmitOffer, isLoading: loadingOrder } = useControlledAction({
        action: async () => {
            const res = await GetSubmitOffer(izziEnrrollRef.current);
            const data = await res;
            console.log('data submitOffer:', data)
            if (data?.code) {
                throw new Error("Error del servicio submitOffer");
            }

            return data;
        },
        resetKey: `step-3-submitOffer`,
        autoExecute: false,
        // onSuccess: (data) => console.log('submitOffer success.', data),
        // onError: (err) => console.error('submitOffer error:', err),
        // onLoadingChange: (loading) => setModalLoading(loading),
    });


    const { trigger: runAttachFile, isLoading: loadingAttach } = useControlledAction({
        action: async () => {
            const res = await GetAttachFile(processStatus, datosContratacion as AttacheFilesProps["datosContratacion"]);
            const data = await res;
            console.log('data attach:', data)
            return data;
        },
        resetKey: `step-4-attachFile`,
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
                    console.log('configurador listo:', stepData)
                    nextStep()
                    break
                }
                case 2: {
                    console.log('Datos Personales:', stepData)
                    setDatosContratacion((prev: any) => ({
                        ...prev,
                        DatosPersonales: stepData
                    }));
                    console.log('Datos Contratacion:', datosContratacion)
                    setIsStepValid(false)
                    nextStep()
                    break
                }
                case 3: {
                    console.log('Verificacion de contacto:', stepData)
                    setDatosContratacion((prev: any) => ({
                        ...prev,
                        VerificacionContacto: stepData
                    }));
                    console.log('Datos Contratacion:', datosContratacion)

                    try {
                        // IzziEnroll
                        const resultIzziEnroll = await GetIzziEnroll();
                        setIzziEnroll(resultIzziEnroll);

                        // // ProcessStatus
                        iniciarPolling();

                        // SubmitOffer
                        await runSubmitOffer();

                        setIsStepValid(false)
                        nextStep()

                    } catch (err) {
                        console.error('Error en step3', err)
                    }

                    break
                }
                case 4: {
                    console.log('Documentos del Titular:', stepData)
                    setDatosContratacion((prev: any) => ({
                        ...prev,
                        DocumentosTitular: stepData
                    }));

                    setShouldRunAttach(true);
                    try {
                        // AttachFiles

                        // setGetCapacity() 
                        //TODO: agregar conexion a apis (attach, getCapacity)

                        setIsStepValid(false)
                        nextStep()

                    } catch (err) {
                        console.error('Error en step3', err)
                    }

                    break
                }
                case 5: {
                    console.log('Fecha y hora de Instalacion:', stepData)
                    setDatosContratacion((prev: any) => ({
                        ...prev,
                        Instalacion: stepData
                    }));
                    setIsStepValid(true)
                    nextStep()
                    break
                }
                case 6: {
                    const result = await validatePayment();
                    setDatosContratacion((prev: any) => ({
                        ...prev,
                        Pago: result.metodoPago,
                    }));
                    console.log('Pago:', result.metodoPago)
                    setIsStepValid(true)
                    nextStep()
                    break
                }
            }

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed xl:static bottom-0 left-0 z-50 xl:border xl:rounded-md xl:border-gray-150 w-full px-[16px] pt-[24px] pb-[32px] bg-gray-50 xl:bg-white-0">
            <h1 className="font-bold leading-[24px] text-xl mb-[32px]">Resumen de pedido</h1>

            {/* <ResumenContent copys={resumenCopys} userSelection={userAnswers}/> */}
            <div className="mb-[24px]">
                {'Contenido resumen de compra'}
            </div>

            <div className="pt-[32px] border-t-1 border-t-gray-150">
                <button
                    onClick={handleContinue}
                    disabled={!isStepValid || loading}
                    className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                >
                    {loading ? "Procesando..." : "Continuar"}
                </button>
            </div>

        </div>
    )
}

