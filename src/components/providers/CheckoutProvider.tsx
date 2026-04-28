/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { ResumenIcon } from '@/types/ConfiguradorTypes'
import { DatosContratacion, PaymentReference, ProcessStatus, StatusFlujo } from '@/types/Contratacion'
import { useIzziContent } from '@/components/providers/IzziProvider'
import { EntrySkeletonType } from 'contentful'
import { redirect } from 'next/navigation'
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

export type StepValidator = () => Promise<boolean>
type FormDataGetter = () => any
interface CheckoutContextType {
  currentStep: number
  completedSteps: number[]
  totalSteps: number
  isStepValid: boolean
  icon: EntrySkeletonType<ResumenIcon>
  paypalIcon: EntrySkeletonType<ResumenIcon>
  copyResumen: {}
  setIsStepValid: (value: boolean) => void
  conditionCheckboxChecked: boolean
  setConditionCheckboxChecked: (value: boolean) => void
  privacyCheckboxChecked: boolean
  setPrivacyCheckboxChecked: (value: boolean) => void

  //states steps
  datosContratacion: Partial<DatosContratacion>,
  setDatosContratacion: React.Dispatch<React.SetStateAction<Partial<DatosContratacion>>>
  getCapacity: Record<string, string>[] | null
  setGetCapacity: (value: []) => void
  izziEnroll: string
  setIzziEnroll: (value: string) => void
  processStatus: Partial<ProcessStatus>,
  setProcessStatus: React.Dispatch<React.SetStateAction<Partial<ProcessStatus>>>
  statusStep: Partial<StatusFlujo>
  setStatusStep: React.Dispatch<React.SetStateAction<Partial<StatusFlujo>>>
  paymentReference: Partial<PaymentReference> | undefined,
  setPaymentReference: React.Dispatch<React.SetStateAction<Partial<PaymentReference> | undefined>>,
  cardRecurrent: boolean,
  setCardRecurrent: React.Dispatch<React.SetStateAction<boolean>>,

  // Navigation functions
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  markStepAsCompleted: (step: number) => void

  // Helper functions
  isStepCompleted: (step: number) => boolean
  isStepActive: (step: number) => boolean
  canGoToStep: (step: number) => boolean
  getStepStatus: (step: number) => 'pending' | 'active' | 'completed'
  registerValidator: (step: number, validator: StepValidator) => void
  registerFormData: (step: number, validator: FormDataGetter) => void
  validateCurrentStep: () => Promise<boolean>
  getAllFormData: () => Record<number, any>
  registerStepValidator: (step: number, validatorFn: StepValidator) => void
}
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

interface CheckoutProviderProps {
  children: React.ReactNode
  initialStep?: number
  icon: EntrySkeletonType<ResumenIcon>
  paypalIcon: EntrySkeletonType<ResumenIcon>
  copyResumen: {}
}

export const CheckoutProvider = ({
  children,
  initialStep = 2,
  icon,
  paypalIcon,
  copyResumen,
}: CheckoutProviderProps) => {
  const [totalSteps, setTotalSteps] = useState<number>(6);
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const validators = useRef<Record<number, StepValidator>>({})
  const formGetters = useRef<Record<number, FormDataGetter>>({})
  const [stepValidators, setStepValidators] = useState<Record<number, () => Promise<boolean>>>({})
  const [isStepValid, setIsStepValid] = useState(false)
  const [conditionCheckboxChecked, setConditionCheckboxChecked] = useState(false);
  const [privacyCheckboxChecked, setPrivacyCheckboxChecked] = useState(false);
  const [getCapacity, setGetCapacity] = useState<Record<string, string>[] | null>(null);
  const [paymentReference, setPaymentReference] = useState<Partial<PaymentReference> | undefined>(undefined);
  const [cardRecurrent, setCardRecurrent] = useState<boolean>(false);
  const [statusStep, setStatusStep] = useState<Partial<StatusFlujo>>({
    step1: { completado: true },
    step2: { completado: false },
    step3: { completado: false },
    step4: { completado: false },
    step5: { completado: false },
    step6: { completado: false },
  });

  const { setGlobalDatosContratacion, setGlobalProcessStatus, globalFlagDomicilio } = useIzziContent();
  
  // states con informacion del los steps
  const [datosContratacion, setDatosContratacion] = useState<Partial<DatosContratacion>>({});
  
  // states con informacion de las apis
  const [izziEnroll, setIzziEnroll] = useState<string>("");
  const [processStatus, setProcessStatus] = useState<Partial<ProcessStatus>>({});
  
  useEffect(() => setGlobalDatosContratacion(datosContratacion), [datosContratacion, setGlobalDatosContratacion]);
  useEffect(() => setGlobalProcessStatus(processStatus), [processStatus, setGlobalProcessStatus]);
  useEffect(() => setTotalSteps(globalFlagDomicilio ? 5 : 6), [globalFlagDomicilio]);
  
  const goToStep = useCallback((step: number) => {
    if (step === 1) {
      redirect('/configurador');
    } else if (step > 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }, [totalSteps])

  const markStepAsCompleted = useCallback((step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step])
    }
  }, [completedSteps])

  const nextStep = useCallback(async () => {
    const validator = validators.current[currentStep]
    if (validator) {
      const valid = await validator()
      if (!valid) return
    }

    if (currentStep < totalSteps) {
      markStepAsCompleted(currentStep)
      setCurrentStep(prev => prev + 1)
    }
  }, [currentStep, totalSteps, markStepAsCompleted])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const isStepCompleted = useCallback((step: number) => {
    return completedSteps.includes(step)
  }, [completedSteps])

  const isStepActive = useCallback((step: number) => {
    return step === currentStep
  }, [currentStep])

  const canGoToStep = useCallback((step: number) => {
    // Permitir navegar a steps anteriores o al siguiente step si el actual está completado
    return step <= currentStep || completedSteps.includes(currentStep)
  }, [currentStep, completedSteps])

  const getStepStatus = useCallback((step: number): 'pending' | 'active' | 'completed' => {
    if (completedSteps.includes(step)) return 'completed'
    if (step === currentStep) return 'active'
    return 'pending'
  }, [currentStep, completedSteps])

  const registerValidator = useCallback((step: number, validator: StepValidator) => {
    validators.current[step] = validator
  }, [])

  const registerFormData = useCallback((step: number, validator: FormDataGetter) => {
    formGetters.current[step] = validator
  }, [])

  const getAllFormData = useCallback(() => {
    const out: Record<number, any> = {}
    for (const key of Object.keys(formGetters.current)) {
      const step = Number(key)
      out[step] = formGetters.current[step]()
    }
    return out
  }, [])

  const registerStepValidator = useCallback((step: number, validatorFn: () => Promise<boolean>) => {
    setStepValidators(prev => ({ ...prev, [step]: validatorFn }))
  }, [])

  const validateCurrentStep = useCallback(async () => {
    const validator = stepValidators[currentStep]
    if (!validator) return true
    return await validator()
  }, [stepValidators, currentStep])

  useEffect(() => {
    const status = isStepCompleted(currentStep);
    if (!status) {
      setIsStepValid(false)
    }
  }, [isStepCompleted, currentStep, totalSteps]);


  const value: CheckoutContextType = {
    currentStep,
    completedSteps,
    totalSteps,
    icon,
    paypalIcon,
    copyResumen,
    goToStep,
    nextStep,
    prevStep,
    markStepAsCompleted,
    isStepCompleted,
    isStepActive,
    canGoToStep,
    getStepStatus,
    registerValidator,
    registerFormData,
    validateCurrentStep,
    getAllFormData,
    registerStepValidator,
    isStepValid,
    setIsStepValid,
    conditionCheckboxChecked,
    setConditionCheckboxChecked,
    privacyCheckboxChecked,
    setPrivacyCheckboxChecked,
    datosContratacion,
    setDatosContratacion,
    getCapacity,
    setGetCapacity,
    izziEnroll,
    setIzziEnroll,
    processStatus,
    setProcessStatus,
    statusStep,
    setStatusStep,
    paymentReference,
    setPaymentReference,
    cardRecurrent,
    setCardRecurrent
  }

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  )
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }
  return context
}

export default CheckoutProvider