/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Form, InputOtp, radio, Radio, RadioGroup } from '@heroui/react'
import { useStep3Form } from '@/hooks/checkout/useStep3Form';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import { useIzziContent } from '@/components/providers/IzziProvider';
import { useCheckout } from '@/components/providers/CheckoutProvider';
import { GetEnvioCodigo } from '@/utils/GetEnvioCodigo';

const RadioStyles = {
  base: "flex items-center p-0 xl:py-0 w-full m-0",
  control: "group-data-[selected=true]:bg-black-0 h-[10px] w-[10px]",
  wrapper: "bg-white-0 group-data-[selected=true]:border-black-0 border-1 h-[24px] w-[24px]",
  label: "text-base xl:text-lg"
}

interface Step3Props {
  showWhatsApp?: boolean;
  showSMS?: boolean;
  showCorreo?: boolean;
}

const Step3 = ({ 
  showWhatsApp = true, 
  showSMS = true, 
  showCorreo = true 
}: Step3Props = {}) => {

  const { globalIzziSelection, promoData, precioTotal } = useIzziContent();
  const { datosContratacion } = useCheckout();
  const [radioState, setRadioState] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [sendCode, setSendCode] = useState(false);

  const {
    CodigoVerificacionRef,
    LastVerifiedCodeRef,
    handleOtpChange,
    startTimer,
    timer,
    isLoading,
    isValid,
    resetStep3,
    idTransaction,
    setIsValid,
    setIsStepValid,
    setIsLoading,
    setOtpValue,
    setTimer
  } = useStep3Form(radioState);
  const { getValue } = useMicrocopies('contratacion-verificaContacto');

  async function handleSendCode() {
    setSendCode(true);
    setInputCode('');
    startTimer();

    GetEnvioCodigo(datosContratacion, globalIzziSelection, promoData, precioTotal, idTransaction, radioState);

  }

  function hanldeResendCode() {
    setIsValid(null);
    setIsStepValid(false);
    setIsLoading(false);
    LastVerifiedCodeRef.current = null;

    //limpia el input OTP
    setOtpValue("");

    //reinicia timer
    setTimer(0);
    handleSendCode();
  }

  useEffect(() => {
    handleOtpChange(inputCode);
  }, [inputCode, handleOtpChange]);

  const formatTime = (seconds: number) => {
    const minutos = Math.floor(seconds / 60).toString().padStart(2, '0');
    const segundos = (seconds % 60).toString().padStart(2, '0');
    return `${minutos}:${segundos}`;
  }

  return (
    <>
      <div>
        <h5
          className='text-base xl:text-[18px] font-bold leading-6 mb-2.5'
        >
          {getValue('verificacion.titulo')}
        </h5>
        <p
          className='text-base xl:text-[18px] leading-6 mb-2.5'
        >
          {`${getValue('verificacion.subtitulo.texto1')} `}
          <b>{`${getValue('verificacion.subtitulo.texto2')} `}</b>
          {`${getValue('verificacion.subtitulo.texto3')} `}
          <b>{getValue('verificacion.subtitulo.texto4')}</b>
        </p>

        <RadioGroup
          orientation='vertical'
          className='flex flex-col gap-6 mt-6 w-full items-start h-[144px]'
          value={radioState}
          classNames={{
            wrapper: "flex flex-col w-full !gap-6",
            base: "h-full"
          }}
          onChange={(e) => {
            setRadioState(e.target.value);
            setSendCode(false);
            setInputCode("");
            resetStep3();
          }}
        >
          {showWhatsApp && (
            <Radio
              value={getValue('verificacion.radio.value.whatsapp')}
              classNames={RadioStyles}
            >
              <b>{getValue('verificacion.radio.titulo.whatsapp')}</b> {datosContratacion.DatosPersonales?.personal.phone}
            </Radio>
          )}
          {showSMS && (
            <Radio
              value={getValue('verificacion.radio.value.sms')}
              classNames={RadioStyles}
            > <b>{getValue('verificacion.radio.titulo.sms')}</b> {datosContratacion.DatosPersonales?.personal.phone}
            </Radio>
          )}
          {showCorreo && (
            <Radio
              value={getValue('verificacion.radio.value.correo')}
              classNames={RadioStyles}
            >
              <b>{getValue('verificacion.radio.titulo.correo')}</b> {datosContratacion.DatosPersonales?.personal.email}
            </Radio>
          )}
        </RadioGroup>

        <div className='flex w-full justify-center mt-[24px] xl:mt-[48px]'>
          <Button
            disabled={!radioState || sendCode}
            className='h-[48px] py-[14px] px-[16px] bg-black-0 border-black-0 rounded-md w-3xs text-white-0 font-semibold leading-[24px] text-lg text-center disabled:bg-gray-150 disabled:text-gray-50'
            onPress={handleSendCode}
          >
            {!sendCode ? getValue('verificacion.btn.enviar') : getValue('verificacion.btn.enviado')}
          </Button>
        </div>
      </div>

      <>
        {sendCode && (
          <>
            <p
              className='text-base xl:text-[18px] leading-6 mb-6 text-start xl:text-center mt-6'
            >
              <b>{`${getValue('verificacion.validacion.titulo.texto1')} `}</b>
              {`${getValue('verificacion.validacion.titulo.texto2')} ${radioState}.`}
            </p>

            <Form
              ref={CodigoVerificacionRef}
              onSubmit={(e) => e.preventDefault()}
            >
              <InputOtp
                length={4}
                className='mx-auto'
                defaultValue="1234"
                radius='md'
                isRequired
                size='lg'
                variant='bordered'
                value={inputCode}
                required={false}
                readOnly={isValid === true}
                classNames={{
                  segment: "border-1 border-black-0 w-[52px] xl:w-[64px] h-[52px] xl:h-[64px] text-2xl",
                  segmentWrapper: "flex gap-[16px]",
                  wrapper: "justify-center",
                  errorMessage: "hidden",
                  caret: "text-black-0"
                }}
                onValueChange={setInputCode}
              />
            </Form>

            {isValid === true && (
              <p
                className='text-base xl:text-[18px] font-bold leading-6 mb-6 text-center mt-6'
              >
                {getValue('verificacion.validacion.codigoCorrecto')}
              </p>
            )}

            {isValid === false && (
              <div className='countdown-timer flex flex-col gap-[8px] text-center mt-6 text-(--color-red-700) font-bold text-base xl:text-lg'>
                <span>{formatTime(timer)}</span>
                <div className='flex flex-col font-bold leading-[24px] text-base xl:text-lg'>
                  <p
                    className='text-base xl:text-[18px] font-bold leading-6 text-center text-(--color-red-700)'
                  >
                    {getValue('verificacion.error.codigoInvalido')}
                  </p>
                </div>
                {
                  timer <= 0 && (
                    <button
                      className='text-black-0 underline font-bold text-base xl:text-lg cursor-pointer'
                      onClick={() => {
                        setIsValid(null);
                        hanldeResendCode();
                      }}
                    >
                      {getValue('verificacion.error.nuevoCodigo')}
                    </button>
                  )
                }
              </div>
            )}

            {timer > 0 && isValid === null && (
              <div className='countdown-timer text-center mt-6 text-(--color-green-700) font-bold text-base xl:text-lg'>
                <span>{formatTime(timer)}</span>
              </div>
            )}

            {
              timer <= 0 && isValid === null && (
                <div className='countdown-timer flex flex-col gap-[8px] text-center mt-6 text-(--color-red-700) font-bold text-base xl:text-lg'>
                  <span>{formatTime(timer)}</span>
                  <div className='flex flex-col font-bold leading-[24px] text-base xl:text-lg'>
                    <span>{getValue('verificacion.error.sinCodigo')}</span>
                    <button
                      className='text-black-0 underline font-bold cursor-pointer'
                      onClick={() => {
                        setIsValid(null);
                        hanldeResendCode();
                      }}
                    >
                      {getValue('verificacion.error.nuevoCodigo')}
                    </button>
                  </div>
                </div>
              )
            }
          </>
        )
        }
      </>
    </>

  )
}

export default Step3
