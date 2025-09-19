"use client";

import { Link, useDisclosure } from '@heroui/react'
import React from 'react'
import ModalComponent from '../layouts/ModalComponent'
import useSWR from 'swr'
import Image from 'next/image'
import RichTextComponent from '../molecules/RichTextComponent';
import CarouselComponent from '../molecules/CarouselComponent';
import { LinkModalProps, ModalContentEntry } from '@/types/ModalComponentTypes';
import { Document } from '@contentful/rich-text-types';
import '@/styles/Modals.css';
import { CarouselProvider } from '@/utils/CarouselProvider';


const fetchEntry = async ([id]: [string]) => {
  const res = await fetch(`/api/modal?id=${id}`);
  if (!res.ok) throw new Error("Error al obtener el modal desde Contentful");
  return res.json();
};

const LinkModal = ({
    text,
    classNames,
    idModal,
    children,
    closeButtonStroke,
    modalContentClassName,
    backdropColor,
    hrColor,
}: LinkModalProps) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const shouldFetch = isOpen && !!idModal;

    const { data, error, isLoading } = useSWR(
        shouldFetch
            ? [idModal]
            : null,
        fetchEntry,
        {
            dedupingInterval: 3600000, // 1 hora
            revalidateOnFocus: false,
            keepPreviousData: true,
            revalidateIfStale: false,
        }
    );

    return (
        <>
            <Link onPress={onOpen} className={`cursor-pointer underline text-black ${classNames}`}>
                {text}
            </Link>
            <ModalComponent isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} closeButtonStroke={closeButtonStroke} modalContentClassName={modalContentClassName} backdropColor={backdropColor}>
                {isLoading && !children && <div className="py-8 text-center">Cargando...</div>}
                {error && !children && (
                    <div className="py-8 text-center">
                        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                            Ha surgido un error al traer la información solicitada.
                        </div>
                    </div>
                )}
                {children ? (
                    React.isValidElement(children)
                        ? React.cloneElement(children as React.ReactElement<{ isOpen: boolean; onClose: () => void }>, { isOpen, onClose })
                        : <>{children}</>
                ) : (
                    data && !isLoading && !error && (
                        <div className='flex h-full flex-col xl:flex-row'>                   
                            <div className='xl:contents'>
                                {Array.isArray(data.items[0].fields.modalContent) && data.items[0].fields.modalContent.length > 1 ? (
                                    <CarouselProvider 
                                        qtyCarousels={1} 
                                        colorArrow='black' 
                                        carouselConfigs={[{ 
                                            options: { 
                                                align: 'start',
                                                duration: 20, 
                                                dragFree: false,
                                                skipSnaps: false
                                            } 
                                        }]}
                                    >
                                        <CarouselComponent carouselIndex={0} buttons={true} dots={true}>
                                            {data.items[0].fields.modalContent.map((contentEntry: ModalContentEntry, index: number) => (
                                                <div className='flex flex-col xl:flex-row' key={index}>
                                                    <div className='px-4 xl:pl-[104px] py-5 w-full order-2 xl:order-0 h-auto'>
                                                         <RichTextComponent 
                                                        document={contentEntry.fields.content as unknown as Document}
                                                        className="prose prose-lg"
                                                        hrColor={hrColor}
                                                    />
                                                    </div>
                                                   
                                                    {/* Incluir imágenes debajo del contenido si existen */}
                                                    {data.items[0].fields.sideImage && data.items[0].fields.imageResponsive && (
                                                        <div className="order-1 xl:order-2 xl:pr-[104px]">
                                                            <picture>
                                                                <source media="(max-width: 1023px)" srcSet={`https:${
                                                                    Array.isArray(data.items[0].fields.imageResponsive) 
                                                                        ? data.items[0].fields.imageResponsive[index]?.fields.file.url || data.items[0].fields.imageResponsive[0].fields.file.url
                                                                        : data.items[0].fields.imageResponsive.fields.file.url
                                                                }`} />
                                                                <Image
                                                                    src={`https:${
                                                                        Array.isArray(data.items[0].fields.sideImage) 
                                                                            ? data.items[0].fields.sideImage[index]?.fields.file.url || data.items[0].fields.sideImage[0].fields.file.url
                                                                            : data.items[0].fields.sideImage.fields.file.url
                                                                    }`}
                                                                    alt={
                                                                        Array.isArray(data.items[0].fields.sideImage) 
                                                                            ? data.items[0].fields.sideImage[index]?.fields.title || data.items[0].fields.sideImage[0].fields.title
                                                                            : data.items[0].fields.sideImage.fields.title
                                                                    }
                                                                    width={
                                                                        Array.isArray(data.items[0].fields.sideImage) 
                                                                            ? data.items[0].fields.sideImage[index]?.fields.file.details.image.width || data.items[0].fields.sideImage[0].fields.file.details.image.width
                                                                            : data.items[0].fields.sideImage.fields.file.details.image.width
                                                                    }
                                                                    height={
                                                                        Array.isArray(data.items[0].fields.sideImage) 
                                                                            ? data.items[0].fields.sideImage[index]?.fields.file.details.image.height || data.items[0].fields.sideImage[0].fields.file.details.image.height
                                                                            : data.items[0].fields.sideImage.fields.file.details.image.height
                                                                    }
                                                                    className="h-auto xl:w-auto max-w-none max-h-none min-w-[300px] mb-0 w-full"
                                                                    unoptimized
                                                                    sizes="100vw"
                                                                />
                                                            </picture>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </CarouselComponent>
                                    </CarouselProvider>
                                ) : (
                                    <div className='flex flex-col xl:flex-row w-full'>
                                        <div className='px-4 xl:mx-14 py-5 w-full order-2 xl:order-0 h-auto'>
                                            <RichTextComponent 
                                            document={
                                                Array.isArray(data.items[0].fields.modalContent) 
                                                    ? data.items[0].fields.modalContent[0].fields.content as Document
                                                    : data.items[0].fields.modalContent as Document
                                            }
                                            className="prose prose-lg"
                                            hrColor={hrColor}
                                        />
                                        </div>
                                        
                                        {/* Incluir imágenes debajo del contenido si existen */}
                                        {data.items[0].fields.sideImage && data.items[0].fields.imageResponsive && (
                                            <div className="order-1 xl:order-2">
                                                <picture>
                                                    <source media="(max-width: 1023px)" srcSet={`https:${
                                                        Array.isArray(data.items[0].fields.imageResponsive) 
                                                            ? data.items[0].fields.imageResponsive[0].fields.file.url
                                                            : data.items[0].fields.imageResponsive.fields.file.url
                                                    }`} />
                                                    <Image
                                                        src={`https:${
                                                            Array.isArray(data.items[0].fields.sideImage) 
                                                                ? data.items[0].fields.sideImage[0].fields.file.url
                                                                : data.items[0].fields.sideImage.fields.file.url
                                                        }`}
                                                        alt={
                                                            Array.isArray(data.items[0].fields.sideImage) 
                                                                ? data.items[0].fields.sideImage[0].fields.title
                                                                : data.items[0].fields.sideImage.fields.title
                                                        }
                                                        width={
                                                            Array.isArray(data.items[0].fields.sideImage) 
                                                                ? data.items[0].fields.sideImage[0].fields.file.details.image.width
                                                                : data.items[0].fields.sideImage.fields.file.details.image.width
                                                        }
                                                        height={
                                                            Array.isArray(data.items[0].fields.sideImage) 
                                                                ? data.items[0].fields.sideImage[0].fields.file.details.image.height
                                                                : data.items[0].fields.sideImage.fields.file.details.image.height
                                                        }
                                                        className="h-auto xl:w-auto max-w-none max-h-none min-w-[300px] mb-0 w-full"
                                                        unoptimized
                                                        sizes="100vw"
                                                    />
                                                </picture>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                )}
            </ModalComponent>
        </>
    )
}

export default LinkModal
