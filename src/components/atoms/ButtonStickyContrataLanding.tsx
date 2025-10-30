import React from 'react'
import ButtonModal from './ButtonModal';
import { getAllCopy, getMicroCopy } from '@/services/contentful/components';
import { ContactIcon } from './ModalIcons';
import TeAyudamosLandingModalComponent from '../layouts/modals/TeAyudamosModalLandingComponent';
import { ResourceType } from '@/types/ButtonTypes';
import TeAyudamosModalComponent from '../layouts/modals/TeAyudamosModalComponent';

const ButtonFixedContracLanding = async() => {


  try {
    // Obtener datos desde Contentful
    const textBtn = await getMicroCopy('btn.contrac.tittle');
    const modalTexts = await getAllCopy('stickyModal');

    // Encontrar valores por key
    const getValueByKey = (key: string) => {

      const item = modalTexts[0].fields?.resources?.find((item: ResourceType) => item.fields?.key === key);

      return item?.fields?.value || '';
    };

    // Mapear los datos del modal
    const modalData = {
      title: getValueByKey('stickyModal.title'),
      column1: {
        title: getValueByKey('stickyModal.column1.title'),
        row1: {
          text: getValueByKey('stickyModal.column1.row1.text'),
          tel: getValueByKey('stickyModal.column1.row1.tel'),
        },
        row2: {
          link: getValueByKey('stickyModal.column1.row2.link'),
        },
        row3: {
          wpp: {
            text: getValueByKey('stickyModal.column1.row3.wpp.text'),
            tel: getValueByKey('stickyModal.column1.row3.wpp.tel'),
            promoText: getValueByKey('stickyModal.column1.row3.wpp.promoText'),
          },
        },
      },
    };

    return (
      <>
          <ButtonModal
            idModal=''
            closeButtonStroke='black'
            modalContentClassName='2xl:w-[62vw] 2xl:h-[52vh] xl:w-[90vw] xl:h-[52vh] h-[98vh]'
            backdropColor='black-0/80'
            textBtn={
              <>
                {textBtn?.[0]?.fields?.value || 'Contrata ahora'}
              </>
            }
            classStyles='border-2 font-bold border-solid border-transparent text-[18px] box-content leading-[24px] h-[52px] fixed bottom-4 right-4 z-50 rounded-md bg-black text-white
             shadow-[2px_4px_16px_0_rgba(0,0,0,0.3)]
             [background-image:linear-gradient(black,black),var(--gradient-button-fixed)]
             [background-origin:padding-box,border-box]
             [background-clip:padding-box,border-box]
             hidden xl:flex'
          >
              <TeAyudamosLandingModalComponent modalData={modalData} />
          </ButtonModal>
      </>
    );

  } catch (error) {
    console.error('Error al obtener datos de Contentful:', error);
    
    // Fallback en caso de error completo
    return (
      <>
        <ButtonModal
          idModal=''
          closeButtonStroke='black'
          modalContentClassName='2xl:w-[55vw] 2xl:h-[55vh] xl:w-[70vw] xl:h-[55vh]'
          textBtn={
            <>
              ¿Te ayudamos?
              <ContactIcon />
            </>
          }
          classStyles='border-2 font-bold border-solid border-transparent text-[18px] box-content leading-[24px] h-[52px] fixed bottom-4 right-4 z-50 rounded-md bg-black text-white
           shadow-[2px_4px_16px_0_rgba(0,0,0,0.3)]
           [background-image:linear-gradient(black,black),var(--gradient-button-fixed)]
           [background-origin:padding-box,border-box]
           [background-clip:padding-box,border-box]'
        >
            <TeLlamamosModalComponent />
        </ButtonModal>
      </>
    );
  }
}

export default ButtonFixedContracLanding
