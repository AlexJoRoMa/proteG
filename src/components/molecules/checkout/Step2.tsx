import React, { useEffect } from 'react';
import { Button, Checkbox, Divider, Switch } from '@heroui/react'
import Link from 'next/link'
import { useStep2Form } from '@/hooks/checkout/useStep2Form';
import { DatosPersonalesForm } from './formularios/DatosPersonalesForm';
import { DireccionEnvioForm } from './formularios/DireccionEnvioForm';
import { DireccionFacturacionForm } from './formularios/DireccionFacturacionForm';
import { DatosFacturacionForm } from './formularios/DatosFacturacionForm';
import ButtonGhost from '@/components/atoms/ButtonGhost';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import { useIzziContent } from '@/components/providers/IzziProvider';
import { EditCoberturaIcon } from '@/constants/IconsConstants';

const FALLBACKS: Record<string, string> = {
  'datosPersonales.privacidad.textoPrevio': 'Acepto los',
  'datosPersonales.privacidad.textoPrincipal': 'Avisos de Privacidad',
  'datosPersonales.privacidad.url': 'https://qaizzi.izzi.mx/aviso-de-privacidad',
};

const Step2 = () => {
  const { getValue } = useMicrocopies('contratacion-datosPersonales');
  const { formattedAddress } = useIzziContent();
  const getText = (key: string) => getValue(key) || FALLBACKS[key] || key;

  const {
    DatosPersonalesRef,
    DireccionEnvioRef,
    DatosFacturacionRef,
    DireccionFacturacionRef,
    esExtranjero,
    setEsExtranjero,
    necesitaFacturar,
    setNecesitaFacturar,
    facturarOtraDireccion,
    setFacturarOtraDireccion,
    cfdi,
    setCfdi,
    regimen,
    setRegimen,
    rfc,
    setRfc,
    isDireccionFacturacionValid,
    isPersonalValid,
    setIsPersonalValid,
    setIsEnvioValid,
    setIsFacturacionValid,
    setIsDireccionFacturacionValid,
    conditionChecked,
    setConditionChecked,
    privacyChecked,
    setPrivacyChecked,
    submitAttempted,
    submitfacturation,
    setSubmitfacturation,
    submitOtherDirection,
    setSubmitOtherDirection
  } = useStep2Form();

  const showCheckboxErrors = submitAttempted && (!conditionChecked || !privacyChecked);

  const handleConditionCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setConditionChecked(value);
  }

  const handlePrivacyCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setPrivacyChecked(value);
  }

  const updateIsForeign = (value: boolean) => setEsExtranjero(value)

  useEffect(() => {
    if (!necesitaFacturar) {
      setFacturarOtraDireccion(false);
    }
  }, [necesitaFacturar, setFacturarOtraDireccion])

  const getLocalBillingData = () => {
    if (typeof window === 'undefined') return null
    return JSON.parse(localStorage.getItem('PersistentBillingData') as string)
  }
  const getLocalAdditionalAddressData = () => {
    if (typeof window === 'undefined') return null
    return JSON.parse(localStorage.getItem('PersistentAdditionalAddressData') as string)
  }

  useEffect(() => {
    if (!!getLocalBillingData()) {
      setNecesitaFacturar(!necesitaFacturar)
    }
    if (!!getLocalAdditionalAddressData()) {
      setFacturarOtraDireccion(!facturarOtraDireccion)
    }
  }, [])

  return (
    <div className='step2-container'>
      <div className='flex flex-col md:grid md:grid-cols-2 items-center w-full mb-[24px] md:mb-10'>
        <div className='flex items-center w-full justify-between mb-6 md:mb-0'>
          <p className='text-nowrap text-base'>{getValue('datosPersonales.cliente.titulo')}</p>
          <Link
            href={getValue('datosPersonales.cliente.url')}
            className='w-[90px] md:w-[180px] h-[40px] flex justify-center items-center
                      rounded-md bg-[var(--color-gray-450)] text-white text-[16px] leading-6
                      hover:bg-white hover:text-[var(--color-gray-450)] hover:border-1'
          >
            {getValue('datosPersonales.cliente.btn')}
          </Link>
        </div>

        <Divider orientation="horizontal" className='!border-[var(--color-gray-300)] mb-[16px] block md:hidden' />

        <div className='flex items-center justify-between md:justify-end w-full gap-[53px]'>
          <p className='text-nowrap text-base'>{getValue('datosPersonales.extranjero')}</p>
          <Switch
            aria-label="Extrangero"
            isSelected={esExtranjero}
            onValueChange={(checked) => setEsExtranjero(checked)}
            classNames={{
              wrapper: "bg-gray-100 group-data-[selected=true]:!bg-black-0",
              thumb: "bg-white-0"
            }}
          />
        </div>
      </div>

      <DatosPersonalesForm
        formRef={DatosPersonalesRef}
        esExtrangero={esExtranjero}
        isValid={isPersonalValid}
        setIsValid={setIsPersonalValid}
        updateIsForeign={updateIsForeign}
        submitAttempted={submitAttempted}
      />

      <Divider orientation="horizontal" className='!border-[var(--color-gray-300)] mt-12 mb-7' />

      <>
        <h4 className='mb-[38px] font-bold text-[20px] leading-6'>
          {getValue('datosPersonales.direccionInstalacion.titulo')}
        </h4>

        <div className='w-full flex items-center justify-between'>
          <p>
            {formattedAddress}
          </p>

          <Link href={getValue('datosPersonales.direccionInstalacion.urlEdicion')}>
            <Button
              className='ml-auto bg-transparent'>
              <EditCoberturaIcon />
            </Button>
          </Link>
        </div>

        <DireccionEnvioForm
          formRef={DireccionEnvioRef}
          setIsValid={setIsEnvioValid}
          submitAttempted={submitAttempted}
        />

      </>

      <div className='flex justify-between my-[24px] w-full md:w-[50%]'>
        <p>{getValue('datosPersonales.facturacion')}</p>
        <Switch
          aria-label="Facturacion"
          isSelected={necesitaFacturar}
          onValueChange={(checked) => {
            setNecesitaFacturar(checked);

            if (checked) setSubmitfacturation(false);
            if (!checked) setFacturarOtraDireccion(false);
          }}
          classNames={{
            wrapper: "bg-gray-100 group-data-[selected=true]:!bg-black-0",
            thumb: "bg-white-0"
          }}
        />
      </div>

      {
        (necesitaFacturar || facturarOtraDireccion) && (
          <>
            <DatosFacturacionForm
              formRef={DatosFacturacionRef}
              cfdi={cfdi}
              setCfdi={setCfdi}
              regimen={regimen}
              setRegimen={setRegimen}
              rfc={rfc}
              setRfc={setRfc}
              setIsValid={setIsFacturacionValid}
              submitAttempted={submitfacturation}
            />

            <div className='flex justify-between mt-[24px] w-full md:w-[50%]'>
              <p>{getValue('datosPersonales.facturarOtraDireccion')}</p>
              <Switch
                aria-label="Direccion Diferente"
                isSelected={facturarOtraDireccion}
                onValueChange={(checked) => {
                  setFacturarOtraDireccion(checked)

                  if (checked) setSubmitOtherDirection(false);

                }}
                classNames={{
                  wrapper: "bg-gray-100 group-data-[selected=true]:!bg-black-0",
                  thumb: "bg-white-0"
                }}
              />
            </div>

            {
              facturarOtraDireccion && (
                <DireccionFacturacionForm
                  formRef={DireccionFacturacionRef}
                  setIsValid={setIsDireccionFacturacionValid}
                  submitAttempted={submitOtherDirection}
                  isAddressValid={isDireccionFacturacionValid}
                />
              )
            }
          </>
        )
      }

      <Divider orientation="horizontal" className='!border-[var(--color-gray-300)] mt-6 mb-7' />

      <div className='flex flex-col gap-[12px] pb-8'>
        <div>
          <Checkbox
            defaultSelected={false}
            isRequired
            color={"default"}
            checked={conditionChecked}
            onChange={handleConditionCheckboxChange}
            radius='sm'
            className='text-gray-450'
            classNames={{
              wrapper: "before:!bg-white-0 before:border-0 !border-1 border-black-0 group-data-[selected=true]:after:!bg-white-0 group-data-[invalid=true]:!border-red-700",
              icon: "w-[14px] h-[12px]",
              label: "group-data-[invalid=true]:!text-red-700"
            }}
            isInvalid={showCheckboxErrors && !conditionChecked}
          >
            {getText('datosPersonales.terminos.textoPrevio')}
          </Checkbox>
          <ButtonGhost
            classStyles={`text-black underline font-bold text-[16px] leading-6 underline p-0 border-0 ml-[4px] ${(showCheckboxErrors && !conditionChecked) && 'text-red-700'}`}
            text={getText('datosPersonales.terminos.textoPrincipal')}
            href={getText('datosPersonales.terminos.url')}
            external={true}
          >
          </ButtonGhost>
        </div>

        <div>
          <Checkbox
            isRequired
            checked={privacyChecked}
            onChange={handlePrivacyCheckboxChange}
            defaultSelected={false}
            color="default"
            radius='sm'
            className='text-gray-450'
            classNames={{
              wrapper: "before:!bg-white-0 before:border-0 !border-1 border-black-0 group-data-[selected=true]:after:!bg-white-0 group-data-[invalid=true]:!border-red-700",
              icon: "w-[14px] h-[12px]",
              label: "group-data-[invalid=true]:!text-red-700"
            }}
            isInvalid={showCheckboxErrors && !privacyChecked}
          >
            {getText('datosPersonales.privacidad.textoPrevio')}
          </Checkbox>
          <ButtonGhost
            classStyles={`text-black underline font-bold text-[16px] leading-6 underline p-0 border-0 ml-[4px] ${(showCheckboxErrors && !privacyChecked) && 'text-red-700'}`}
            text={getText('datosPersonales.privacidad.textoPrincipal')}
            href={getText('datosPersonales.privacidad.url')}
            external={true}
          >
          </ButtonGhost>
        </div>
      </div>

    </div>
  )
}

export default Step2
