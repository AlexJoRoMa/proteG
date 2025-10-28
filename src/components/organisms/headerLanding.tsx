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

export default function IzziHeaderLanding({apibarData, navbarData}: HeaderLandingComponentProps) {
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
    
    
    const getBarData = navbarData as unknown as IzziNavbar;
    const hasCombos = getBarData.fields.landingCombos === true ? 'Navbar Landing  wCombos' : 'Navbar Landing  noCombos';
    
    const navbarContent = apibarData as unknown as Array<IzziNavbar>;

    
    
    const navbar = navbarContent?.filter((data) => data.fields.internalName === hasCombos );
    const navbarButtons = navbarContent?.filter((data) => data.fields.internalName == "NavbarButtons Landing");
    const mobileNavbarButton = navbarContent?.filter((data) => data.fields.internalName == "MobileAccountButton");
   /*  const mobileCoberturaCopy = navbarContent?.filter((data) => data.fields.internalName == "CoberturaMobile");
    const coberturaCopy = navbarContent?.filter((data) => data.fields.internalName == "CoberturaDesktop"); */


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
      <NavbarContent className={`${isMenuOpen ? 'ps-0': 'pl-16'} !grow-0 lg:justify-start sm:justify-center lg:pl-0 lg:ps-0`}>
        <NavbarBrand>
          <Link href="/">
            <Image className='max-w-[120px] h-auto' src={`https:${navbar[0].fields.brandLogo?.fields.file.url}`} alt={`${navbar[0].fields.brandLogo?.fields.file.fileName}`} width={120} height={48} priority />
          </Link>
          </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden xl:flex gap-[32px] min-[1024px]:gap-[12px] min-[1095]:gap-[17px] min-[1150px]:gap-[15px]" justify="start">
        { navbar[0].fields?.navigation?.map((link, index) => (    
        <NavbarItem key={`${link}-${index}`}>
          
            <Link className='xl:text-wrap 2xl:text-nowrap' color="foreground" href={normalizeUrl(link.fields.navigationUrl)}>
              {link.fields.navigationTitle}
            </Link>
          
        </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end" className="!grow-0">
        {navbarButtons[0].fields?.navigation?.map((link, index) => (    
            <NavbarItem key={`${link}-${index}`} className="hidden xl:flex ">
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
            </NavbarItem>
        ))}
        {mobileNavbarButton[0].fields?.navigation?.map((link, index) => ( 
        <NavbarItem key={`${link}-${index}`}
            className={isMenuOpen ? "hidden" : "xl:hidden sm:flex"}>
          <Button as={Link} href={normalizeUrl(link.fields.navigationUrl)} className="bg-color-trasparent justify-end px-0">
            <Image src={`https:${mobileNavbarButton[0].fields?.brandLogo?.fields?.file?.url}`} alt={link.fields.navigationTitle} width={32} height={32} priority ></Image>
          </Button>
        </NavbarItem>
        ))}
      </NavbarContent>
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