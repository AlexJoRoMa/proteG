"use client";

import { Button, useDisclosure } from '@heroui/react'
import React from 'react'
import ModalComponent from '../layouts/ModalComponent'
import useSWR from 'swr'
import Image from 'next/image'
import RichTextComponent from '../molecules/RichTextComponent';

type ButtonModalProps = {
    textBtn: string;
    classStyles?: string;
    idModal: string;
}

const fetchEntry = async ([id]: [string]) => {
  const res = await fetch(`/api/modal?id=${id}`);
  if (!res.ok) throw new Error("Error al obtener el modal desde Contentful");
  return res.json();
};

const ButtonModal = ({
    textBtn,
    classStyles,
    idModal
}: ButtonModalProps) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
            <Button className={classStyles} onPress={onOpen} isLoading={isLoading && !data && !error}>
                {textBtn}
            </Button>
            <ModalComponent isOpen={isOpen} onOpenChange={onOpenChange}>
                {isLoading && <div className="py-8 text-center">Cargando...</div>}
                {error && (
                    <div className="py-8 text-center">
                        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                            Ha surgido un error al traer la información solicitada.
                        </div>
                    </div>
                )}
                {data && !isLoading && !error && (
                    <div className='flex h-full flex-col xl:flex-row'>                   
                        <div className='px-4 xl:px-14 py-5 w-full order-2 xl:order-0 h-full'>
                            <RichTextComponent 
                                document={data.items[0].fields.modalContent}
                                className="prose prose-lg"
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
                )}
            </ModalComponent>
        </>
    )
}

export default ButtonModal
