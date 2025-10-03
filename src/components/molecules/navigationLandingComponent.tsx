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


export default function IzziHeaderContent() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
            <Link className='xl:text-wrap 2xl:text-nowrap' color="foreground" href='landing/internet'>
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
        
        <NavbarItem className="hidden xl:flex gap-[8px]">
          <Button as={Link} className="bg-color-trasparent h-[48px] border-[2px] border-solid rounded-md text-[18px] min-[1024px]:text-[14px] min-[1095]:text-[16px] min-[1150px]:text-[18px]"
          startContent={
            <Image className='max-w-[24px] h-auto' src='/Headphones_Round.png' alt='Headphone' width={24} height={24} priority />
          }
          href='' >
            centro de ayuda
          </Button>
          <ButtonModal
          textBtn='te llamamos'
          classStyles={`bg-color-trasparent
          h-[48px] border-[2px] border-solid rounded-md text-[18px] min-[1024px]:text-[14px] min-[1095]:text-[16px] min-[1150px]:text-[18px]`}
          closeButtonStroke="black"
          modalContentClassName="w-full h-[52dvh] sm:h-[52vh] sm:w-[80vw] xl:h-auto xl:w-[80vw] 2xl:w-[52vw] 2xl:h-auto"
          backdropColor='black-0/80'
          startContent={<Image className='max-w-[24px] h-auto' src='/teLlamamos.png' alt='telefono' width={24} height={24} priority />}
          >
            <TeAyudamosModalComponent />
          </ButtonModal>
                
              
        </NavbarItem>
            
      </NavbarContent>
      
      
      
      {/* User Icon */}
      <NavbarItem
      className={isMenuOpen ? "hidden" : "xl:hidden sm:flex"}>
        <Button as={Link} href='/login' className="bg-color-trasparent justify-end px-0">
          <Image src='/User_Circle.webp' alt='User Icon' width={32} height={32} priority ></Image>
        </Button>
      </NavbarItem>










      {/* Menu xsm */}
      <NavbarMenu className="bg-white-0 mt-[26px] gap-[10px]">
        
        {/* Menu options */}
        <NavbarMenuItem>
          <Link
            className="w-full text-black-0 text-[20px]"
            href=''
          >
            internet
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-black-0 text-[20px]"
            href=''
          >
            internet + tv
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-black-0 text-[20px]"
            href=''
          >
            internet + móvil
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-black-0 text-[20px]"
            href=''
          >
            internet + tv + móvil
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-black-0 text-[20px]"
            href=''
          >
            tv
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-black-0 text-[20px]"
            href=''
          >
            móvil
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-black-0 text-[20px]"
            href=''
          >
            combos
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-black-0 text-[20px]"
            href=''
          >
            promociones
          </Link>
        </NavbarMenuItem>
        
        
        <NavbarMenuItem >

          <Button as={Link} className="bg-color-trasparent mt-[16px] h-[48px] border-[2px] border-solid rounded-md text-[18px] min-[1024px]:text-[14px] min-[1095]:text-[16px] min-[1150px]:text-[18px]"
          startContent={
            <Image className='max-w-[24px] h-auto' src='/Headphones_Round.png' alt='Headphone' width={24} height={24} priority />
          }
          href='' >
            centro de ayuda
          </Button>
          
          <ButtonModal
          textBtn='te llamamos'
          classStyles={`bg-color-trasparent mt-[16px]
          h-[48px] border-[2px] border-solid rounded-md text-[18px] min-[1024px]:text-[14px] min-[1095]:text-[16px] min-[1150px]:text-[18px]`}
          closeButtonStroke="black"
          modalContentClassName="w-full h-[52dvh] sm:h-[52vh] sm:w-[80vw] xl:h-auto xl:w-[80vw] 2xl:w-[52vw] 2xl:h-auto"
          backdropColor='black-0/80'
          startContent={<Image className='max-w-[24px] h-auto' src='/teLlamamos.png' alt='telefono' width={24} height={24} priority />}
          >
            <TeLlamamosModalComponent />
          </ButtonModal>
        </NavbarMenuItem>
          
        
      </NavbarMenu>
    </Navbar>
    </>
    )
}