"use client";

import { Button, Checkbox, Form, Input, Link } from '@heroui/react'
import { useState, lazy, Suspense, useEffect } from 'react'
import { TeLlamamosFormModalProps } from '@/types/ModalComponentTypes';
import useSWR from 'swr';
import { getPersistentQueryString } from '@/services/izzi/trackService';

// Carga dinámica del componente ReCAPTCHA para mejor performance
const ReCAPTCHA = lazy(() => import('react-google-recaptcha'));

const fetchMicrocopies = async (key: string) => {
    const res = await fetch(`/api/microcopies?key=${key}`);
    if (!res.ok) throw new Error("Error al obtener los microcopies desde Contentful");
    return res.json();
};

const TeLlamamosModalComponent = ({ modalData, onClose }: TeLlamamosFormModalProps & { onClose?: () => void }) => {
  return <TeLlamamosFormContent modalData={modalData} onClose={onClose} />;
};

const TeLlamamosFormContent = ({ modalData, onClose }: TeLlamamosFormModalProps & { onClose?: () => void }) => {
    const [isSelected, setIsSelected] = useState(false);
    const [phoneValue, setPhoneValue] = useState('');
    const [submitError, setSubmitError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [persistUTM, setPersistUTM] = useState<string | null>(null);

    useEffect(() => {
        const getPersist = getPersistentQueryString();
        if(getPersist){
            setPersistUTM(getPersist);
        }
    }, []);



    // Site key directamente desde variable de entorno pública
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    // Usar SWR para el fetching con caché optimizado
    const { data: contentfulData, error, isLoading } = useSWR(
        'TeLlamamos',
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
        },
        
        successTitle: '¡Gracias!',
        successDescription: 'En breve nos comunicaremos contigo.',
        successButtonText: 'Aceptar'
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
        },

        successTitle: getValueByKey('modal.tellamamos.success.title') || defaultData.successTitle,
        successDescription: getValueByKey('modal.tellamamos.success.description') || defaultData.successDescription,
        successButtonText: getValueByKey('modal.tellamamos.success.btn.text') || defaultData.successButtonText
    };


    const finalData = modalData || data;

    // Función para formatear el número de teléfono
    const formatPhoneNumber = (value: string) => {

        const numbers = value.replace(/\D/g, '');
        

        const limitedNumbers = numbers.slice(0, 10);
        

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
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'];
        
        if (allowedKeys.includes(e.key)) {
            return;
        }
        

        if (!/\d/.test(e.key)) {
            e.preventDefault();
        }
    };

    // Manejar cambio de reCAPTCHA
    const handleRecaptchaChange = (token: string | null) => {
        setRecaptchaToken(token);
    };

    // Validar formulario (ahora incluye reCAPTCHA)
    const isFormValid = () => {
        const cleanPhone = phoneValue.replace(/\D/g, '');
        return cleanPhone.length === 10 && isSelected && recaptchaToken;
    };

    // Función para resetear el formulario y volver al estado inicial
    const resetForm = () => {
        setPhoneValue('');
        setIsSelected(false);
        setRecaptchaToken(null);
        setSubmitError('');
        setIsSuccess(false);

        try {
            if (window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
                window.grecaptcha.reset();
            }
        } catch (error) {
            console.warn('[TeLlamamos Cliente] No se pudo resetear reCAPTCHA:', error);
        }
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        try {
            resetForm(); 
        } catch (error) {
            console.warn('[TeLlamamos Cliente] Error al resetear formulario:', error);
            setPhoneValue('');
            setIsSelected(false);
            setRecaptchaToken(null);
            setSubmitError('');
            setIsSuccess(false);
        }
        
        if (onClose) {
            onClose();
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isFormValid()) {
            console.warn('[TeLlamamos Cliente] ⚠️ Validación fallida');
            console.warn('[TeLlamamos Cliente] Estado del formulario:', {
                phoneLength: phoneValue.replace(/\D/g, '').length,
                isSelected,
                hasRecaptchaToken: !!recaptchaToken
            });
            setSubmitError('Por favor completa todos los campos correctamente');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const cleanPhone = phoneValue.replace(/\D/g, '');
            const setUTM = persistUTM || null;
            
            const payload = {
                telefono: cleanPhone,
                recaptchaToken,
                url: window.location.href,
                utm: setUTM || null,
            };
            
            const response = await fetch('/api/te-llamamos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await response.json();
                setSubmitError('');
                setIsSuccess(true);
            } else {
                const errorData = await response.json();
                console.error('[TeLlamamos Cliente] ❌ Error en respuesta:', errorData);
                throw new Error(errorData.message || errorData.error || 'Error al enviar formulario');
            }
        } catch (error) {
            console.error('[TeLlamamos Cliente] ❌ ERROR CRÍTICO en formulario');
            console.error('[TeLlamamos Cliente] Error type:', error instanceof Error ? error.constructor.name : typeof error);
            console.error('[TeLlamamos Cliente] Error message:', error instanceof Error ? error.message : String(error));
            console.error('[TeLlamamos Cliente] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            
            // Identificar tipos específicos de errores
            if (error instanceof TypeError) {
                console.error('[TeLlamamos Cliente] TypeError - Posible problema de red o fetch');
            }
            if (error instanceof SyntaxError) {
                console.error('[TeLlamamos Cliente] SyntaxError - Posible problema al parsear respuesta JSON');
            }
            
            setSubmitError(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Renderizar vista de éxito
    if (isSuccess) {
        return (
            <div className='flex flex-col justify-start sm:justify-center xl:items-center xl:p-14 py-6 px-4 h-full'>
                <div className="xl:text-center">

                    <h2 className='text-[20px] xl:text-[32px] mb-6 font-bold xl:font-normal'>
                        {finalData.successTitle || defaultData.successTitle}
                    </h2>
                    
                    <p className="text-base font-normal text-black leading-6 font-lato mb-6">
                        {finalData.successDescription || defaultData.successDescription}
                    </p>
                    
                    <Button
                        onPress={handleCloseModal}
                        className="bg-black flex mx-auto text-white font-bold text-base h-12 px-4 py-3 rounded-md w-64 font-lato hover:bg-gray-800 transition-colors"
                    >
                        {finalData.successButtonText || defaultData.successButtonText}
                    </Button>
                </div>
            </div>
        );
    }

    // Renderizar formulario normal
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

                    {submitError && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                            {submitError}
                        </div>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <div className='flex items-center content-center mb-6 gap-1 text-[16px] '>
                            <Checkbox className='' radius='sm' color='primary' isSelected={isSelected} onValueChange={setIsSelected}>
                                {finalData.checkboxText}
                            </Checkbox>
                            <Link target='_blank' rel='noopener noreferrer' className='text-black underline font-bold' href={finalData.privacyLink.url}>{finalData.privacyLink.text}</Link>
                        </div>

                        <Input 
                            className='min-w-[340px] mb-6 text-[16px]' 
                            maxLength={12}
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
                            isDisabled={isSubmitting}
                        />
                        
                        <div className="mb-4 flex justify-center w-full">
                            {recaptchaSiteKey ? (
                                <Suspense fallback={
                                    <div className="bg-gray-50 h-[78px] w-[304px] rounded-sm border border-gray-300 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="animate-pulse w-6 h-6 bg-gray-400 rounded mx-auto mb-2"></div>
                                            <div className="text-sm text-gray-500">Cargando reCAPTCHA...</div>
                                        </div>
                                    </div>
                                }>
                                    <ReCAPTCHA
                                        sitekey={recaptchaSiteKey}
                                        onChange={handleRecaptchaChange}
                                        theme="light"
                                        
                                    />
                                </Suspense>
                            ) : (
                                <div className="bg-red-50 h-[78px] w-[304px] rounded-sm border border-red-300 flex items-center justify-center">
                                    <p className="text-sm text-red-500">reCAPTCHA no configurado</p>
                                </div>
                            )}
                        </div>

                        <Button 
                            type='submit' 
                            className='bg-black w-[260px] mx-auto md:w-[340px] text-white font-bold h-[48px] text-[16px] leading-[24px] rounded-none mt-4 disabled:cursor-not-allowed disabled:opacity-30 disabled:pointer-events-none' 
                            disabled={!isFormValid() || isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : finalData.buttonText}
                        </Button>
                    </Form>
                </>
            )}
        </div>
    )
}

export default TeLlamamosModalComponent
