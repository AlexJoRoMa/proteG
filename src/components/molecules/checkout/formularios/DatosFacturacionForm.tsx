'use client'
import { useCheckout } from "@/components/providers/CheckoutProvider";
import { CodigosCFDI, RegimenFiscal } from "@/constants/ContratacionConstants";
import { AutoCompleteInputStyles, AutoCompleteStyles, inputStyles } from "@/constants/StylesConstants";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { DatosContratacion } from "@/types/Contratacion";
import { InputFilter } from "@/utils/inputFilters";
import { Autocomplete, AutocompleteItem, Form, Input } from "@heroui/react";
import { FC, RefObject, useEffect, useState } from "react";

interface Props {
    formRef: RefObject<HTMLFormElement | null>;
    cfdi: string;
    setCfdi: (val: string) => void;
    regimen: string;
    setRegimen: (val: string) => void;
    setIsValid: (valid: boolean) => void;
    submitAttempted: boolean
}

export const DatosFacturacionForm: FC<Props> = ({ formRef, cfdi, setCfdi, regimen, setRegimen, setIsValid, submitAttempted }) => {

    const { getValue } = useMicrocopies('formulario-facturacion');
    const { datosContratacion } = useCheckout();

    const facturacion: Partial<DatosContratacion> = datosContratacion ?? {};
    const datosFacturacion = facturacion.DatosPersonales?.facturacion;

    const validateRfc = (value: string) => {
        if (!value) return null;

        //PM -> Persona Moral  PF-> Persona Fisica
        const rfc_pattern_pm = /^([A-ZÑ&]{3})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{3}$/i;
        const rfc_pattern_pf = /^([A-ZÑ&]{4})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{3}$/i;

        const validPM = rfc_pattern_pm.test(value) && value.length === 12;
        const validPF = rfc_pattern_pf.test(value) && value.length === 13;

        return (validPF || validPM) ? null : getValue('facturacion.error.rfc') || 'RFC incorrecto';

    };

    // Estado para el RFC
    const [rfc, setRfc] = useState(datosFacturacion?.rfc ?? "");

    // Estados para controlar si los campos han sido tocados
    const [cfdiTouched, setCfdiTouched] = useState(false);
    const [regimenTouched, setRegimenTouched] = useState(false);
    const [rfcTouched, setRfcTouched] = useState(false);

    // Validar formulario cuando cambien los valores
    useEffect(() => {
        const isFormValid =
            rfc.trim() !== '' &&
            rfc.length >= 12 &&
            cfdi.trim() !== '' &&
            regimen.trim() !== '';

        setIsValid(isFormValid);
    }, [rfc, cfdi, regimen, setIsValid]);

    return (
        <Form
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
            className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'
        >
            <Input
                label={getValue('facturacion.label.rfc')}
                name='rfc'
                type='text'
                variant='bordered'
                placeholder={getValue('facturacion.placeholder.rfc')}
                errorMessage={getValue('facturacion.error.rfc')}
                radius='sm'
                classNames={inputStyles}
                labelPlacement='outside'
                className='w-full'
                isRequired
                validate={validateRfc}
                maxLength={13}
                onInput={(e) => InputFilter(e, 'alfanumerico')}
                value={rfc}
                onChange={(e) => {
                    setRfc(e.target.value)
                    setRfcTouched(true);
                }}
                onBlur={() => setRfcTouched(true)}
                isInvalid={(rfcTouched || submitAttempted) && rfc.trim() === ''}
            />
            <Autocomplete
                label={getValue('facturacion.label.cfdi')}
                name="comprobanteFiscal"
                labelPlacement="outside"
                placeholder={getValue('facturacion.placeholder.cfdi')}
                variant='bordered'
                maxListboxHeight={200}
                isVirtualized
                isClearable={false}
                radius='sm'
                classNames={AutoCompleteStyles}
                inputProps={AutoCompleteInputStyles}
                isRequired
                className='w-full'
                defaultItems={CodigosCFDI}
                selectedKey={cfdi}
                onSelectionChange={(key) => {
                    setCfdi(key as string);
                    setCfdiTouched(true);
                }}
                inputValue={
                    CodigosCFDI.find(item => item.key === cfdi)?.label || ''
                }
                onInputChange={() => { }}
                errorMessage={getValue('facturacion.error.cfdi')}
                isInvalid={(cfdiTouched || submitAttempted) && cfdi.trim() === ''}
            >
                {
                    CodigosCFDI.map((reg, index, arr) => (
                        <AutocompleteItem key={reg.key} className={`h-[38px] ${index !== arr.length - 1 ? "border-b-1 border-black-0 rounded-none" : ""}`}>
                            {reg.label}
                        </AutocompleteItem>
                    ))
                }
            </ Autocomplete>

            <Autocomplete
                label={getValue('facturacion.label.regimenFiscal')}
                name="regimenFiscal"
                labelPlacement="outside"
                placeholder={getValue('facturacion.placeholder.regimenFiscal')}
                variant='bordered'
                maxListboxHeight={200}
                isVirtualized
                isClearable={false}
                radius='sm'
                classNames={AutoCompleteStyles}
                inputProps={AutoCompleteInputStyles}
                isRequired
                className='w-full'
                defaultItems={RegimenFiscal}
                selectedKey={regimen}
                onSelectionChange={(key) => {
                    setRegimen(key as string);
                    setRegimenTouched(true);
                }}
                inputValue={
                    RegimenFiscal.find(item => item.key === regimen)?.label || ''
                }
                errorMessage={getValue('facturacion.error.regimenFiscal')}
                isInvalid={(regimenTouched || submitAttempted) && regimen.trim() === ''}
            >
                {
                    RegimenFiscal.map((reg, index, arr) => (
                        <AutocompleteItem key={reg.key} className={`h-[38px] ${index !== arr.length - 1 ? "border-b-1 border-black-0 rounded-none" : ""}`}>
                            {reg.label}
                        </AutocompleteItem>
                    ))
                }
            </Autocomplete>
        </Form >
    )
}


