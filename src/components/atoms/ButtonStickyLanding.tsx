import React from 'react'
import ButtonModal from './ButtonModal';
import TeLlamamosModalComponent from '../layouts/modals/TeLlamamosModalComponent';

interface ButtonLandingProps {
  textBoton: string;
  landing: boolean | string;
}

const ButtonLanding: React.FC<ButtonLandingProps> = async(
  {textBoton, landing}) => {
  try {

    const marginTop = landing ===  true ? 'mt-5' : ''
    const btnColor = landing ===  true ? 'bg-white border-none' : 'bg-black border border-white'
    const textColor = landing === true ? 'text-black' : 'text-white'
    const wBtn = landing ===  true ? 'md:w-[320px] xsm:w-[256px]' : 'w-full'

    return (
      <>
      
          <ButtonModal
            idModal=''
            closeButtonStroke='black'
            modalContentClassName='2xl:w-[62vw] 2xl:h-[52vh] xl:w-[90vw] xl:h-[52vh] h-[98vh]'
            backdropColor='black-0/80'
            textBtn={
              <>
                { textBoton || 'contratar ahora'}
              </>
            }
            classStyles={`${wBtn} rounded-md ${btnColor} ${textColor} ${marginTop}  font-bold text-[16px] md:text-[18px]`}
          >
              <TeLlamamosModalComponent  />
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
            modalContentClassName='2xl:w-[62vw] 2xl:h-[52vh] xl:w-[90vw] xl:h-[52vh] h-[98vh]'
            backdropColor='black-0/80'
            textBtn={
              <>
                {'contratar ahora'}
              </>
            }
            classStyles='w-full rounded-md bg-black text-white border-none font-bold text-[16px] md:text-[18px]'
          >
              <TeLlamamosModalComponent  />
          </ButtonModal>
      </>
    );
  }
}

export default ButtonLanding
