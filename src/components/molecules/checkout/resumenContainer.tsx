'use client'

import { useCheckout } from "@/components/providers/CheckoutProvider"
import { validatePayment } from "@/utils/validatePayment";
import { useState } from "react";

export default function ResumenContainer() {

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
        setGetCapacity
    } = useCheckout();

    const [loading, setLoading] = useState(false);

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
                    break
                }
                case 3: {
                    console.log('Verificacion de contacto:', stepData)
                    setDatosContratacion((prev: any) => ({
                        ...prev,
                        VerificacionContacto: stepData
                    }));
                    console.log('Datos Contratacion:', datosContratacion)
                    //TODO: agregar conexion a apis (izienrrol, processStatus, submitOffer)
                    setIsStepValid(false)
                    break
                }
                case 4: {
                    console.log('Documentos del Titular:', stepData)
                    setDatosContratacion((prev: any) => ({
                        ...prev,
                        DocumentosTitular: stepData
                    }));
                    // setGetCapacity() 
                    //TODO: agregar conexion a apis (attach, getCapacity)
                    setIsStepValid(false)
                    break
                }
                case 5: {
                    console.log('Fecha y hora de Instalacion:', stepData)
                    setDatosContratacion((prev: any) => ({
                        ...prev,
                        Instalacion: stepData
                    }));
                    setIsStepValid(true)
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
                    break
                }
            }

            await nextStep()
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
                    disabled={!isStepValid}
                    className="py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-full text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50"
                >
                    Continuar
                </button>
            </div>

        </div>
    )
}