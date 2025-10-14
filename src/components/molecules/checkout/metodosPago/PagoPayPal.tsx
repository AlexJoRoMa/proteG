
import Image from 'next/image';
import { useCheckout } from '@/components/providers/CheckoutProvider';
import { useState } from 'react';
import { Switch } from '@heroui/react';
import PayPalScript from './PayPalScript';

export default function PagoPayPal() {

    const { paypalIcon } = useCheckout();
    const [isRecurrent, setIsRecurrent] = useState(false);

    return (
        <>
            <div className='flex flex-row w-full justify-between mt-[24px] xl:mt-[27px]'>
                <h1 className='font-normal text-lg leading-[24px]'>
                    Activa tu pago recurrente
                </h1>
                <Switch
                    checked={isRecurrent}
                    onChange={(e) => setIsRecurrent(e.target.checked)}
                    classNames={{
                        wrapper: "bg-gray-100 group-data-[selected=true]:!bg-black-0",
                        thumb: "bg-white-0"
                    }}

                />
            </div>
            <p className='mt-[8px] w-full text-sm xl:text-base leading-[24px]'>
                Acepto el cargo recurrente en mi pago y las condiciones de uso del servicio.
            </p>

            {
                paypalIcon && (
                    <div className='w-full flex justify-center mt-[27px]'>
                        <Image
                            src={`https:${paypalIcon?.fields.image.fields.file.url}`}
                            alt={paypalIcon?.fields.altText || "logo de paypal"}
                            width={326}
                            height={115}
                            loading="lazy"
                        />
                    </div>
                )
            }

            <PayPalScript amount={0} rptGetOffer={'300'} account={'046bf14b-a878-11f0-be4c-026ec2a830dd'} isRecurrent={isRecurrent} />

            <div className='flex flex-col gap-[27px] text-center text-sm md:text-base leading-[24px] mt-[8px]'>
                <p className='text-start md:text-center'>
                    Te redigiremos al sitio de Paypal para que hagas tu pago. Una vez realizado, volverás a esta pantalla.
                </p>
                <p className='font-bold'>
                    ¡Gracias por elegir izzi! Estamos para servirte
                </p>
            </div>

        </>
    )
}