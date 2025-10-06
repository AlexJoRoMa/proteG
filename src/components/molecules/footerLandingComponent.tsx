'use client'

import Link from 'next/link';
import Image from 'next/image';

export default function FooterLandingContent() { 
    
    return (
    <>
        <footer className="bg-black-0 w-full">
  <div className="max-w-full">
    {/* Soporte y Contrata */}
    <div className="container mx-auto max-w-[80%] grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
        
        {/* izquierda valores */}
        <div className="flex flex-col items-center justify-center gap-2">
          
          {/* textos */}
          <div className="text-center">
            <h2 className="text-[20px] text-white-0">soporte al cliente</h2>

            <p className="text-white-0">
              llámanos al 800 120 5000
            </p>
          </div>
          {/* links de contacto */}
          <div className='flex items-center gap-6'>
            
            <Link href="hc/es" className='underline text-[18px] flex items-center gap-2'
              style={{color:'#66cafa' }}
              >
                <Image height={24} width={24} alt='llamanos' src='/headphones-blue.webp' />
                centro de ayuda
            </Link>

            <Link href="/" className='underline text-[18px] flex items-center gap-2'
              style={{color:'#25d366' }}
              >
                <Image height={24} width={24} alt='llamanos' src='/whatsapp-no-fill.webp' />
                WhatsApp
            </Link>
            
          </div>

        </div>
        
        {/* derecha valores */}
        <div className="flex flex-col items-center justify-center gap-2">
          
          {/* textos */}
          <div className="text-center">
            <h2 className="text-[20px] text-white-0">¡contrata ahora!</h2>

            <p className="text-white-0">
              llámanos al 800 607 7070
            </p>
          </div>

          {/* links de contacto */}
          <div className='flex items-center gap-6'>
            
            <Link href="/" className='underline text-[18px] flex items-center gap-2'
              style={{color:'#fcd116' }}
              >
                <Image height={24} width={24} alt='llamanos' src='/call.webp' />
                te llamamos
            </Link>

            <Link href="/" className='underline text-[18px] flex items-center gap-2'
              style={{color:'#25d366' }}
              >
                <Image height={24} width={24} alt='llamanos' src='/whatsapp-no-fill.webp' />
                WhatsApp
            </Link>
            
          </div>


        </div>

    </div>
    
    {/* logo below */}
    <div className="mt-8 border-t border-gray-250 pt-8">
      <div className="xsm:grid xsm:justify-center xl:flex xl:justify-between md:mx-md 2xl:mx-xl">
        <div className='xsm:justify-self-center'>
          <Image width={112} height={44} src="/izzi-logo-white.webp" alt="izzi logo" />
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-4 text-xs sm:mt-0 xl:justify-end">
          <li>
          <Image width={144} height={24} src="/profeco-white.webp" alt="logo profeco"/>
          </li>

          <li>
            <p className='text-white-0 text-[14px]'>© 2025, izzi.mx. Todos los derechos reservados.</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>
    </>
    )
}
