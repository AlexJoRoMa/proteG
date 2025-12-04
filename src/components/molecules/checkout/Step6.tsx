/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, CardBody, Tab, Tabs } from '@heroui/react'
import PagoTecnico from './metodosPago/PagoTecnico';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import PaymentInfoBanner from './metodosPago/PaymentInfoBanner';
import PagoPayPal from './metodosPago/PagoPayPal';
import PagoTarjeta from './metodosPago/PagoTarjeta';
import { useCheckout } from '@/components/providers/CheckoutProvider';
import { useIzziContent } from '@/components/providers/IzziProvider';
import { MetodoPago, TabConfigItem } from '@/types/Contratacion';

const TABS_CONFIG = (getValue: (key: string) => string, globalFlagDomicilio: boolean): TabConfigItem[] => {
  const baseTabs: TabConfigItem[] = [
    {
      key: "creditCard",
      title: getValue("pago.tarjet.titulo"),
      Component: PagoTarjeta
    },
    {
      key: "paypal",
      title: getValue("pago.paypal.titulo"),
      Component: PagoPayPal
    }
  ];

  if (!globalFlagDomicilio) {
    baseTabs.push({
      key: "tecnico",
      title: getValue("pago.tecnico.titulo"),
      Component: PagoTecnico
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

      <Tabs
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
          tabsConfig.map(({ key, title, Component }) => (
            <Tab key={key} title={title}>
              <PaymentInfoBanner />
              <Component />
            </Tab>
          ))
        }
      </Tabs>

    </>
  )
}

export default Step6
