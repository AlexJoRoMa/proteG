'use client'

import Image from "next/image";
import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useMicrocopies } from "@/hooks/useMicrocopies";


export default function PaymentInfoBanner() {

    const { icon } = useCheckout();
    const {getValue} = useMicrocopies('contratacion-pago');

    return (
        <div className="flex flex-row gap-[16px] w-full py-[12px] px-[16px] rounded-md bg-gray-450 mt-[24px] xl:mt-[27px]">
            {icon && (
                <div className="relative w-[32px] h-[50px] flex-shrink-0">
                    <Image
                        className="object-contain"
                        src={`https:${icon?.fields.image.fields.file.url}`}
                        alt={icon?.fields.altText || "icono de promoción"}
                        width={32}
                        height={50}
                        loading="lazy"
                    />
                </div>
            )}
            <p className="text-white-0 font-semibold text-lg xl:text-xl xl:py-[13px] leading-[24px] whitespace-normal">
                {getValue('pago.infoBanner')}
            </p>
        </div>
    )
}