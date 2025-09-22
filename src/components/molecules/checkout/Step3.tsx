import { Button, Form, InputOtp, Radio, RadioGroup } from '@heroui/react'
import React from 'react'

const Step3 = () => {
  return (
    <>
    <Form>
      <h5 className='text-[18px] font-bold leading-6 mb-2.5'>Es necesario confirmar tu información</h5>
      <p className='text-[18px] leading-6 mb-2.5'>Selecciona el medio por el cual deseas recibir la <b>aceptación o código de verificación.</b></p>
      <RadioGroup orientation='vertical' className='flex flex-col gap-6' defaultValue={'Whatsapp'}>
        <Radio value="Whatsapp"><b>Enviar por WhatsApp:</b> 55 XXXX XXXX</Radio>
        <Radio value="SMS"><b>Enviar por SMS:</b> 55 XXXX XXXX</Radio>
        <Radio value="Email"><b>Enviar por correo electrónico:</b> mail@gmail.com</Radio>
      </RadioGroup>

      <Button type='submit' className='mt-10 bg-black text-white hover:bg-white hover:text-black hover:border w-3xs rounded-md mx-auto'>Enviar código</Button>
    </Form>

    <div className='countdown-timer text-center mt-6 text-(--color-green-700) font-bold'>
        <span>00:59</span>
    </div>

    <div>
        <p className='text-[18px] font-bold leading-6 mb-6 text-center mt-6'>Introduce el código de verificación que te hemos enviado por WhatsApp.</p>
        <InputOtp length={4} defaultValue="1234" className='mx-auto' radius='md' isRequired size='lg' variant='bordered' />
        <p className='text-[18px] font-bold leading-6 mb-6 text-center mt-6'>¡Código correcto! Da clic en continuar</p>
    </div>

    </>

    
  )
}

export default Step3
