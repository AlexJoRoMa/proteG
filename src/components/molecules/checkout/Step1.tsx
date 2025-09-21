import { Button, Checkbox, Divider, Form, Input, Switch, Textarea } from '@heroui/react'
import Link from 'next/link'
import React from 'react'

const Step1 = () => {
  return (
    <div className='step1-container'>
      <div className='flex justify-between mb-10'>
        <div className='flex items-center w-5/12'>
          <p>¿Ya eres cliente?</p>
          <Link href="#" className='w-[180px] h-[40px] flex justify-center items-center ml-auto
                                    rounded-md bg-[var(--color-gray-450)] text-white text-[16px] leading-6
                                  hover:bg-white hover:text-[var(--color-gray-450)] hover:border-1' >
          Acceder
          </Link>
        </div>
        <div className='flex items-center w-3/12'>
             <p>¿Eres extranjero?</p>
             <Switch aria-label="" className='ml-auto' />
        </div>
      </div>
      <div>
           <Form className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <Input label="Nombre" name="firstName" type="text" variant='bordered' radius='sm' classNames={{label: 'font-bold', mainWrapper: 'mb-[16px]'}} labelPlacement="outside" required className='w-full' placeholder='Ingresa tu nombre' isClearable />
                <Input label="Apellido paterno" name="lastName" type="text" variant='bordered' radius='sm' classNames={{label: 'font-bold' , mainWrapper: 'mb-[16px]'}} labelPlacement="outside" required className='w-full' placeholder='Ingresa tu apellido paterno' isClearable />
                <Input label="Número de teléfono" name="phone" type="tel" variant='bordered' radius='sm' classNames={{label: 'font-bold' , mainWrapper: 'mb-[16px]'}} labelPlacement="outside" required className='w-full' placeholder='Ingresa un número' isClearable />
                <Input label="CURP" name="curp" type="text" radius='sm' variant='bordered' classNames={{label: 'font-bold' , mainWrapper: 'mb-[16px]'}} labelPlacement="outside" required className='w-full' placeholder='GOGM900305HSRMPV59' isClearable />
                <Link href="#" className='text-[var(--color-primary-500)] text-[16px] leading-6 underline'>¿No recuerdas tu CURP?</Link>
              </div>

              <div>
              <Input label="Segundo Nombre" name="lastName" type="text" variant='bordered' radius='sm' classNames={{label: 'font-bold', mainWrapper: 'mb-[16px]'}} labelPlacement="outside" className='w-full' placeholder='Ingresa tu segundo nombre' isClearable />
              <Input label="Apellido materno" name="lastName" type="text" variant='bordered' radius='sm' classNames={{label: 'font-bold', mainWrapper: 'mb-[16px]'}} labelPlacement="outside" required className='w-full' placeholder='Ingresa tu apellido materno' isClearable />
              <Input label="Teléfono adicional" name="email" type="tel" variant='bordered' radius='sm' classNames={{label: 'font-bold', mainWrapper: 'mb-[16px]'}} labelPlacement="outside" className='w-full' placeholder='Ingresa un número' isClearable />    
              <Input label="Correo electrónico" name="email" type="email" variant='bordered' radius='sm' classNames={{label: 'font-bold', mainWrapper: 'mb-[16px]'}} labelPlacement="outside" required className='w-full' placeholder='Ingresa un correo' isClearable />
              </div>
           </Form>

           <Divider orientation="horizontal" className='!border-[var(--color-gray-300)] mt-12 mb-7' />

              <h4 className='mb-[38px] font-bold text-[20px] leading-6'>Dirección de instalación</h4>
              <div className='w-inherit flex items-center'>
                <p>Avenida Paseo De La Reforma, 457, Chapultepec</p>
                <Button className='ml-auto bg-transparent'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <mask id="mask0_7201_46941" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                      <rect width="32" height="32" fill="#D9D9D9"/>
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
                      10.7102L20.4533 9.97424L19.725 9.27157L21.1633 10.7102Z" fill="#1C1B1F"/>
                    </g>
                  </svg>
                </Button>
              </div>
           <Form className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
              <Input label="Entre las calles:" name="street" type="text" variant='bordered' radius='sm' classNames={{label: 'font-bold', mainWrapper: 'mb-[16px]'}} labelPlacement="outside" className='w-full' placeholder='indica las calles entre las que se encuentra' isClearable />
              <Textarea label="Referencia" name="intNumber" type="textarea" variant='bordered' radius='sm' classNames={{label: 'font-bold', mainWrapper: 'mb-[16px]'}} labelPlacement="outside" className='w-full' placeholder='indica alguna referencia para nuestro técnico, por ejemplo: “casa a un lado del Oxxo”.' isClearable />
              <div className='flex'>
                <p>¿Necesitas facturar?</p>
                <Switch aria-label="" className='ml-auto' />
              </div>
          </Form>
           <Divider orientation="horizontal" className='!border-[var(--color-gray-300)] mt-12 mb-7' />
           <div>
              <Checkbox required>Acepto los <Link href="#" className='underline font-bold'>Términos y Condiciones de uso</Link></Checkbox>
           </div>
                    
      </div>
    </div>
  )
}

export default Step1
