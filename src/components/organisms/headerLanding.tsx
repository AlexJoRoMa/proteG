'use client'
import React from 'react';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Button
} from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { IzziNavbar, HeaderLandingComponentProps } from "@/types/headerTypes";
import ButtonModal from '../atoms/ButtonModal';
import TeLlamamosModalComponent from '../layouts/modals/TeLlamamosModalComponent';
import TeAyudamosModalComponent from '../layouts/modals/TeAyudamosModalComponent';


export default function IzziHeaderLanding({apibarData, clienteTitulo, llamanosTitulo, llamanosNum, getNumTel}: HeaderLandingComponentProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    

    // Función helper para renderizar el modal correcto basado en typeModal
    const renderModalComponent = (typeModal?: 'TeLlamamos' | 'TeAyudamos') => {

        if (typeModal === 'TeLlamamos') {
            return <TeLlamamosModalComponent />;
        }
        if (typeModal === 'TeAyudamos') {
            return <TeAyudamosModalComponent />;
        }

        return null;
    };
    
    
    const navbarContent = apibarData as unknown as Array<IzziNavbar>;

    const borderStyle = {
        'borderBottom': '2px solid',
        'borderImage': 'linear-gradient(90deg, #FF6C07 0%, #4DA9A7 33%, #D31772 66%, #FCD116 100%)',
        'borderImageSlice': '1',
        width: '100%'
    }
    
    const navbar = navbarContent?.filter((data) => data.fields.internalName === 'Navbar Landing  wCombos' );
    const navbarButtons = navbarContent?.filter((data) => data.fields.internalName == "NavbarButtons Landing");
    const mobileNavbarButton = navbarContent?.filter((data) => data.fields.internalName == "MobileAccountButton");
    /* const mobileCoberturaCopy = navbarContent?.filter((data) => data.fields.internalName == "CoberturaMobile");
    const coberturaCopy = navbarContent?.filter((data) => data.fields.internalName == "CoberturaDesktop"); */


    // Normaliza URLs para que sean absolutas (agrega '/' si falta)
    const normalizeUrl = (url: string) => url.startsWith('/') || url.startsWith('http') ? url : `/${url}`;


    return (
    <>
      <Navbar style={borderStyle}
        onMenuOpenChange={setIsMenuOpen}
        className='3xl:hidden'
        classNames={{
        wrapper: "max-w-full h-[88px] pl-0 pr-0 bg-white-0 " 
        }}
        >
          <NavbarContent>
            <NavbarItem className=" w-full 3xl:hidden flex h-full ">
              <div className='border-r-1 border-gray-150 bg-gray-100 w-1/2 h-full flex flex-col justify-center align-middle items-center'>
              <p className=''>{clienteTitulo}</p>
              <p className='font-bold '>{llamanosNum || '800 120 5000'}</p>
              </div>
              <div className=' bg-gray-100 w-1/2 h-full flex flex-col justify-center align-middle items-center'>
              <p className=''>{llamanosTitulo}</p>
              <p className='font-bold '>{ getNumTel || '000 000 0000' }</p>
              </div>
              </NavbarItem>    
          </NavbarContent>
      </Navbar>        
      
{/* Bar de Navegacion */}
      <Navbar onMenuOpenChange={setIsMenuOpen}
        classNames={{
        wrapper: "max-w-full h-[88px] pl-4 pr-0 bg-white-0"
      }}>
      <NavbarContent className="!grow-0">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="2xl:hidden pl-2"
        />
        
      </NavbarContent>
{/* icono */}
      <NavbarContent className={`${isMenuOpen ? 'ps-0': 'pl-16'} !grow-0 lg:justify-start sm:justify-center lg:pl-0 lg:ps-0`}>
        <NavbarBrand>
          <Link href="/">
            <Image className='max-w-[120px] h-auto' src={`https:${navbar[0].fields.brandLogo?.fields.file.url}`} alt={`${navbar[0].fields.brandLogo?.fields.file.fileName}`} width={120} height={48} priority />
          </Link>
          </NavbarBrand>
      </NavbarContent>
      
{/* Opciones de navegacion */}
      <NavbarContent className="hidden 2xl:flex gap-[32px] min-[1024px]:gap-[12px] min-[1095]:gap-[17px] min-[1150px]:gap-[15px]" justify="start">
        { navbar[0].fields?.navigation?.map((link, index) => (    
        <NavbarItem key={`${link}-${index}`}>
          
            <Link className='xl:text-wrap 2xl:text-nowrap' color="foreground" href={normalizeUrl(link.fields.navigationUrl)}>
              {link.fields.navigationTitle}
            </Link>
          
        </NavbarItem>
        ))}
      </NavbarContent>


{/* Modales Botones */}      
      <NavbarContent justify="end" className=" !grow-0">
        <NavbarItem className=" w-[400px] hidden 3xl:flex h-full ">
          <div className='border-r-1 border-gray-150 bg-gray-100 w-1/2 h-full flex flex-col justify-center align-middle items-center'>
            <p className=''>{clienteTitulo}</p>
            <p className='font-bold '>{llamanosNum || '800 120 5000'}</p>
          </div>
          <div className=' bg-gray-100 w-1/2 h-full flex flex-col justify-center align-middle items-center'>
            <p className=''>{llamanosTitulo}</p>
            <p className='font-bold '>{ getNumTel || '000 000 0000' }</p>
          </div>
        </NavbarItem>
        
{/* Icono de persona */}
        {mobileNavbarButton[0].fields?.navigation?.map((link, index) => ( 
        <NavbarItem key={`${link}-${index}`}
            className={isMenuOpen ? "hidden" : "3xl:hidden sm:flex pr-6"}>
          <Button as={Link} href={normalizeUrl(link.fields.navigationUrl)} className="bg-color-trasparent justify-end px-0">
            <Image src={`https:${mobileNavbarButton[0].fields?.brandLogo?.fields?.file?.url}`} alt={link.fields.navigationTitle} width={32} height={32} priority ></Image>
          </Button>
        </NavbarItem>
        ))}
      </NavbarContent>

{/* Movil hamburgues */}
      <NavbarMenu className="bg-white-0 mt-[26px] gap-[26px]">
        {navbar[0].fields?.navigation?.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full text-black-0 text-[20px]"
              href={normalizeUrl(item.fields.navigationUrl)}
            >
              {item.fields.navigationTitle}
            </Link>
          </NavbarMenuItem>
        ))}
        {navbarButtons[0].fields?.navigation?.map((link, index) => {
            return (
            <NavbarMenuItem key={`${link}-${index}`}>
             {
                (link.fields.typeModal === 'TeLlamamos' || link.fields.typeModal === 'TeAyudamos') ? (
                  <ButtonModal
                    textBtn={link.fields.navigationTitle}
                    classStyles={`${index == 2 ? 'bg-black-0 text-white-0' :'bg-color-trasparent'} 
                        h-[48px] border-[2px] border-solid rounded-md text-[18px] min-[1024px]:text-[14px] min-[1095]:text-[16px] min-[1150px]:text-[18px]`}
                    closeButtonStroke="black"
                    modalContentClassName="w-full h-[52dvh] sm:h-[52vh] sm:w-[80vw] xl:h-auto xl:w-[80vw] 2xl:w-[52vw] 2xl:h-auto"
                    backdropColor='black-0/80'
                    startContent={<Image className='max-w-[24px] h-auto' src={`https:${link.fields.linkIcon?.fields.file.url}`} alt={`${link.fields.linkIcon?.fields.file.fileName}`} width={24} height={24} priority />}
                  >
                    {renderModalComponent(link.fields.typeModal)}
                  </ButtonModal>
                ) : (
                  <Button as={Link} className={`${index == 2 ? 'bg-black-0 text-white-0' :'bg-color-trasparent'} 
                      h-[48px] border-[2px] border-solid rounded-md text-[18px] min-[1024px]:text-[14px] min-[1095]:text-[16px] min-[1150px]:text-[18px]`}
                      startContent={<Image className='max-w-[24px] h-auto' src={`https:${link.fields.linkIcon?.fields.file.url}`} alt={`${link.fields.linkIcon?.fields.file.fileName}`} width={24} height={24} priority />}
                          href={link.fields.navigationUrl}>
                      {link.fields.navigationTitle}
                  </Button>
                )
              }
            </NavbarMenuItem>
            );
        })}
      </NavbarMenu>



    </Navbar>
    </>
    )
}