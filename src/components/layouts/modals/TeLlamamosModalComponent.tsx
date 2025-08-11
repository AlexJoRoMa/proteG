
"use client";

import { Button, Checkbox, Form, Input, Link } from '@heroui/react'
import { useState } from 'react'
import { TeLlamamosFormModalProps } from '@/types/ModalComponentTypes';
import useSWR from 'swr';

const fetchMicrocopies = async (key: string) => {
    const res = await fetch(`/api/microcopies?key=${key}`);
    if (!res.ok) throw new Error("Error al obtener los microcopies desde Contentful");
    return res.json();
};

const TeLlamamosModalComponent = ({ modalData }: TeLlamamosFormModalProps) => {

    const [isSelected, setIsSelected] = useState(false);
    const [phoneValue, setPhoneValue] = useState('');

    // Usar SWR para el fetching con caché optimizado
    const { data: contentfulData, error, isLoading } = useSWR(
        'TeLlamamos', // Key para el caché
        fetchMicrocopies,
        {
            dedupingInterval: 3600000, // 1 hora
            revalidateOnFocus: false,
            keepPreviousData: true,
            revalidateIfStale: false,
        }
    );

    // Helper para encontrar valores por key
    const getValueByKey = (key: string) => {
        // El response es un array directo con el resourceSet
        if (!contentfulData || !Array.isArray(contentfulData) || !contentfulData[0]?.fields?.resources) {
            return '';
        }
        
        const item = contentfulData[0].fields.resources.find((item: { fields: { key: string; value: string } }) => 
            item.fields?.key === key
        );
        
        return item?.fields?.value || '';
    };

    // Datos por defecto y datos de Contentful
    const defaultData = {
        title: 'Nosotros te llamamos, ingresa tu teléfono',
        placeholder: 'Ej. 55 1234 5678',
        buttonText: 'Llámame ahora',
        checkboxText: 'He leído y acepto las',
        telephoneLabel: 'Ingresa tu teléfono',
        privacyLink: {
            text: 'Políticas de Privacidad',
            url: '#'
        }
    };

    const data = isLoading ? defaultData : {
        title: getValueByKey('modal.tellamamos.title') || defaultData.title,
        placeholder: getValueByKey('modal.tellamamos.telefono.placeholder') || defaultData.placeholder,
        buttonText: getValueByKey('modal.tellamamos.button.text') || defaultData.buttonText,
        checkboxText: getValueByKey('modal.tellamamos.terminos.text') || defaultData.checkboxText,
        telephoneLabel: getValueByKey('modal.tellamamos.telefono.label') || defaultData.telephoneLabel,
        privacyLink: {
            text: getValueByKey('modal.tellamamos.terminos.link.text') || defaultData.privacyLink.text,
            url: getValueByKey('modal.tellamamos.terminos.link.url') || defaultData.privacyLink.url
        }
    };

    // Usar modalData si se pasa como prop, sino usar datos de Contentful
    const finalData = modalData || data;

    // Función para formatear el número de teléfono
    const formatPhoneNumber = (value: string) => {
        // Remover todos los caracteres que no sean números
        const numbers = value.replace(/\D/g, '');
        
        // Limitar a 10 dígitos
        const limitedNumbers = numbers.slice(0, 10);
        
        // Aplicar formato según la cantidad de dígitos
        if (limitedNumbers.length <= 2) {
            return limitedNumbers;
        } else if (limitedNumbers.length <= 6) {
            return `${limitedNumbers.slice(0, 2)} ${limitedNumbers.slice(2)}`;
        } else {
            return `${limitedNumbers.slice(0, 2)} ${limitedNumbers.slice(2, 6)} ${limitedNumbers.slice(6)}`;
        }
    };

    // Manejar cambios en el input
    const handlePhoneChange = (value: string) => {
        const formattedValue = formatPhoneNumber(value);
        setPhoneValue(formattedValue);
    };

    // Validar que solo se ingresen números
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Permitir teclas de control (backspace, delete, arrow keys, etc.)
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'];
        
        if (allowedKeys.includes(e.key)) {
            return;
        }
        
        // Solo permitir números
        if (!/\d/.test(e.key)) {
            e.preventDefault();
        }
    };

  return (
    <div className='flex flex-col justify-center xl:items-center xl:p-14 py-6 px-4'>
        {isLoading && !modalData && (
            <div className="py-8 text-center">
                <div className="text-gray-500">Cargando...</div>
            </div>
        )}
        {error && !modalData && (
            <div className="py-8 text-center">
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                    Ha surgido un error al traer la información solicitada.
                </div>
            </div>
        )}
        {(!isLoading || modalData) && (
            <>
                <h2 className='text-[20px] xl:text-[32px] mb-6 mr-auto w-[60%] xl:w-full xl:mr-0 xl:text-center font-bold xl:font-normal'>{finalData.title}</h2>
                <Form>
                    <div className='flex items-center content-center mb-6 gap-1 text-[16px] '>
                        <Checkbox className='' radius='sm' color='primary' isSelected={isSelected} onValueChange={setIsSelected}>
                            {finalData.checkboxText}
                        </Checkbox>
                        <Link target='_blank' className='text-black underline font-bold' href={finalData.privacyLink.url}>{finalData.privacyLink.text}</Link>
                    </div>

                    <Input 
                        className='min-w-[340px] mb-6 text-[16px]' 
                        maxLength={12} // Aumentado para incluir espacios en el formato "55 1234 5678"
                        labelPlacement='outside-top' 
                        isClearable 
                        type='tel' 
                        label={finalData.telephoneLabel} 
                        placeholder={finalData.placeholder}
                        value={phoneValue}
                        onValueChange={handlePhoneChange}
                        onKeyDown={handleKeyPress}
                        variant='bordered'
                        radius='sm'
                    />
                    <Button type='submit' className='bg-black w-[260px] mx-auto md:w-[340px] text-white font-bold h-[48px] text-[16px] leading-[24px] rounded-none mt-4 disabled:cursor-not-allowed disabled:opacity-30 disabled:pointer-events-none' disabled={!isSelected}>
                        {finalData.buttonText}
                    </Button>
                </Form>
            </>
        )}
    </div>
  )
}

export default TeLlamamosModalComponent
