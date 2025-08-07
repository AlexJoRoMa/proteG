"use client";
import React from 'react'
import { CallMeIcon, HeadPhonesIcon, WhatsAppIcon } from '../atoms/ModalIcons'
import { Button, Link } from '@heroui/react'
import { TeLlamamosModalComponentProps } from '@/types/ModalComponentTypes';
import LinkModal from '../atoms/LinkModal';



const TeLlamamosModalComponent = ({ isOpen = true, onClose, modalData }: TeLlamamosModalComponentProps) => {
  if (!isOpen) return null;

  // Valores por defecto en caso de que no se pasen datos
  const defaultData = {
    title: '¡Contáctanos! Estamos para ayudarte',
    column1: {
      title: 'Contrata Ahora',
      row1: { text: '¡Llámanos!', tel: '800 607 7070' },
      row2: { link: 'Te llamamos' },
      row3: { wpp: { text: 'Whatsapp', tel: '+520000000', promoText: 'Estoy Interesado' } }
    },
    column2: {
      title: 'Soporte a Cliente',
      row1: { text: 'Si eres cliente ¡llámanos!', tel: '800 120 5000' },
      row2: { link: { text: 'Centro de ayuda', url: 'https://ayudaizzi.mx' } },
      row3: { wpp: { text: 'Whatsapp', tel: '+520000000', promoText: 'Estoy Interesado' } }
    }
  };

  const data = modalData || defaultData;
    
  return (
    <div className='xl:p-14 py-6 px-4'>
        <h2 className='xl:text-center xl:text-[32px] xl:mb-4 mb-8 text-[20px] w-2/3 xl:w-full font-bold xl:font-normal'>{data.title}</h2>
        <hr className='w-full xl:mb-10 mb-6 border-0 h-[1px] [background-image:var(--gradient-button-fixed)]' />
        <div className='flex justify-evenly flex-col xl:flex-row'>
            <div className='flex flex-col'>
                <strong className='mb-6'>{data.column1.title}</strong>
                <p className='flex xl:mb-3.5 mb-4 gap-3'><CallMeIcon/>{data.column1.row1.text}<b>{data.column1.row1.tel}</b></p>
                <LinkModal classNames='flex xl:mb-3.5 mb-4 gap-3 underline text-black font-bold text-[16px] cursor-pointer' text={<CallMeIcon/>${data.column1.row2.link}}></LinkModal>
                <a target='_blank' className='flex gap-3' href={`https://wa.me/${data.column1.row3.wpp.tel}?text=${data.column1.row3.wpp.promoText}`}><WhatsAppIcon />{data.column1.row3.wpp.text}</a>
            </div>
            <hr className='w-full xl:mb-10 mb-6 mt-8 block xl:hidden border-0 h-[1px] [background-image:var(--gradient-button-fixed)]' />
            <div className='flex flex-col'>
                <strong className='mb-6'>{data.column2.title}</strong>
                <p className='flex xl:mb-3.5 mb-4 gap-3'><CallMeIcon/> {data.column2.row1.text} <b>{data.column2.row1.tel}</b></p>
                <Link className='flex xl:mb-3.5 mb-4 gap-3 underline text-black font-bold text-[16px]' href={data.column2.row2.link.url}><HeadPhonesIcon/>{data.column2.row2.link.text}</Link>
                <a target='_blank' className='flex gap-3' href={`https://wa.me/${data.column2.row3.wpp.tel}?text=${data.column2.row3.wpp.promoText}`}><WhatsAppIcon />{data.column2.row3.wpp.text}</a>
            </div>
      </div>
      <Button
        className='bg-black text-white font-bold h-[48px] text-[16px] leading-[24px] w-[256px] rounded-none xl:mt-10 mt-8 mx-auto block'
        onPress={onClose}
      >
        Aceptar
      </Button>
    </div>
  )
}

export default TeLlamamosModalComponent
