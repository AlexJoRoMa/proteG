'use client'

import Link from 'next/link';
import { Accordion, AccordionItem } from '@heroui/react';
import { FooterComponentProps, IzziFooterLinks, Contact, IzziCopyright } from "@/types/FooterTypes";
import { DropIcon } from '@/components/atoms/FooterIcons';
import Image from 'next/image';

export default function IzziFooterContent({FooterData}: FooterComponentProps) { 
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
            <Link key={`${contact}-${index}`} href={`${contact.fields.navigationUrl}`} className='underline text-[18px] flex items-center gap-2'
              style={{color: contact.fields.backgroundColor?.value }}
              ><Image height={24} width={24} alt={`${contact.fields.linkIcon?.fields.file.fileName}`} src={`https:${contact.fields.linkIcon?.fields.file.url}`} />{contact.fields.navigationTitle}</Link>
            ))}
          </div>
        </div>
        ))}
    </div>
    <div className="lg:flex lg:items-start lg:gap-8 mt-8 border-t border-gray-250 text-white-0">
        <div className="mx-sm 2xl:ml-[200px] 2xl:mr-[200px] md:mx-[80px] lg:w-full mt-8 grid grid-cols-1 gap-8">
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
                        <Link className='text-[16px] text-white-0' href={`${accordion.fields.navigationUrl}`}>{accordion.fields.navigationTitle}</Link>
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
    <div className="mt-8 border-t border-gray-250 pt-8">
      <div className="xsm:grid xsm:justify-center xl:flex xl:justify-between md:mx-md 2xl:mx-xl">
        <div className='xsm:justify-self-center'>
          <Image width={112} height={44} src={`https:${copyright.fields.footerIzziLogo.fields.file.url}`} alt={`${copyright.fields.footerIzziLogo.fields.file.fileName}`}/>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-4 text-xs sm:mt-0 xl:justify-end">
          <li>
          <Image width={144} height={24} src={`https:${copyright.fields.footerProfecoLogo.fields.file.url}`} alt={`${copyright.fields.footerProfecoLogo.fields.file.fileName}`}/>
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
