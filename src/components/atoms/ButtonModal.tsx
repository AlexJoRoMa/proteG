"use client";

import { Button, useDisclosure } from '@heroui/react'
import React from 'react'
import ModalComponent from '../layouts/ModalComponent'
import useSWR from 'swr'
import Image from 'next/image'
import RichTextComponent from '../molecules/RichTextComponent';
import CarouselComponent from '../molecules/CarouselComponent';
import { ButtonModalProps } from '@/types/ModalComponentTypes';
import { Document } from '@contentful/rich-text-types';
import '@/styles/Modals.css';
import { CarouselProvider } from '@/utils/CarouselProvider';

// Tipo para el contenido del modal de Contentful
interface ModalContentEntry {
    fields: {
        content: Document;
        internalName?: string;
    };
}


const fetchEntry = async ([id]: [string]) => {
  const res = await fetch(`/api/modal?id=${id}`);
  if (!res.ok) throw new Error("Error al obtener el modal desde Contentful");
  return res.json();
};

const ButtonModal = ({
    textBtn,
    classStyles,
    idModal,
    children,
    closeButtonStroke,
    modalContentClassName,
    startContent,
    backdropColor,
    hrColor
}: ButtonModalProps) => {
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
            <Button className={classStyles} onPress={onOpen} isLoading={isLoading && !data && !error} startContent={startContent}>
                {textBtn}
            </Button>
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
                            <div className='px-4 xl:px-14 py-5 w-full order-2 xl:order-0 h-auto'>
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
                                                <RichTextComponent 
                                                    key={index}
                                                    document={contentEntry.fields.content as Document}
                                                    className="prose prose-lg"
                                                    hrColor={hrColor}
                                                />
                                            ))}
                                        </CarouselComponent>
                                    </CarouselProvider>
                                ) : (
                                    <RichTextComponent 
                                        document={
                                            Array.isArray(data.items[0].fields.modalContent) 
                                                ? data.items[0].fields.modalContent[0].fields.content as Document
                                                : data.items[0].fields.modalContent as Document
                                        }
                                        className="prose prose-lg"
                                        hrColor={hrColor}
                                    />
                                )}
                            </div>
                            <div className='xl:ml-auto order-1 md:order-0'>
                                {data.items[0].fields.imageResponsive && data.items[0].fields.sideImage && (
                                  <picture>
                                    <source media="(max-width: 1023px)" srcSet={`https:${data.items[0].fields.imageResponsive.fields.file.url}`} />
                                    <Image
                                      src={`https:${data.items[0].fields.sideImage.fields.file.url}`}
                                      alt={data.items[0].fields.sideImage.fields.title}
                                      width={data.items[0].fields.sideImage.fields.file.details.image.width}
                                      height={data.items[0].fields.sideImage.fields.file.details.image.height}
                                      className="h-auto xl:w-auto max-w-none max-h-none min-w-[300px] mb-0 w-full"
                                    />
                                  </picture>
                                )}
                            </div>
                        </div>
                    )
                )}
            </ModalComponent>
        </>
    )
}

export default ButtonModal
