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
import { IzziNavbar, HeaderComponentProps } from "@/types/headerTypes";
import ButtonModal from '../atoms/ButtonModal';
import TeLlamamosModalComponent from '../layouts/modals/TeLlamamosModalComponent';
import TeAyudamosModalComponent from '../layouts/modals/TeAyudamosModalComponent';


export default function IzziHeaderContent({navbarData}: HeaderComponentProps) {
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
    
    const borderStyle = {
        'borderBottom': '2px solid',
        'borderImage': 'linear-gradient(90deg, #FF6C07 0%, #4DA9A7 33%, #D31772 66%, #FCD116 100%)',
        'borderImageSlice': '1',
        width: '100%'
    }

    const navbarContent = navbarData as unknown as Array<IzziNavbar>

    const topNavbar = navbarContent?.filter((data) => data.fields.internalName == 'TopNavbar');

    const navbar = navbarContent?.filter((data) => data.fields.internalName == "Navbar");
    const navbarButtons = navbarContent?.filter((data) => data.fields.internalName == "NavbarButtons");
    const mobileNavbarButton = navbarContent?.filter((data) => data.fields.internalName == "MobileAccountButton");
    const mobileCoberturaCopy = navbarContent?.filter((data) => data.fields.internalName == "CoberturaMobile");
    const coberturaCopy = navbarContent?.filter((data) => data.fields.internalName == "CoberturaDesktop");


    // Normaliza URLs para que sean absolutas (agrega '/' si falta)
    const normalizeUrl = (url: string) => url.startsWith('/') || url.startsWith('http') ? url : `/${url}`;

    return (
    <>
        <Navbar onMenuOpenChange={setIsMenuOpen}
        classNames={{
        wrapper: "max-w-full h-[88px] pl-4 pr-6 bg-white-0"
      }}>
      <NavbarContent className="!grow-0">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="xl:hidden pl-2"
        />
        
      </NavbarContent>
      
      
      
      {/* imagen */}
      <NavbarContent className={`${isMenuOpen ? 'ps-0': 'pl-16'} !grow-0 lg:justify-start sm:justify-center lg:pl-0 lg:ps-0`}>
        <NavbarBrand>
          <Link href="/">
            <Image className='max-w-[120px] h-auto' src="/izzi_logo.png" alt="Logo Izzi" width={120} height={48} priority />
          </Link>
          </NavbarBrand>
      </NavbarContent>
      
      
      
      {/* pestañas */}
      <NavbarContent className=" hidden xl:flex gap-[32px] min-[1024px]:gap-[16px] min-[1095]:gap-[24px] min-[1440px]:gap-[32px]" justify="start">
        <NavbarItem >
            <Link className='xl:text-wrap 2xl:text-nowrap' color="foreground" href=''>
              internet
            </Link>
        </NavbarItem>
        <NavbarItem >
            <Link className='xl:text-wrap 2xl:text-nowrap' color="foreground" href=''>
              internet + tv
            </Link>
        </NavbarItem>
        <NavbarItem >
            <Link className='xl:text-wrap 2xl:text-nowrap' color="foreground" href=''>
              internet + móvil
            </Link>
        </NavbarItem>
        <NavbarItem >
            <Link className='xl:text-wrap 2xl:text-nowrap' color="foreground" href=''>
              internet + tv + móvil
            </Link>
        </NavbarItem>
        <NavbarItem >
            <Link className='xl:text-wrap 2xl:text-nowrap' color="foreground" href=''>
              tv
            </Link>
        </NavbarItem>
        <NavbarItem >
            <Link className='xl:text-wrap 2xl:text-nowrap' color="foreground" href=''>
              móvil
            </Link>
        </NavbarItem>
        <NavbarItem >
            <Link className='xl:text-wrap 2xl:text-nowrap' color="foreground" href=''>
              combos
            </Link>
        </NavbarItem>
        <NavbarItem >
            <Link className='xl:text-wrap 2xl:text-nowrap' color="foreground" href=''>
              promociones
            </Link>
        </NavbarItem>

      </NavbarContent>
      
      
      
      {/* Botones */}
      <NavbarContent justify="end" className="!grow-0">
        
        <NavbarItem className="hidden xl:flex ">
          <Button as={Link} className="bg-color-trasparent h-[48px] border-[2px] border-solid rounded-md text-[18px] min-[1024px]:text-[14px] min-[1095]:text-[16px] min-[1150px]:text-[18px]"
          startContent={
            <Image className='max-w-[24px] h-auto' src='/Headphones_Round.png' alt='Headphone' width={24} height={24} priority />
          }
          href='' >
            centro de ayuda
          </Button>
          <Button as={Link} className="bg-color-trasparent h-[48px] border-[2px] border-solid rounded-md text-[18px] min-[1024px]:text-[14px] min-[1095]:text-[16px] min-[1150px]:text-[18px]"
          startContent={
            <Image className='max-w-[24px] h-auto' src='/teLlamamos.png' alt='Headphone' width={24} height={24} priority />
          }
          href='' >
            te llamamos
          </Button>
                
              
        </NavbarItem>
            
      </NavbarContent>







      {/* Navbar xsm */}
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