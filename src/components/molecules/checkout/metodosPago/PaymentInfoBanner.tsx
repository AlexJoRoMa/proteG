'use client'

import Image from "next/image";
import { useCheckout } from "@/components/providers/CheckoutProvider";


export default function PaymentInfoBanner() {

    const { icon } = useCheckout();

    return (
        <div className="flex flex-row w-full py-[12px] px-[16px] rounded-md bg-gray-450 mt-[24px] xl:mt-[27px]">
            {icon && (
                <Image
                    src={`https:${icon?.fields.image.fields.file.url}`}
                    alt={icon?.fields.altText || "icono de promoción"}
                    width={31.7}
                    height={50}
                    loading="lazy"
                />
            )}
            <p className="py-[13px] ml-[16px] text-white-0 font-bold text-xl leading-[24px]">
                Obtén $50 de descuento adicional, al domiciliar tu pago
            </p>
        </div>
    )
}