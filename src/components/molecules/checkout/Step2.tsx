import { Form, Input } from '@heroui/react'
import React from 'react'

const Step2 = () => {
  return (
    <Form>
      <h5>Cargar de archivos</h5>
      <p>Ingresa los siguientes datos para configurar al titular de la cuenta y personalizar tu paquete a tu medida.</p>
      <p>Identificación Oficial (INE o pasaporte válido) en formato JPG, PNG o PDF.</p>
      <Input label="INE" name="ine" type="file" variant='bordered' radius='sm' classNames={{label: 'font-bold', mainWrapper: 'mb-[16px]'}} labelPlacement="outside" required className='w-full' />
      <p>Comprobante de domicilio (factura de CFE, gas, servicios o estado de cuenta bancario) en formato JPG, PNG o PDF.</p>
      <Input label="Comprobante de domicilio" name="comprobante" type="file" variant='bordered' radius='sm' classNames={{label: 'font-bold', mainWrapper: 'mb-[16px]'}} labelPlacement="outside" required className='w-full' />
    </Form>
  )
}

export default Step2
