import React from 'react';
import { Tab, Tabs } from '@heroui/react'
import PagoTecnico from './metodosPago/PagoTecnico';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import PaymentInfoBanner from './metodosPago/PaymentInfoBanner';
import PagoPayPal from './metodosPago/PagoPayPal';
import PagoTarjeta from './metodosPago/PagoTarjeta';


const Step6 = () => {

  const { getValue } = useMicrocopies('contratacion-pago');

  return (
    <>
      <Tabs
        className='flex flex-col md:flex-row gap-6'
        fullWidth
        variant='underlined'
        defaultSelectedKey={"creditCard"}
        classNames={{
          tabList: "pb-0",
          base: "border-b-1 border-b-gray-150",
          tab: "pb-[16px] text-[14px] md:text-[16px] font-normal leading-[16px] text-black-0 data-[selected=true]:text-gray-450 data-[selected=true]:font-bold"
        }}
      >
        <Tab
          key="creditCard"
          title="Pago con Tarjeta"
        >
          <PaymentInfoBanner />
          <PagoTarjeta />
        </Tab>

        <Tab
          key="paypal"
          title="Pago con Paypal"
        >
          <PaymentInfoBanner />
          <PagoPayPal />
        </Tab>

        <Tab
          key="efectivo"
          title={getValue('pago.tecnico.titulo')}
        >
          <PaymentInfoBanner />
          <PagoTecnico />
        </Tab>
      </Tabs>

    </>
  )
}

export default Step6
