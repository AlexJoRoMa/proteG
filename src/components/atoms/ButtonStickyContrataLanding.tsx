import React from 'react'
import ButtonModal from './ButtonModal';
import { getAllCopy, getMicroCopy } from '@/services/contentful/components';
import { ContactIcon } from './ModalIcons';
import TeAyudamosLandingModalComponent from '../layouts/modals/TeAyudamosModalLandingComponent';
import { ResourceType } from '@/types/ButtonTypes';
import TeAyudamosModalComponent from '../layouts/modals/TeAyudamosModalComponent';
import TeLlamamosModalComponent from '../layouts/modals/TeLlamamosModalComponent';
import { getTelNumber } from '@/services/izzi/getTelNumbers';

const ButtonFixedContracLanding = async() => {


  try {
    // Obtener datos desde Contentful
    const textBtn = await getMicroCopy('btn.contrac.tittle');
    const modalTexts = await getAllCopy('stickyModal');

    const getStickyTexts = await getAllCopy('stickyBotones');
    const stikyLlamanos = getStickyTexts?.[0]?.fields?.resources?.[0]?.fields?.value;
    const stikyWhats = getStickyTexts?.[1]?.fields?.resources?.[1]?.fields?.value;
    const stikyTeLlamanos = getStickyTexts?.[2]?.fields?.resources?.[2]?.fields?.value;


    const getWhatsNumber = await getMicroCopy('stickyModal.column1.row3.wpp.tel');
    const getWhatsPromo = await getMicroCopy('stickyModal.column1.row3.wpp.promoText');

    const setWhatsNumber = getWhatsNumber?.[0]?.fields?.value;
    const setWhatsPromo = getWhatsPromo?.[0]?.fields?.value;

    // Encontrar valores por key
    const getValueByKey = (key: string) => {

      const item = modalTexts[0].fields?.resources?.find((item: ResourceType) => item.fields?.key === key);

      return item?.fields?.value || '';
    };

    const getNumberTelValue = getTelNumber();
    const setValue = `+52${getNumberTelValue.replace(/\s+/g, '')}`;
    

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
             hidden md:flex'
          >
              <TeAyudamosLandingModalComponent modalData={modalData} telNumber={getNumberTelValue}/>
          </ButtonModal>

{/* Botones sticky para movil */}
          <div
            className='border-2 font-bold border-solid border-transparent text-[18px] box-content leading-[24px] h-[52px] 
            fixed bottom-4 left-4 z-50 rounded-md bg-black text-white
             shadow-[2px_4px_16px_0_rgba(0,0,0,0.3)]
             [background-image:linear-gradient(black,black),var(--gradient-button-fixed)]
             [background-origin:padding-box,border-box]
             [background-clip:padding-box,border-box]
             flex md:hidden  w-[116px]'
          >
              <a className='flex items-center justify-center w-full' 
              href={`tel:${setValue}`} >
              { stikyLlamanos || 'stikyLlamanos'}
              </a>
          </div>
          <div
            className='border-2 font-bold border-solid border-transparent text-[18px] box-content leading-[24px] h-[52px] 
            fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 rounded-md bg-black text-white
             shadow-[2px_4px_16px_0_rgba(0,0,0,0.3)]
             [background-image:linear-gradient(black,black),var(--gradient-button-fixed)]
             [background-origin:padding-box,border-box]
             [background-clip:padding-box,border-box]
             flex md:hidden w-[116px]'
          > 
              <a target='_blank' className='flex items-center justify-center w-full' 
              href={`https://wa.me/${setWhatsNumber}?text=${setWhatsPromo}`} >
              { stikyWhats || 'WhatsApp'}
              </a>
          </div>
          <ButtonModal
            idModal=''
            closeButtonStroke='black'
            modalContentClassName='2xl:w-[62vw] 2xl:h-[52vh] xl:w-[90vw] xl:h-[52vh] h-[98vh]'
            backdropColor='black-0/80'
            textBtn={
              <>
                { stikyTeLlamanos || 'te llamamos'}
              </>
            }
            classStyles='border-2 font-bold border-solid border-transparent text-[18px] box-content leading-[24px] h-[52px] 
            fixed bottom-4 right-4 z-50 w-[10px] rounded-md bg-black text-white
             shadow-[2px_4px_16px_0_rgba(0,0,0,0.3)]
             [background-image:linear-gradient(black,black),var(--gradient-button-fixed)]
             [background-origin:padding-box,border-box]
             [background-clip:padding-box,border-box]
             flex md:hidden'
          >
              <TeLlamamosModalComponent />
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
            <TeAyudamosModalComponent />
        </ButtonModal>
      </>
    );
  }
}

export default ButtonFixedContracLanding
