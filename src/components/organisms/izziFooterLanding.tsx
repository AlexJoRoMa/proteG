/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import Link from 'next/link';
import { Accordion, AccordionItem } from '@heroui/react';
import { FooterComponentProps, IzziFooterLinks, Contact, IzziCopyright } from "@/types/FooterTypes";
import { DropIcon } from '@/components/atoms/FooterIcons';
import Image from 'next/image';
import ButtonModal from '../atoms/ButtonModal';
import TeLlamamosModalComponent from '../layouts/modals/TeLlamamosModalComponent';
import TeAyudamosModalComponent from '../layouts/modals/TeAyudamosModalComponent';

export default function LandingFooterContent({FooterData}: FooterComponentProps) { 
    const contactSection = FooterData?.fields.footerContactSection as Array<Contact>;
    const links = FooterData?.fields as IzziFooterLinks;
    const copyright = FooterData?.fields?.copyrightSection as IzziCopyright

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

    return (
    <>
        <footer className="bg-black-0 w-full">
  <div className="max-w-full">
    <div className="container mx-auto max-w-[80%] grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
        {contactSection.map((link, index) => ( 
        <div className="flex flex-col items-center justify-center gap-2" key={`${link}-${index}`}>
          <div className="text-center">
            <h2 className="text-[20px] text-white-0">{link?.fields?.topCopy}</h2>

            <p className="text-white-0">
              {`${link?.fields?.bottomCopy} ${link?.fields?.contactNumber}`}
            </p>
          </div>
          <div className='flex items-center gap-6'>
            {link.fields.contactLinks.map((contact, index) => ( 
              (contact.fields.typeModal === 'TeLlamamos' || contact.fields.typeModal === 'TeAyudamos') ? (
                <ButtonModal
                key={`${contact.fields.navigationTitle}-${index}`}
                textBtn={contact.fields.navigationTitle}
                classStyles={`bg-color-trasparent underline   text-[18px]`}
                closeButtonStroke='black'
                modalContentClassName='modal-content-size'
                backdropColor='black-0/80'
                startContent={<Image className='max-w-[24px] h-auto' src={`https:${contact.fields.linkIcon?.fields.file.url}`} alt={`${contact.fields.linkIcon?.fields.file.fileName}`} width={24} height={24} priority />}
                style={{color:contact.fields.backgroundColor?.value as string}}
                >
                  {renderModalComponent(contact.fields.typeModal)}
                </ButtonModal>
              ) : (
                <Link key={`${contact}-${index}`} href={`${contact.fields.navigationUrl}`} className='underline text-[18px] flex items-center gap-2'
              style={{color: contact.fields.backgroundColor?.value }}
              ><Image height={24} width={24} alt={`${contact.fields.linkIcon?.fields.file.fileName}`} src={`https:${contact.fields.linkIcon?.fields.file.url}`} />{contact.fields.navigationTitle}</Link>
              )
            ))}
          </div>
        </div>
        ))}
    </div>
   
    <div className="mt-8 border-t border-gray-250 pt-8">
      <div className="xsm:grid xsm:justify-center xl:flex xl:justify-between md:mx-md 2xl:mx-xl">
        <div className='xsm:justify-self-center'>
          <Image width={112} height={44} src={`https:${copyright.fields.footerIzziLogo.fields.file.url}`} alt={`${copyright.fields.footerIzziLogo.fields.file.fileName}`}/>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-4 text-xs sm:mt-0 xl:justify-end">
          <li>
            <Link href={`${copyright.fields.footerProfecoLink}`} target='_blank'>
            <Image width={144} height={24} src={`https:${copyright.fields.footerProfecoLogo.fields.file.url}`} alt={`${copyright.fields.footerProfecoLogo.fields.file.fileName}`}/>
            </Link>
          </li>

          <li>
            <p className='text-white-0 text-[14px]'>{copyright.fields.copyright}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>
    </>
    )
}
