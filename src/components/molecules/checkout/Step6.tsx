/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Radio, RadioGroup } from '@heroui/react'
import PagoTecnico from './metodosPago/PagoTecnico';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import PaymentInfoBanner from './metodosPago/PaymentInfoBanner';
import PagoPayPal from './metodosPago/PagoPayPal';
import PagoTarjeta from './metodosPago/PagoTarjeta';
import { useCheckout } from '@/components/providers/CheckoutProvider';
import { useIzziContent } from '@/components/providers/IzziProvider';
import { MetodoPago } from '@/types/Contratacion';
import { CreditCardIcon, PayPalIcon, ToolboxIcon } from "@/constants/IconsConstants";

const RadioStyles = {
  base: "flex items-center p-0 xl:py-0 w-full m-0 pl-5 ",
  control: "group-data-[selected=true]:bg-black-0 h-[10px] w-[10px]",
  wrapper: "bg-white-0 group-data-[selected=true]:border-black-0 border-1 h-[24px] w-[24px]",
  label: "text-base xsm:text-[16px] xl:text-[20px]"
}
const boxStyle = 'border border-gray-100 rounded-xl pt-4 pb-4 flex flex-col items-center w-full';
const topMargin = 'mt-5 w-full px-4'
const subTitleStyle = 'xsm:text-[16px] xl:text-[20px]'

const Step6 = () => {

  const { getValue } = useMicrocopies('contratacion-pago');
  const { globalFlagDomicilio } = useIzziContent();
  const { setDatosContratacion, currentStep, setIsStepValid, totalSteps } = useCheckout();

  const [radioState, setRadioState] = useState<MetodoPago | ''>('');
  
  useEffect(() => {
    
    if (currentStep === totalSteps) {
      const isValid = radioState !== '';
      setIsStepValid(isValid);
      setDatosContratacion((prev) => ({
        ...prev,
        Pago: {
          ...prev.Pago,
          metodoPago: radioState as MetodoPago,
        }
      }));
    }
  
  }, [radioState, currentStep, totalSteps, setDatosContratacion, setIsStepValid])

  const handleRadioChange = (value: string) => {
    const metodo = value as MetodoPago
    setRadioState(metodo)

    setDatosContratacion((prev) => ({
      ...prev,
      Pago: {
        ...prev.Pago,
        metodoPago: metodo,
      }
    }));
  }

  return (
    <>
      <p className='xsm:text-[20px] xl:text-[24px] font-bold '>{getValue('pago.seleccionar.titulo')}</p>
    <RadioGroup
    orientation='vertical'
    className='flex flex-col gap-6 mt-6 w-full items-start h-full'
    value={radioState}
    classNames={{
      wrapper: "flex flex-col w-full !gap-6",
      base: "h-full"
    }}
    onValueChange={handleRadioChange}
    >

      <p className={subTitleStyle}>{getValue('pago.tipo.titulo.linea')}</p>
      <div className={boxStyle}>
        <div className='flex  gap-3 justify-between pr-4  w-full'>
          <Radio
            value='creditCard'
            classNames={RadioStyles}
            >
              <p>{getValue('pago.tarjet.titulo')}</p>
          </Radio>
          <CreditCardIcon/>
        </div>
        {radioState === 'creditCard' && (
          <div className={topMargin}>
            <PagoTarjeta/>
          </div>
        )}
      </div>
      

      {<div className={boxStyle}>
        <div className='flex  gap-3 justify-between pr-4  w-full'>
          <Radio
            value='paypal'
            classNames={RadioStyles}
            >
              <p>{getValue('pago.paypal.titulo')}</p>
          </Radio>
          <PayPalIcon/>
        </div>
        {radioState === 'paypal' && (
          <div className={topMargin}>
            <PagoPayPal/>
          </div>
        )}
      </div>}


      {!globalFlagDomicilio && (
        <>
          <p className={subTitleStyle}>{getValue('pago.tipo.titulo.efectivo')}</p>
          <div className={boxStyle}>
            <div className='flex  gap-3 justify-between pr-4  w-full'>
              <Radio
              value='tecnico'
              classNames={RadioStyles}
              >
                <p>{getValue('pago.tecnico.titulo')}</p>
              </Radio>
              <ToolboxIcon/>
            </div>
            {radioState === 'tecnico' && (
              <div className={topMargin}>
                <PagoTecnico/>
              </div>
            )}
          </div>
        </>
      )}


    </RadioGroup>

    </>
  )
}

export default Step6
