'use client'

import { DropIcon } from "@/constants/IconsConstants";
import { Accordion, AccordionItem, Card, CardBody } from "@heroui/react";
import { useThankYou } from "../providers/ThankYouProvider";
import Image from "next/image";
import { ThankyouCopys } from "@/types/ThankyouTypes";
import { FormatCurrency } from "@/utils/Currency";
import { useEffect, useState } from "react";
import ButtonGhost from "../atoms/ButtonGhost";
import ResumenContent from "../molecules/resumenCompra/resumenContent";
import { useIzziContent } from "@/components/providers/IzziProvider";
import { ResumenData } from "@/types/ResumenCompra";
import { redirect } from "next/navigation";

type Shift = {
    day: number | string,
    month: number | string,
    longMonth: string,
    year: number | string,
    shift: string,
};

export default function ThankYou() {

    const { globalUserAnswers, globalDatosContratacion, globalIzziSelection, globalProcessStatus, clearCheckoutFlow, globalFlagDomicilio } = useIzziContent();
    const { icon, copys, copyResumen } = useThankYou();

    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const copy = copys as ThankyouCopys;
    const resumenCopys = copyResumen as ResumenData;

    useEffect(() => {
        const horario = globalDatosContratacion.Instalacion;

        if (!horario?.requestedShipDate || !horario.cvTimeslot) {
            setSelectedShift(null);
            return;
        };
        const [day, month, year] = horario.requestedShipDate.split('/');

        if (!day || !month || !year) return;
        const fecha = new Date(Number(year), Number(month) - 1, Number(day));
        const mesCompleto = fecha.toLocaleString("es-MX", { month: 'long' });

        const lower = horario.cvTimeslot.toLowerCase();
        const shift = lower.includes('vespertino') ? '2:00 pm a 6:00 pm' : '9:00 am a 2:00 pm';

        setSelectedShift({
            day: day,
            month: month,
            longMonth: mesCompleto,
            year: year,
            shift: shift,
        })

    }, [globalDatosContratacion.Instalacion]);

    function handleEndFlow() {
        clearCheckoutFlow();
        redirect(`${copy.boton.url}`);
    }

    const itemClasses = {
        indicator: "data-[open=true]:rotate-180",
        title: "leading-[24px] font-normal text-base",
        trigger: "pb-[24px]"
    }

    return (
        <section className="mx-[var(--spacing-sm)] 4xl:mx-[var(--spacing-xl)] 3xl:mx-[var(--spacing-lg)] 2xl:mx-[var(--spacing-md)] sm:mx-[var(--spacing-sm)] mb-[16px] xl:mb-[232px]">
            <div className="flex flex-col gap-[12px] text-center mt-[28px]">
                <h2 className="font-bold text-2xl xl:text-[32px]">{copy.titulo}</h2>
                <p className="font-normal text-sm xl:text-base">{copy.subtitulo}</p>
            </div>

            <div className="flex flex-row gap-[16px] w-full py-[24px] xl:py-[12px] px-[16px] rounded-md bg-gray-450 mt-[24px] xl:mt-[27px]">
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
                <p className="flex flex-col gap-[8px] text-white-0 font-semibold text-lg xl:text-xl xl:py-[13px] leading-[24px] whitespace-normal">
                    <span className="font-semibold text-xl xl:text-2xl">{globalIzziSelection?.tituloTriplePlay ? globalIzziSelection.tituloTriplePlay : globalIzziSelection?.titulo}</span>
                    <span className="font-semibold text-xl xl:text-2xl">{`${FormatCurrency(Number(globalIzziSelection?.precioPaquete))} ${copy.banner.currency}`}</span>
                    {
                        globalFlagDomicilio ?
                            <span className="font-semibold text-base xl:text-lg">{copy.banner.domiciliacion}</span> :
                            <span className="font-semibold text-base xl:text-lg">{`${copy.banner.instalacion} ${selectedShift?.day} de ${selectedShift?.longMonth} de ${selectedShift?.year} de ${selectedShift?.shift}`}</span>
                    }
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 mt-[24px] xl:mt-[32px] gap-[40px] xl:gap-[14px]">
                <div className="xl:pr-[13px] border-b-1 xl:border-b-0 xl:border-r-1 border-gray-150">
                    <div className="block xl:hidden">
                        <Accordion
                            showDivider={false}
                            isCompact
                            itemClasses={itemClasses}
                        >
                            <AccordionItem
                                key="1"
                                aria-label="Accordion 1"
                                title={copy.resumen}
                                indicator={<DropIcon />}
                            >

                                <Card
                                    key="1"
                                    classNames={{
                                        base: "relative flex flex-row gap-[8px] rounded-md shadow-none h-full w-full items-center",
                                        body: "w-auto py-[17px] px-0",
                                    }}
                                >
                                    <CardBody>
                                        <div>
                                            <ResumenContent copys={resumenCopys} userSelection={globalUserAnswers} />
                                        </div>
                                    </CardBody>
                                </Card>
                            </AccordionItem>
                        </Accordion >

                    </div>

                    <div className="hidden xl:block">
                        <h1 className="mb-[24px] font-normal text-base xl:text-lg">{copy.resumen}</h1>
                        <ResumenContent copys={resumenCopys} userSelection={globalUserAnswers} />

                    </div>

                </div>

                <div className="flex flex-col justify-between h-full">
                    <div className="flex-flex-col justify-between">
                        <div className="flex flex-col gap-[24px] xl:gap-[20.5px] mb-[16px] xl:mb-[40px]">
                            <h1 className="font-bold text-lg xl:text-xl">{copy.info.titulo}</h1>
                            <div className="flex flex-col gap-[12px] text-sm xl:text-base">
                                <p>
                                    <span>{`${copy.info.numeroCuenta} `}</span>
                                    <span className="font-bold">{globalProcessStatus.accountNumber}</span>
                                </p>
                                <p>
                                    <span>{`${copy.info.numeroOrden} `}</span>
                                    <span className="font-bold">{`#${globalProcessStatus.orderNumber}`}</span>
                                </p>
                                {!globalFlagDomicilio && (
                                    <p>
                                        <span>{`${copy.info.horaInstalacion} `}</span>
                                        <span className="font-bold">{`${globalDatosContratacion.Instalacion?.requestedShipDate} | ${selectedShift?.shift}`}</span>
                                    </p>
                                )}
                                <p>
                                    <span>{`${copy.info.metodoPago} `}</span>
                                    <span className="font-bold">{globalDatosContratacion.Pago?.metodoPago}</span>
                                </p>
                            </div>

                            <div className="text-base">
                                <h3 className="font-bold">{copy.info.mensaje.texto1}</h3>
                                <p>{copy.info.mensaje.texto2}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center border-y-1 border-gray-150 py-[16px] xl:py-[40px] mb-[25px]">
                            <div className="flex flex-col gap-[24px]">
                                <h1 className="font-bold text-base">{copy.app.titulo}</h1>
                                <div className="flex justify-center">
                                    <ButtonGhost
                                        classStyles={"py-[12px] px-[16px] w-[348px] h-auto rounded-md border-1 border-black-0 text-black-0 font-normal leading-[24px] text-base"}
                                        text={copy.app.boton.titulo as string}
                                        href={copy.app.boton.url}
                                        external={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            className={"py-[14px] px-[16px] w-[348px] h-[50px] rounded-md border-black-0 bg-black-0 text-white-0 font-semibold leading-[24px] text-lg"}
                            onClick={handleEndFlow}
                        >
                            {copy.boton.titulo as string}
                        </button>
                    </div>

                </div>
            </div>
        </section>
    )
}