'use client';
// import Link from "next/link";
import { HelpIcon, CallIcon, UserIcon, LocationIcon } from "../atoms/buttonIcon";

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

export const IzziLogo = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="48" viewBox="0 0 120 48" fill="none">
        <path d="M95.5488 45.9219H102.763V39.2146H95.5488V45.9219Z" fill="#FCD116"/>
        <path d="M56.6217 15.6432L40.1277 32.0421H56.6217V38.7493H31.1855V32.0421L47.6786 15.6432H31.1855V8.93594H56.6217V15.6432Z" fill="#2B2B28"/>
        <path d="M88.8032 15.6432L72.3103 32.0421H88.8032V38.7493H63.3672V32.0421L79.8612 15.6432H63.3672V8.93594H88.8032V15.6432Z" fill="#2B2B28"/>
        <path d="M7.94665 32.0422H0.732422V38.7495H7.94665V32.0422Z" fill="#00C1B5"/>
        <path d="M24.4369 1.76343H17.2227V8.47068H24.4369V1.76343Z" fill="#FF6C07"/>
        <path d="M102.769 8.93594H95.5547V32.0421H102.769V8.93594Z" fill="#2B2B28"/>
        <path d="M24.4369 15.6429H17.2227V38.7491H24.4369V15.6429Z" fill="#2B2B28"/>
        <path d="M112.047 15.6424H119.261V8.93515H112.047V15.6424Z" fill="#D60270"/>
        </svg>
    );
  };
interface IzziNavbar {
    internalName: string;
    brandLogo?: object;
    navigation: Array<string>;
}

const responseData = await contentfulClient.getEntries({
        include: 3,
        content_type: 'header'
    });

const topNavbar: IzziNavbar = responseData.items.filter(item => item.fields.internalName == 'TopNavbar')
    .map(item => item);

const navbar: IzziNavbar = responseData.items.filter(item => item.fields.internalName == 'Navbar')
    .map(item => item);
const logoUrl: string = `https:${navbar[0].fields.brandLogo.fields.file.url}`;

const navbarButtons: IzziNavbar = responseData.items.filter(item => item.fields.internalName == 'NavbarButtons')
    .map(item => item);

export default function App() {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // const IzziLogo = () => {
    //     return (
    //         <Image alt="Logo Izzi" src={logoUrl} width={120} height={47} />
    //     )
    // }

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
        <NavbarBrand className="lg:justify-start sm:justify-center">
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
      <NavbarContent justify="end">
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