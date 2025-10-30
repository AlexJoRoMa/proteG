import { CodigosCFDI, RegimenFiscal } from "@/constants/ContratacionConstants";
import { inputStyles, SelectStyles } from "@/constants/StylesConstants";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { InputFilter } from "@/utils/inputFilters";
import { Form, Input, Select, SelectItem } from "@heroui/react";
import { FC, RefObject } from "react";

interface Props {
    formRef: RefObject<HTMLFormElement | null>;
    cfdi: string;
    setCfdi: (val: string) => void;
    regimen: string;
    setRegimen: (val: string) => void;
}

export const DatosFacturacionForm: FC<Props> = ({ formRef, cfdi, setCfdi, regimen, setRegimen }) => {

    const { getValue } = useMicrocopies('formulario-facturacion');

    const triggerFormChange = () => {
        if (formRef.current) {
            const event = new Event("input", { bubbles: true });
            formRef.current.dispatchEvent(event);
        }
    };

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
                onChange={triggerFormChange}
            />
            <Select
                label={getValue('facturacion.label.cfdi')}
                name="comprobanteFiscal"
                labelPlacement="outside"
                placeholder={getValue('facturacion.placeholder.cfdi')}
                variant='bordered'
                radius='sm'
                classNames={SelectStyles}
                isRequired
                className='w-full'
                value={cfdi}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setCfdi(e.target.value);
                    triggerFormChange();
                }}
                errorMessage="Ingresa un CFDI valido"
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
                radius='sm'
                classNames={SelectStyles}
                isRequired
                className='w-full'
                value={regimen}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setRegimen(e.target.value);
                    triggerFormChange();
                }}
                errorMessage="Ingresa un regimen fiscal valido"
            >
                {RegimenFiscal.map((regimenItem, index, arr) => (
                    <SelectItem key={regimenItem.key} className={`h-[38px] ${index !== arr.length - 1 ? "border-b-1 border-black-0 rounded-none" : ""}`}>
                        {regimenItem.label}
                    </SelectItem>
                ))}
            </Select>
        </Form >
    )
}


