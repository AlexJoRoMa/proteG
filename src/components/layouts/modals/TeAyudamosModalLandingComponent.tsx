"use client";
import React from 'react'
import { CallMeIcon, WhatsAppIcon } from '../../atoms/ModalIcons'
import { Button } from '@heroui/react'
import { TeLlamamosModalLandingComponentProps } from '@/types/ModalComponentTypes';
import LinkModal from '../../atoms/LinkModal';
import TeLlamamosModalComponent from './TeLlamamosModalComponent';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getTelNumber } from '@/services/izzi/getTelNumbers';


const TeAyudamosLandingModalComponent = ({ isOpen = true, onClose, modalData, telNumber }: TeLlamamosModalLandingComponentProps) => {
  if (!isOpen) return null;

  // Valores por defecto en caso de que no se pasen datos
  const defaultData = {
    title: '¡Contáctanos! Estamos para ayudarte',
    column1: {
      title: 'Contrata Ahora z',
      row1: { text: '¡Llámanos!', tel: '800 607 7070' },
      row2: { link: 'Te llamamos' },
      row3: { wpp: { text: 'Whatsapp', tel: '+520000000landing', promoText: 'Estoy Interesado' } }
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
                <p className='flex xl:mb-3.5 mb-4 gap-3'><CallMeIcon/>{data.column1.row1.text}<b>{telNumber || '800 607 7082'}</b></p>
                <LinkModal
                  classNames='flex xl:mb-3.5 mb-4 gap-3 underline text-black font-bold text-[16px] cursor-pointer' 
                  text={<><CallMeIcon/>{data.column1.row2.link}</>}
                  idModal='te-llamamos-modal'
                  closeButtonStroke='black'
                  modalContentClassName="w-full h-[52dvh] sm:h-[52vh] sm:w-[80vw] xl:h-auto xl:w-[80vw] 2xl:w-[52vw] 2xl:h-auto"
                  backdropColor='black-0/80'>
                    <TeLlamamosModalComponent />
                  </LinkModal>
                <a target='_blank' className='flex gap-3' href={`https://wa.me/${data.column1.row3.wpp.tel}?text=${data.column1.row3.wpp.promoText}`}><WhatsAppIcon />{data.column1.row3.wpp.text}</a>
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

export default TeAyudamosLandingModalComponent
