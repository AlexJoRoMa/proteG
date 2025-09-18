'use client'
import React, { createContext, useContext, useState, useCallback } from 'react'

interface CheckoutContextType {
  currentStep: number
  completedSteps: number[]
  totalSteps: number
  
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
  initialStep = 1 
}: CheckoutProviderProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }, [totalSteps])

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      // Marcar el step actual como completado antes de avanzar
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep])
      }
      setCurrentStep(prev => prev + 1)
    }
  }, [currentStep, totalSteps, completedSteps])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const markStepAsCompleted = useCallback((step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step])
    }
  }, [completedSteps])

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
    getStepStatus
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