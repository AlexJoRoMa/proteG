/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, CardBody, Tab, Tabs, Radio, RadioGroup } from '@heroui/react'
import PagoTecnico from './metodosPago/PagoTecnico';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import PaymentInfoBanner from './metodosPago/PaymentInfoBanner';
import PagoPayPal from './metodosPago/PagoPayPal';
import PagoTarjeta from './metodosPago/PagoTarjeta';
import { useCheckout } from '@/components/providers/CheckoutProvider';
import { useIzziContent } from '@/components/providers/IzziProvider';
import { MetodoPago, TabConfigItem } from '@/types/Contratacion';

const RadioStyles = {
  base: "flex items-center p-0 xl:py-0 w-full m-0 pl-3 ",
  control: "group-data-[selected=true]:bg-black-0 h-[10px] w-[10px]",
  wrapper: "bg-white-0 group-data-[selected=true]:border-black-0 border-1 h-[24px] w-[24px]",
  label: "text-base xl:text-lg"
}
const boxStyle = 'border border-gray-100 rounded-xl pt-4 pb-4';
const topMargin = 'mt-5'

const TABS_CONFIG = (getValue: (key: string) => string, globalFlagDomicilio: boolean): TabConfigItem[] => {
  const baseTabs: TabConfigItem[] = [
    {
      key: "creditCard",
      title: getValue("pago.tarjet.titulo"),
      Component: PagoTarjeta,
      isHidden: false
    },
    {
      key: "paypal",
      title: getValue("pago.paypal.titulo"),
      Component: PagoPayPal,
      isHidden: true
    }
  ];

  if (!globalFlagDomicilio) {
    baseTabs.push({
      key: "tecnico",
      title: getValue("pago.tecnico.titulo"),
      Component: PagoTecnico,
      isHidden: false
    });
  }
  return baseTabs;
};

const Step6 = () => {

  const { getValue } = useMicrocopies('contratacion-pago');
  const { globalFlagDomicilio } = useIzziContent();
  const { setDatosContratacion, currentStep, setIsStepValid, totalSteps } = useCheckout();

  const [selectedTab, setSelectedTab] = useState<MetodoPago>("creditCard");
  const tabsConfig = TABS_CONFIG(getValue, globalFlagDomicilio);

  const [radioState, setRadioState] = useState<MetodoPago | ''>('');

  useEffect(() => {
    if (currentStep === totalSteps) {
      setIsStepValid(true);
      setDatosContratacion((prev) => ({
        ...prev,
        Pago: {
          ...prev.Pago,
          metodoPago: selectedTab,
        }
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  function handleTabChange(key: React.Key) {
    const metodo = key as MetodoPago;
    setSelectedTab(metodo);

    setDatosContratacion((prev) => ({
      ...prev,
      Pago: {
        ...prev.Pago,
        metodoPago: metodo,
      }
    }));
  };

  return (
    <>
    <h1>{getValue('pago.seleccionar.titulo')}</h1>
    <RadioGroup
    orientation='vertical'
    className='flex flex-col gap-6 mt-6 w-full items-start h-[144px]'
    value={radioState}
    classNames={{
      wrapper: "flex flex-col w-full !gap-6",
      base: "h-full"
    }}
    onValueChange={(val) => setRadioState(val as MetodoPago)}
    >
      <h2>Pagon en línea</h2>
      <div className={boxStyle}>
        <Radio
        value='creditCard'
        classNames={RadioStyles}
        >
          <p>{getValue('pago.tarjet.titulo')}</p>
        </Radio>
      {radioState === 'creditCard' && (
        <div className={topMargin}>
          <PagoTarjeta/>
        </div>
      )}
      </div>

      <div className={boxStyle}>
        <Radio
        value={'Pago Paypal'}
        classNames={RadioStyles}
        >
          <p>{getValue('pago.paypal.titulo')}</p>
        </Radio>
      </div>

      <h2>Pagon en efectivo</h2>
      <div className={boxStyle}>
        <Radio
        value={'Pago Tecnico'}
        classNames={RadioStyles}
        >
          <p>{getValue('pago.tecnico.titulo')}</p>
        </Radio>
      </div>

    </RadioGroup>

      {/* <Tabs
        aria-label="Options"
        className='w-full'
        fullWidth={true}
        variant='underlined'
        defaultSelectedKey={selectedTab}
        onSelectionChange={handleTabChange}
        classNames={{
          tabList: "pb-0",
          base: "border-b-1 border-b-gray-150",
          tab: "pb-[16px] text-[14px] md:text-[16px] font-normal leading-[16px] text-black-0 data-[selected=true]:text-gray-450 data-[selected=true]:font-bold",
          tabContent: "flex-warp !text-warp whitespace-normal"
        }}
      >
        {
          tabsConfig.map(({ key, title, Component, isHidden }) => (
            !isHidden &&
            <Tab key={key} title={title}>
              <PaymentInfoBanner />
              <Component />
            </Tab>
          ))
        }
      </Tabs> */}

    </>
  )
}

export default Step6
