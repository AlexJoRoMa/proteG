"use client";

import { Link, useDisclosure } from '@heroui/react'
import React from 'react'
import ModalComponent from '../layouts/ModalComponent'
import useSWR from 'swr'
import Image from 'next/image'
import RichTextComponent from '../molecules/RichTextComponent';
import { LinkModalProps } from '@/types/ModalComponentTypes';


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
                            <div className='px-4 xl:px-14 py-5 w-full order-2 xl:order-0 h-full'>
                                <RichTextComponent 
                                    document={data.items[0].fields.modalContent}
                                    className="prose prose-lg"
                                    hrColor={hrColor}
                                />
                            </div>
                            <div className='xl:ml-auto order-1 md:order-0'>
                                {data.items[0].fields.imageResponsive && data.items[0].fields.sideImage && (
                                  <picture>
                                    <source media="(max-width: 1023px)" srcSet={`https:${data.items[0].fields.imageResponsive.fields.file.url}`} />
                                    <Image
                                      src={`https:${data.items[0].fields.sideImage.fields.file.url}`}
                                      alt={data.items[0].fields.sideImage.fields.title}
                                      width={384}
                                      height={937}
                                      className="h-auto max-w-none mb-0 w-full xl:w-auto xl:h-full object-fit "
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

export default LinkModal
