'use client'
import { redirect } from 'next/navigation'
import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

export type StepValidator = () => Promise<boolean>
type FormDataGetter = () => any
interface CheckoutContextType {
  currentStep: number
  completedSteps: number[]
  totalSteps: number
  isStepValid: boolean
  setIsStepValid: (value: boolean) => void
  checkboxChecked: boolean
  setCheckboxChecked: (value: boolean) => void

  //states steps
  datosContratacion: {},
  setDatosContratacion: (value: {}) => void
  getCapacity: Record<string, string>[] | null
  setGetCapacity: (value: []) => void
  getIntentosInstalacion: number
  setGetIntentosInstalacion: (value: number) => void

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
  totalSteps?: number
  initialStep?: number
}

export const CheckoutProvider = ({
  children,
  totalSteps = 6,
  initialStep = 2
}: CheckoutProviderProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const validators = useRef<Record<number, StepValidator>>({})
  const formGetters = useRef<Record<number, FormDataGetter>>({})
  const [stepValidators, setStepValidators] = useState<Record<number, () => Promise<boolean>>>({})
  const [isStepValid, setIsStepValid] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [getCapacity, setGetCapacity] = useState<Record<string, string>[] | null>(null);
  const [getIntentosInstalacion, setGetIntentosInstalacion] = useState<number>(0);

  // states con informacion del los steps
  const [datosContratacion, setDatosContratacion] = useState({});

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
    const out:Record<number, any> = {}
    for (const key of Object.keys(formGetters.current)) {
      const step = Number(key)
      out[step] = formGetters.current[step]()
    }
    return out
  }, [])

  const registerStepValidator = useCallback((step: number, validatorFn: () => Promise<boolean>) => {
    setStepValidators(prev => ({...prev, [step]: validatorFn}))
  }, [])

  const validateCurrentStep = useCallback(async () => {
    const validator = stepValidators[currentStep]
    if (!validator) return true
    return await validator()
  }, [stepValidators, currentStep])

  const value: CheckoutContextType = {
    currentStep,
    completedSteps,
    totalSteps,
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
    checkboxChecked,
    setCheckboxChecked,
    datosContratacion,
    setDatosContratacion,
    getCapacity,
    setGetCapacity,
    getIntentosInstalacion,
    setGetIntentosInstalacion
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