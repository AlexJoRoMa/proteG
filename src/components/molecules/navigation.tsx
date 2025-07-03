'use client';
import { IzziLogo, HelpIcon, CallIcon, UserIcon, LocationIcon } from "../atoms/buttonIcon";

import Image from "next/image";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button
} from "@heroui/react";

import { contentfulClient } from '../../services/contentful/client';

interface IzziNavbar {
    internalName: string;
    brandLogo?: object;
    navigation: Array<string>;
}

const responseData = await contentfulClient.getEntries({
        include: 3,
        content_type: 'header'
    });
// TODO: Refactor to iterate one time
const topNavbar: IzziNavbar = responseData.items.filter(item => item.fields.internalName == 'TopNavbar')
    .map(item => item);

const navbar: IzziNavbar = responseData.items.filter(item => item.fields.internalName == 'Navbar')
    .map(item => item);
const logoUrl: string = `https:${navbar[0].fields.brandLogo.fields.file.url}`;

const navbarButtons: IzziNavbar = responseData.items.filter(item => item.fields.internalName == 'NavbarButtons')
    .map(item => item);

export default function App() {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);


    const borderStyle = {
        'borderBottom': '2px solid',
        'borderImage': 'linear-gradient(90deg, #FF6C07 0%, #4DA9A7 33%, #D31772 66%, #FCD116 100%);',
        'borderImageSlice': '1',
        width: '100%'
    }

  return (
    <>
    <Navbar style={borderStyle} shouldHideOnScroll justify="start"
    classNames={{
        wrapper: "max-w-full",
      }}
      className={isMenuOpen ? "hidden" : 'sm:flex'}>
        <NavbarContent>
        {topNavbar[0].fields.navigation.map((link, index) => (    
        <NavbarItem key={`${link}-${index}`}>
            <Link className={`text-black-0 ${index == 0 ? 'font-bold' : 'font-normal'}`} href={link.fields.navigationUrl}>
            {link.fields.navigationTitle}
            </Link>
        </NavbarItem>
        ))}
        </NavbarContent>
        <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
                <Button startContent={<LocationIcon />} as={Link} href="#" className="text-black-0 font-normal bg-color-trasparent">comprobar mi cobertura</Button>
            </NavbarItem>
            <NavbarItem className="sm:hidden">
            <Button startContent={<LocationIcon />} as={Link} href="#" className="text-black-0 font-normal bg-color-trasparent">tu cobertura</Button>
            </NavbarItem>
        </NavbarContent>
    </Navbar>
    
    <Navbar onMenuOpenChange={setIsMenuOpen} justify="start"
    classNames={{
        wrapper: "max-w-full h-[88px]"
      }}>
      <NavbarContent className="!grow-0">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        
      </NavbarContent>
      <NavbarContent className="!grow-0 lg:justify-start sm:justify-center">
        <NavbarBrand>
          <IzziLogo />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-[32px]" justify="start">
        {navbar[0].fields.navigation.map((link, index) => (    
        <NavbarItem key={`${link}-${index}`}>
            <Link color="foreground" href={link.fields.navigationUrl}>
            {link.fields.navigationTitle}
            </Link>
        </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end" className="!grow-0">
        {navbarButtons[0].fields.navigation.map((link, index) => (    
            <NavbarItem key={`${link}-${index}`} className="hidden lg:flex">
                <Button className={`${index == 2 ? 'bg-black-0 text-white-0' :'bg-color-trasparent'} 
                    h-[48px] border-[2px] border-solid rounded-md text-[18px]`}
                        startContent={index == 0 ? <HelpIcon /> : index == 1 ? <CallIcon /> : <UserIcon />} 
                        href={link.fields.navigationUrl}>
                    {link.fields.navigationTitle}
                </Button>
            </NavbarItem>
        ))}
        <NavbarItem
            className={isMenuOpen ? "hidden" : "lg:hidden sm:flex"}
            justify="end">
          <Button className="bg-color-trasparent" startContent={<UserIcon height={32} width={32} />}>
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="mt-[26px] gap-[26px]">
        {navbar[0].fields.navigation.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full text-black-0 text-[20px]"
              href={item.fields.navigationUrl}
            >
              {item.fields.navigationTitle}
            </Link>
          </NavbarMenuItem>
        ))}
        {navbarButtons[0].fields.navigation.map((link, index) => (    
            <NavbarMenuItem key={`${link}-${index}`}>
                <Button className={`${index == 2 ? 'bg-black-0 text-white-0' :'bg-color-trasparent'} 
                    h-[48px] border-[2px] border-solid rounded-md text-[18px]`}
                        startContent={index == 0 ? <HelpIcon /> : index == 1 ? <CallIcon /> : <UserIcon />}
                        href={link.fields.navigationUrl}>
                    {link.fields.navigationTitle}
                </Button>
            </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
    </>
  );
}