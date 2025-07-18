'use client'

import Link from 'next/link';
import { Accordion, AccordionItem } from '@heroui/react';
import { IzziFooter, FooterComponentProps, IzziFooterLinks } from "@/types/FooterTypes";
import { HeadphoneIcon, WppIcon, DropIcon, IzziLogo, ProfecoLogo } from '@/components/atoms/FooterIcons';

export default function IzziFooterContent({contactData, linksData}: FooterComponentProps) {

    const contactSection = contactData?.fields as IzziFooter;
    const links = linksData?.fields as IzziFooterLinks;

    const itemClasses = {
        title: "font-normal text-[20px] text-white-0",
        content: "text-[20px] px-2",
        indicator: "data-[open=true]:-rotate-180",
        heading: "border-b border-gray-250"
    }
    
    const subListClasses = {
        title: "mr-4 font-normal text-[20px] text-white-0",
        content: "text-[20px]",
        indicator: "data-[open=true]:-rotate-180",
    }  

    return (
    <>
        <footer className="bg-black-0 w-full">
  <div className="max-w-full px-4 py-16 sm:px-6 lg:px-8">
    <div className="container mx-auto max-w-[80%] grid grid-cols-1 md:grid-cols-2 gap-8">
        {contactSection?.footerContactSection?.map((link, index) => ( 
        <div className="flex flex-col items-center justify-center gap-2" key={`${link}-${index}`}>
          <div className="text-center">
            <h2 className="text-[20px] text-white-0">{link?.fields?.topCopy}</h2>

            <p className="text-white-0">
              {`${link?.fields?.bottomCopy} ${link?.fields?.contactNumber}`}
            </p>
          </div>
          <div className='flex items-center gap-6'>
            {/* TODO: Renderizar imagenes desde contentful */}
              <Link href='#' className='text-white-0 underline text-[18px] flex items-center gap-2'><HeadphoneIcon />centro de ayuda</Link>
            
            
              <Link href='#' className='text-white-0 underline text-[18px] flex items-center gap-2'><WppIcon /> WhatsApp</Link>
            
          </div>
        </div>
        ))}
    </div>
    <div className="lg:flex lg:items-start lg:gap-8 mt-8 border-t border-gray-250 text-white-0">
        <div className="mx-auto lg:mx-md lg:w-full mt-8 grid grid-cols-1 gap-8">
          <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
          {links?.footerLinkSection.map((link, index) => (
            <div className="col-span-2 sm:col-span-1" key={`${link}-${index}`}>
              {link?.fields?.footerLink && link?.fields?.footerLink.length > 0 &&
              <Accordion itemClasses={itemClasses}>
                <AccordionItem indicator={<DropIcon />} aria-label={link.fields.internalName} title={link.fields.internalName}>
                <ul>
                {link?.fields.footerLink.map((accordion, index) => (
                    <li key={`${accordion}-${index}`}>
                        {accordion?.fields?.footerLink && accordion?.fields?.footerLink.length > 0 &&
                                <Accordion isCompact itemClasses={subListClasses}>
                                    <AccordionItem indicator={<DropIcon />} aria-label={accordion.fields.internalName} title={accordion.fields.internalName}>
                                        <ul>
                                        {accordion?.fields?.footerLink.map((subList, index) => (
                                            <li key={`${subList}-${index}`}>
                                                <Link href={`${subList.fields.navigationUrl}`}>{subList.fields.navigationTitle}</Link>
                                            </li>
                                        ))}
                                        </ul>
                                    </AccordionItem>
                                </Accordion>
                        }
                        <Link className='text[20px] text-white-0' href={`${accordion.fields.navigationUrl}`}>{accordion.fields.navigationTitle}</Link>
                    </li>
                ))}
                </ul>
                </AccordionItem>
              </Accordion>
                }
                {!link?.fields?.footerLink &&
                    <Link className='inline-block align-middle text-[20px] text-white-0 px-2 pt-4' href={`${link.fields.navigationUrl}`}>{link.fields.navigationTitle}</Link>
                }
            </div>
            ))}
            </div>
        </div>
    </div>
    {/* TODO: Renderizar contenido desde contentful */}
    <div className="mt-8 border-t border-gray-250 pt-8">
      <div className="xsm:grid xsm:justify-center xl:flex xl:justify-between">
        <div className='xsm:justify-self-center'>
          <IzziLogo />
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-4 text-xs sm:mt-0 xl:justify-end">
          <li>
            <ProfecoLogo />
          </li>

          <li>
            <p className='text-white-0 text-[14px]'>© 2024, izzi.mx. Todos los derechos reservados.</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>
    </>
    )
}