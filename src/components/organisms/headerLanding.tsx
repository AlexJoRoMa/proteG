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
import { usePathname } from 'next/navigation';


export default function IzziHeaderLanding({apibarData, clienteTitulo, llamanosTitulo, llamanosNum, getNumTel, urlTracking}: HeaderLandingComponentProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();

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
    
    //url track
    const buildTracking = (contentfulSlug: string) =>{

      if(urlTracking && contentfulSlug !== '/'){
        const slug = contentfulSlug.startsWith('/') ? contentfulSlug.substring(1) : contentfulSlug;
        return `${urlTracking}/${slug}`
      }

      return normalizeUrl(contentfulSlug);
    }
    
    
    const navbarContent = apibarData as unknown as Array<IzziNavbar>;

    const borderStyle = {
        'borderBottom': '2px solid',
        'borderImage': 'linear-gradient(90deg, #FF6C07 0%, #4DA9A7 33%, #D31772 66%, #FCD116 100%)',
        'borderImageSlice': '1',
        width: '100%'
    }
    const emptyURL = urlTracking === '/' ? true : false;
    
    const navbar = emptyURL ? navbarContent?.filter((data) => data.fields.internalName == "Navbar") : navbarContent?.filter((data) => data.fields.internalName === 'Navbar Landing  wCombos' );
    const navbarButtons = emptyURL ? navbarContent?.filter((data) => data.fields.internalName == "NavbarButtons") : navbarContent?.filter((data) => data.fields.internalName == "NavbarButtons Landing");
    const mobileNavbarButton = navbarContent?.filter((data) => data.fields.internalName == "MobileAccountButton");
    const mobileCoberturaCopy = navbarContent?.filter((data) => data.fields.internalName == "CoberturaMobile");
    const coberturaCopy = navbarContent?.filter((data) => data.fields.internalName == "CoberturaDesktop");
    const topNavbar = navbarContent?.filter((data) => data.fields.internalName == 'TopNavbar');

    // Normaliza URLs para que sean absolutas (agrega '/' si falta)
    const normalizeUrl = (url: string) => url.startsWith('/') || url.startsWith('http') ? url : `/${url}`;

    const isLinkActive = (href: string) => {
      const normalizeHref = normalizeUrl(href).split('?')[0];
      const normalizePath = pathname.split('?')[0];

      return normalizePath === normalizeHref;
    };


    return (
    <>
    { emptyURL 
    ? (
      <Navbar style={borderStyle} shouldHideOnScroll
        classNames={{
            wrapper: "max-w-full pl-4 pr-0 xl:pl-8 xl:pr-4",
        }}
        className={isMenuOpen ? "hidden" : 'sm:flex'}>
            <NavbarContent>
            {topNavbar[0].fields?.navigation?.map((link, index) => (    
            <NavbarItem key={`${link}-${index}`}>
                <Link className={`text-black-0 sm:text-[18px] text-[16px] ${index == 0 ? 'font-bold' : 'font-normal'}`} href={normalizeUrl(link.fields.navigationUrl)}>
                {link.fields.navigationTitle}
                </Link>
            </NavbarItem>
            ))}
            </NavbarContent>
            <NavbarContent justify="end">
              {coberturaCopy[0].fields?.navigation?.map((copy, index) => (
              <NavbarItem key={`${copy}-${index}`} className="hidden xl:flex">
                      <Button startContent={<Image src={`https:${copy.fields.linkIcon?.fields.file.url}`} alt={`${copy.fields.linkIcon?.fields.file.fileName}`} width={24} height={24} priority />} as={Link} href={normalizeUrl(copy.fields.navigationUrl)} className="text-black-0 font-normal bg-color-trasparent text-[18px]">{copy.fields.navigationTitle}</Button>
                  </NavbarItem>
              ))}
              {mobileCoberturaCopy[0].fields?.navigation?.map((copy, index) => (
                <NavbarItem key={`${copy}-${index}`} className="xl:hidden">
                <Button startContent={<Image src={`https:${copy.fields.linkIcon?.fields.file.url}`} alt={`${copy.fields.linkIcon?.fields.file.fileName}`} width={24} height={24} priority />} as={Link} href={normalizeUrl(copy.fields.navigationUrl)} className="text-black-0 font-normal bg-color-trasparent sm:text-[18px] text-[16px]">{copy.fields.navigationTitle}</Button>
                </NavbarItem>
              ))}
            </NavbarContent>
        </Navbar>
    ) : (
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
    )}
           
      
      {emptyURL ? (
        <Navbar onMenuOpenChange={setIsMenuOpen}
        classNames={{
        wrapper: "max-w-full h-[88px] pl-4 pr-6 bg-white-0",
        item: `
        relative flex items-center h-full
        data-[active=true]:text-primary-500
        data-[active=true]:after:content-['']
        data-[active=true]:after:absolute
        data-[active=true]:after:bottom-[12px]
        data-[active=true]:before:bottom-[12px]
        data-[active=true]:after:left-0
        data-[active=true]:after:right-0
        data-[active=true]:after:h-[2px]
        data-[active=true]:after:bg-black
        data-[active=true]:before:content-['']
        data-[active=true]:before:absolute
        data-[active=true]:before:left-0
        data-[active=true]:before:right-0
        data-[active=true]:before:h-[2px]
        data-[active=true]:before:bg-gray-500
        `
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
      <NavbarContent className="hidden xl:flex gap-[32px] min-[1024px]:gap-[16px] min-[1095]:gap-[24px] min-[1150px]:gap-[32px]" justify="start">
        {navbar[0].fields?.navigation?.map((link, index) => {    
          const href = normalizeUrl(link.fields.navigationUrl);
          const isActive = isLinkActive(href);

          return(
        <NavbarItem key={`${link}-${index}`} isActive={isActive}>
            <Link className={`xl:text-wrap 2xl:text-nowrap ${isActive ? 'font-bold text-black' : 'text-foreground'}`} color="foreground" href={normalizeUrl(link.fields.navigationUrl)}>
            {link.fields.navigationTitle}
            </Link>
        </NavbarItem>
        )
      
      })}
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
      ) : (
      <Navbar onMenuOpenChange={setIsMenuOpen}
        classNames={{
        wrapper: "max-w-full h-[88px] pl-4 pr-0 bg-white-0",
        item: `
        relative flex items-center h-full
        data-[active=true]:after:content-['']
        data-[active=true]:after:absolute
        data-[active=true]:after:bottom-[12px]
        data-[active=true]:before:bottom-[12px]
        data-[active=true]:after:left-0
        data-[active=true]:after:right-0
        data-[active=true]:after:h-[2px]
        data-[active=true]:after:bg-black
        data-[active=true]:before:content-['']
        data-[active=true]:before:absolute
        data-[active=true]:before:left-0
        data-[active=true]:before:right-0
        data-[active=true]:before:h-[2px]
        data-[active=true]:before:bg-gray-500
        `
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
        { navbar[0].fields?.navigation?.map((link, index) => {    
          const href = buildTracking(link.fields.navigationUrl);
          const isActive = isLinkActive(href);

          return(
            <NavbarItem key={`${link}-${index}`} isActive={isActive}>
              <Link
              className={`xl:text-wrap 2xl:text-nonwrap ${isActive ? 'font-bold text-black' : 'text-foreground'}`}
              color="foreground"
              href={href}
              >
              {link.fields.navigationTitle}
              </Link>
            </NavbarItem>
          )

        })}
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
      <NavbarMenu className=" bg-white-0 mt-[110px] gap-[20px]">
        {navbar[0].fields?.navigation?.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`} >
            <Link
              className="w-full text-black-0 text-[20px]"
              href={buildTracking(item.fields.navigationUrl)}
              
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
      )}

    </>
    )
}