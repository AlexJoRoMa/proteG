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
import { IzziLogo, HelpIcon, CallIcon, UserIcon, LocationIcon } from "@/components/atoms/ButtonIcon";
import { IzziNavbar, HeaderComponentProps } from "@/types/headerTypes";

export default function IzziHeaderContent({navbarData, topNavbarData, navbarButtonsData, mobileNavbarButton}: HeaderComponentProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const borderStyle = {
        'borderBottom': '2px solid',
        'borderImage': 'linear-gradient(90deg, #FF6C07 0%, #4DA9A7 33%, #D31772 66%, #FCD116 100%)',
        'borderImageSlice': '1',
        width: '100%'
    }

    const topNavbar = topNavbarData?.fields as IzziNavbar;
    const navbar = navbarData?.fields as IzziNavbar;
    const navbarButtons = navbarButtonsData?.fields as IzziNavbar;
    const mobileButton = mobileNavbarButton?.fields as IzziNavbar;

    return (
    <>
        <Navbar style={borderStyle} shouldHideOnScroll
        classNames={{
            wrapper: "max-w-full pl-4 pr-0 xl:pl-8 xl:pr-4",
        }}
        className={isMenuOpen ? "hidden" : 'sm:flex'}>
            <NavbarContent>
            {topNavbar?.navigation?.map((link, index) => (    
            <NavbarItem key={`${link}-${index}`}>
                <Link className={`text-black-0 sm:text-[18px] text-[16px] ${index == 0 ? 'font-bold' : 'font-normal'}`} href={link.fields.navigationUrl}>
                {link.fields.navigationTitle}
                </Link>
            </NavbarItem>
            ))}
            </NavbarContent>
            <NavbarContent justify="end">
            <NavbarItem className="hidden xl:flex">
                    <Button startContent={<LocationIcon />} as={Link} href="#" className="text-black-0 font-normal bg-color-trasparent text-[18px]">comprobar mi cobertura</Button>
                </NavbarItem>
                <NavbarItem className="xl:hidden">
                <Button startContent={<LocationIcon />} as={Link} href="#" className="text-black-0 font-normal bg-color-trasparent sm:text-[18px] text-[16px]">tu cobertura</Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
        <Navbar onMenuOpenChange={setIsMenuOpen}
        classNames={{
        wrapper: "max-w-full h-[88px] pl-4 pr-6"
      }}>
      <NavbarContent className="!grow-0">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="xl:hidden pl-2"
        />
        
      </NavbarContent>
      <NavbarContent className={`${isMenuOpen ? 'ps-0': 'ps-16'} !grow-0 lg:justify-start sm:justify-center lg:ps-0`}>
        <NavbarBrand>
          <Link href="/">
            <IzziLogo />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden xl:flex gap-[32px] min-[1024px]:gap-[16px] min-[1095]:gap-[24px] min-[1150px]:gap-[32px]" justify="start">
        {navbar?.navigation?.map((link, index) => (    
        <NavbarItem key={`${link}-${index}`}>
            <Link color="foreground" href={link.fields.navigationUrl}>
            {link.fields.navigationTitle}
            </Link>
        </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end" className="!grow-0">
        {navbarButtons?.navigation?.map((link, index) => (    
            <NavbarItem key={`${link}-${index}`} className="hidden xl:flex ">
                <Button as={Link} className={`${index == 2 ? 'bg-black-0 text-white-0' :'bg-color-trasparent'} 
                    h-[48px] border-[2px] border-solid rounded-md text-[18px] min-[1024px]:text-[14px] min-[1095]:text-[16px] min-[1150px]:text-[18px]`}
                        startContent={index == 0 ? <HelpIcon /> : index == 1 ? <CallIcon /> : <UserIcon height={undefined} width={undefined} />} 
                        href={link.fields.navigationUrl}>
                    {link.fields.navigationTitle}
                </Button>
            </NavbarItem>
        ))}
        {mobileButton?.navigation?.map((link, index) => ( 
        <NavbarItem key={`${link}-${index}`}
            className={isMenuOpen ? "hidden" : "xl:hidden sm:flex"}>
          <Button as={Link} href={link.fields.navigationUrl} className="bg-color-trasparent justify-end px-0">
            <Image src={`https:${mobileButton?.brandLogo?.fields?.file?.url}`} alt={link.fields.navigationTitle} width={32} height={32}></Image>
          </Button>
        </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarMenu className="bg-white-0 mt-[26px] gap-[26px]">
        {navbar?.navigation?.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full text-black-0 text-[20px]"
              href={item.fields.navigationUrl}
            >
              {item.fields.navigationTitle}
            </Link>
          </NavbarMenuItem>
        ))}
        {navbarButtons?.navigation?.map((link, index) => (    
            <NavbarMenuItem key={`${link}-${index}`}>
                <Button as={Link} className={`${index == 2 ? 'bg-black-0 text-white-0' :'bg-color-trasparent'} 
                    h-[48px] border-[2px] border-solid rounded-md text-[18px]`}
                        startContent={index == 0 ? <HelpIcon /> : index == 1 ? <CallIcon /> : <UserIcon height={undefined} width={undefined} />}
                        href={link.fields.navigationUrl}>
                    {link.fields.navigationTitle}
                </Button>
            </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
    </>
    )
}