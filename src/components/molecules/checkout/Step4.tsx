import React from 'react';
import { Form, Input } from '@heroui/react'

const Step4 = () => {
  return (
    <>
      <Form>
        <h5 className='text-[18px] font-bold leading-6'>Cargar de archivos</h5>
        <p className='text-[18px] mb-6'>Ingresa los siguientes datos para configurar al titular de la cuenta y personalizar tu paquete a tu medida.</p>
        <p className='text-[18px] mb-4'>Identificación Oficial (INE o pasaporte válido) en formato <b>JPG, PNG o PDF.</b></p>
        <Input label="INE" name="ine" type="file" variant='bordered' radius='sm' classNames={{ label: 'font-bold', mainWrapper: 'mb-[16px] pointer' }} required className='w-full' endContent={
          <svg className='self-center' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 
        22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 
        21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 
        7 9.00195" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        } />
        <p className='text-[18px] mb-4 mt-6'>Comprobante de domicilio (factura de CFE, gas, servicios o estado de cuenta bancario) en formato <b>JPG, PNG o PDF.</b></p>
        <Input label="Comprobante de domicilio" name="comprobante" type="file" variant='bordered' radius='sm' classNames={{ label: 'font-bold', mainWrapper: 'mb-[16px]' }} required className='w-full' endContent={
          <svg className='self-center' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 
        22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 
        21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 
        7 9.00195" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        } />
      </Form>
    </>
  )
}

export default Step4
