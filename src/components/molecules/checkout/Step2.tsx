import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Divider, Switch } from '@heroui/react'
import Link from 'next/link'
import { useStep2Form } from '@/hooks/checkout/useStep2Form';
import { DatosPersonalesForm } from './formularios/DatosPersonalesForm';
import { DireccionEnvioForm } from './formularios/DireccionEnvioForm';
import { DireccionFacturacionForm } from './formularios/DireccionFacturacionForm';
import { DatosFacturacionForm } from './formularios/DatosFacturacionForm';
import { useCheckout } from '@/components/providers/CheckoutProvider';

const Step2 = () => {
  const { registerStepValidator, currentStep, setCheckboxChecked } = useCheckout();
  const [checked, setChecked] = useState(false);

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
    setRegimen
  } = useStep2Form();

  const hanldeCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    console.log('value', value)
    setChecked(value);
    setCheckboxChecked(value);
  }

  useEffect(() => {
    if (!necesitaFacturar) {
      setFacturarOtraDireccion(false);
    }
  }, [necesitaFacturar])


  return (
    <div className='step2-container'>

      <div className='flex flex-col md:grid md:grid-cols-2 items-center w-full mb-[24px] md:mb-10'>
        <div className='flex items-center w-full justify-between mb-6 md:mb-0'>
          <p className='text-nowrap text-base'>¿Ya eres cliente?</p>
          <Link
            href="#"
            className='w-[90px] md:w-[180px] h-[40px] flex justify-center items-center
                      rounded-md bg-[var(--color-gray-450)] text-white text-[16px] leading-6
                      hover:bg-white hover:text-[var(--color-gray-450)] hover:border-1'
          >
            Acceder
          </Link>
        </div>

        <Divider orientation="horizontal" className='!border-[var(--color-gray-300)] mb-[16px] block md:hidden' />

        <div className='flex items-center justify-between md:justify-end w-full gap-[53px]'>
          <p className='text-nowrap text-base'>¿Eres extranjero?</p>
          <Switch
            aria-label="Extrangero"
            isSelected={esExtranjero}
            onValueChange={setEsExtranjero}
            classNames={{
              wrapper: "bg-gray-100 group-data-[selected=true]:!bg-black-0",
              thumb: "bg-white-0"
            }}
          />
        </div>
      </div>

      <DatosPersonalesForm formRef={DatosPersonalesRef} esExtrangero={esExtranjero} />

      <Divider orientation="horizontal" className='!border-[var(--color-gray-300)] mt-12 mb-7' />

      <>
        <h4 className='mb-[38px] font-bold text-[20px] leading-6'>
          Dirección de instalación
        </h4>

        <div className='w-full flex items-center justify-between'>
          <p>
            Avenida Paseo De La Reforma, 457, Chapultepec
          </p>

          <Link href='#'>
            <Button
              className='ml-auto bg-transparent'>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <mask id="mask0_7201_46941" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                  <rect width="32" height="32" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_7201_46941)">
                  <path d="M2.66602 31.9999V29.3332H29.3327V31.9999H2.66602ZM7.99935 
                      22.4359H9.43002L21.1633 10.7102L20.4533 9.97424L19.725 9.27157L7.99935 
                      21.0049V22.4359ZM6.66602 23.7692V20.4359L21.625 5.48457C21.7668 5.34257 
                      21.9219 5.23913 22.0903 5.17424C22.2588 5.10935 22.4303 5.0769 22.605 5.0769C22.7797 5.0769 
                      22.9489 5.10935 23.1127 5.17424C23.2765 5.23913 23.4318 5.34513 23.5787 
                      5.49224L24.9507 6.87157C25.0976 7.01357 25.2022 7.16713 25.2647 7.33224C25.3271 
                      7.49757 25.3583 7.66835 25.3583 7.84457C25.3583 8.00968 25.3258 8.17779 25.2607
                      8.3489C25.1958 8.52002 25.0925 8.67635 24.9507 8.8179L9.99935 23.7692H6.66602ZM21.1633 
                      10.7102L20.4533 9.97424L19.725 9.27157L21.1633 10.7102Z" fill="#1C1B1F" />
                </g>
              </svg>
            </Button>
          </Link>
        </div>

        <DireccionEnvioForm formRef={DireccionEnvioRef} />

      </>

      <div className='flex justify-between my-[24px] w-full md:w-[50%]'>
        <p>¿Necesitas facturar?</p>
        <Switch
          aria-label="Facturacion"
          isSelected={necesitaFacturar}
          onValueChange={setNecesitaFacturar}
          classNames={{
            wrapper: "bg-gray-100 group-data-[selected=true]:!bg-black-0",
            thumb: "bg-white-0"
          }}
        />
      </div>

      {
        necesitaFacturar && (
          <>
            <DatosFacturacionForm
              formRef={DatosFacturacionRef}
              cfdi={cfdi}
              setCfdi={setCfdi}
              regimen={regimen}
              setRegimen={setRegimen}
            />

            <div className='flex justify-between mt-[24px] w-full md:w-[50%]'>
              <p>¿Necesitas facturar con otra dirección?</p>
              <Switch
                aria-label="Direccion Diferente"
                isSelected={facturarOtraDireccion}
                onValueChange={setFacturarOtraDireccion}
                classNames={{
                  wrapper: "bg-gray-100 group-data-[selected=true]:!bg-black-0",
                  thumb: "bg-white-0"
                }}
              />
            </div>

            {
              facturarOtraDireccion && (
                <DireccionFacturacionForm formRef={DireccionFacturacionRef} />
              )
            }
          </>
        )
      }

      <Divider orientation="horizontal" className='!border-[var(--color-gray-300)] mt-6 mb-7' />

      <div className='mb-[16px] xl:mb-[132px]'>
        <label
          className='flex items-start gap-3 text-base cursor-pointer'
        >
          <input
            type='checkbox'
            name='aceptoTerminos'
            required
            checked={checked}
            onChange={hanldeCheckboxChange}
            className='w-4 h-4 mt-1 accent-black-0'
          />
          <span
            className='ml-2'
          >
            Acepto los {' '}
            <Link
              href="#"
              className='underline font-bold'
            >
              Términos y Condiciones de uso
            </Link>
          </span>
        </label>
      </div>

    </div>
  )
}

export default Step2
