'use client'
import { useCheckout } from "@/components/providers/CheckoutProvider";
import { CodigosCFDI, RegimenFiscal } from "@/constants/ContratacionConstants";
import { inputStyles, SelectStyles } from "@/constants/StylesConstants";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { DatosContratacion } from "@/types/Contratacion";
import { InputFilter } from "@/utils/inputFilters";
import { Form, Input, Select, SelectItem } from "@heroui/react";
import { FC, RefObject, useEffect, useState } from "react";

interface Props {
    formRef: RefObject<HTMLFormElement | null>;
    cfdi: string;
    setCfdi: (val: string) => void;
    regimen: string;
    setRegimen: (val: string) => void;
    setIsValid: (valid: boolean) => void;
}

export const DatosFacturacionForm: FC<Props> = ({ formRef, cfdi, setCfdi, regimen, setRegimen, setIsValid }) => {

    const { getValue } = useMicrocopies('formulario-facturacion');
    const { datosContratacion } = useCheckout();

    const facturacion: Partial<DatosContratacion> = datosContratacion ?? {};
    const datosFacturacion = facturacion.DatosPersonales?.facturacion;

    // Estado para el RFC
    const [rfc, setRfc] = useState(datosFacturacion?.rfc ?? "");

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
                radius='sm'
                classNames={inputStyles}
                labelPlacement='outside'
                className='w-full'
                isRequired
                errorMessage={getValue('facturacion.error.rfc')}
                onInput={(e) => InputFilter(e, 'alfanumerico')}
                value={rfc}
                onChange={(e) => setRfc(e.target.value)}
                isInvalid={rfc.trim() === '' || rfc.length < 12}
                maxLength={13}
            />
            <Select
                label={getValue('facturacion.label.cfdi')}
                name="comprobanteFiscal"
                labelPlacement="outside"
                placeholder={getValue('facturacion.placeholder.cfdi')}
                variant='bordered'
                maxListboxHeight={200}
                isVirtualized
                radius='sm'
                classNames={SelectStyles}
                isRequired
                className='w-full'
                selectedKeys={cfdi ? [cfdi] : []}
                onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setCfdi(selected || '');
                }}
                errorMessage="Ingresa un CFDI valido"
                isInvalid={cfdi.trim() === ''}
                defaultSelectedKeys={datosFacturacion?.comprobanteFiscal ? [datosFacturacion.comprobanteFiscal] : []}
            >
                {
                    CodigosCFDI.map((codigo, index, arr) => (
                        <SelectItem key={codigo.key} className={`h-[38px] ${index !== arr.length - 1 ? "border-b-1 border-black-0 rounded-none" : ""}`}>
                            {codigo.label}
                        </SelectItem>
                    ))
                }
            </Select >
            <Select
                label={getValue('facturacion.label.regimenFiscal')}
                name="regimenFiscal"
                labelPlacement="outside"
                placeholder={getValue('facturacion.placeholder.regimenFiscal')}
                variant='bordered'
                maxListboxHeight={200}
                isVirtualized
                radius='sm'
                classNames={SelectStyles}
                isRequired
                className='w-full'
                selectedKeys={regimen ? [regimen] : []}
                onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setRegimen(selected || '');
                }}
                errorMessage="Ingresa un regimen fiscal valido"
                isInvalid={regimen.trim() === ''}
                defaultSelectedKeys={datosFacturacion?.regimenFiscal ? [datosFacturacion.regimenFiscal] : []}
            >
                {
                    RegimenFiscal.map((reg, index, arr) => (
                        <SelectItem key={reg.key} className={`h-[38px] ${index !== arr.length - 1 ? "border-b-1 border-black-0 rounded-none" : ""}`}>
                            {reg.label}
                        </SelectItem>
                    ))
                }
            </Select>
        </Form >
    )
}


