
import Image from 'next/image';
import { useCheckout } from '@/components/providers/CheckoutProvider';
import { useState } from 'react';
import { Switch } from '@heroui/react';
import PayPalScript from './PayPalScript';
import { useMicrocopies } from '@/hooks/useMicrocopies';

export default function PagoPayPal() {

    const { paypalIcon, processStatus } = useCheckout();
    const {getValue} = useMicrocopies('contratacion-pago');
    const [isRecurrent, setIsRecurrent] = useState(false);

    return (
        <section className='w-full'>
            <div className='flex flex-row w-full justify-between mt-[24px] xl:mt-[27px]'>
                <h1 className='font-normal text-lg leading-[24px]'>
                    {getValue('pago.pagoRecurrente.titulo')}
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
                {getValue('pago.pagoRecurrente.subTitulo')}
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

            <PayPalScript amount={470} rptGetOffer={'000'} account={processStatus.accountNumber} isRecurrent={isRecurrent} />

            <div className='flex flex-col gap-[27px] text-center text-sm md:text-base leading-[24px] mt-[8px]'>
                <p className='text-start md:text-center'>
                    {getValue('pago.paypal.InfoRedireccion')}
                </p>
                <p className='font-bold'>
                    {getValue('pago.agradecimiento')}
                </p>
            </div>

        </section>
    )
}