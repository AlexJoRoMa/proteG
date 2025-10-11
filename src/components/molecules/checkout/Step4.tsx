import React, { useRef } from 'react';
import { Form, Input, user } from '@heroui/react'
import { DeleteIcon, UploadICon } from '@/constants/IconsConstants';
import { useStep4Form } from '@/hooks/checkout/useStep4Form';
import { useMicrocopies } from '@/hooks/useMicrocopies';

const Step4 = () => {

  const { DocumentosTitularRef, ineFile, comprobanteFile, setIneFile, setComprobanteFile } = useStep4Form();

  const { getValue } = useMicrocopies('contratacion-documentosTitular');

  const ineInputRef = useRef<HTMLInputElement | null>(null);
  const comprobanteInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange =
    (setter: (f: File | null) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];
        if (!file) return setter(null);

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
        if (!validTypes.includes(file.type) || file.size > 4 * 1024 * 1024) {
          alert("Archivo inválido. Debe ser JPG, PNG o PDF y menor a 4MB.");
          e.target.value = "";
          setter(null);
          return;
        }

        setter(file);
      };

  const clearFile = (ref: React.RefObject<HTMLInputElement | null>, setter: (f: File | null) => void) => {
    if (ref.current) ref.current.value = "";
    setter(null);
  };

  return (
    <>
      <Form ref={DocumentosTitularRef}>
        <h5
          className='text-[18px] font-bold leading-6'
        >
          {getValue('documentos.titulo')}
        </h5>
        <p
          className='text-[18px] mb-6'
        >
          {getValue('documentos.subtitulo')}
        </p>
        <p
          className='text-[18px] mb-4'
        >
          {`${getValue('documentos.ine.titulo')} `}
          <b>{getValue('documentos.formatos')}</b>
        </p>

        <Input
          ref={ineInputRef}
          label={ineFile ? `${getValue('documentos.input.ine')}.${ineFile.type.split("/")[1].toLowerCase()}` : getValue('documentos.input.vacio')}
          name="ine"
          type="file"
          variant='bordered'
          accept='.jpg, .jpeg, .png, .pdf'
          radius='sm'
          classNames={{
            label: 'font-bold text-lg leading-[24px] text-[#11181C] mt-[25px] px-[24px]',
            mainWrapper: 'mb-[16px] pointer',
            input: "cursor-pointer file:!hidden text-indent-[-9999px] text-transparent h-full",
            inputWrapper: ` rounded-xl shadow-none h-[78px] ${ineFile ? "bg-conic-custom !p-1 group-data-[hover=true]:!border-0 group-data-[focus=true]:!border-0" : "!p-1 border-dashed border-gray-200"}`,
            innerWrapper: "!items-center bg-white-0 rounded-md px-[24px] !border-0 group-data-[focus=true]:border-0",
          }}
          required
          className='w-full'
          endContent={
            ineFile ? (
              <div onClick={() => clearFile(ineInputRef, setIneFile)}><DeleteIcon /></div>
            ) : (
              <UploadICon />
            )
          }
          onChange={handleFileChange(setIneFile)}
        />

        <p
          className='text-[18px] mb-4 mt-6'
        >
          {`${getValue('documentos.comprobante.titulo')} `}
          <b>{getValue('documentos.formatos')}</b>
        </p>

        <Input
          ref={comprobanteInputRef}
          label={comprobanteFile ? `${getValue('documentos.input.comprobante')}.${comprobanteFile.type.split("/")[1].toLowerCase()})` : getValue('documentos.input.vacio')}
          name="comprobante"
          type="file"
          variant='bordered'
          radius='sm'
          accept='.jpg, .jpeg, .png, .pdf'
          classNames={{
            label: 'font-bold text-lg leading-[24px] text-[#11181C] mt-[25px] px-[24px]',
            mainWrapper: 'mb-[16px] pointer',
            input: "cursor-pointer file:!hidden text-indent-[-9999px] text-transparent",
            inputWrapper: ` rounded-xl shadow-none h-[78px] ${comprobanteFile ? "bg-conic-custom !p-1 group-data-[hover=true]:!border-0 group-data-[focus=true]:!border-0" : "!p-1 border-dashed border-gray-200"}`,
            innerWrapper: "!items-center bg-white-0 rounded-md px-[24px] !border-0 group-data-[focus=true]:border-0 group-data-[hover=true]:!border-0",
          }}
          required
          className='w-full'
          endContent={
            comprobanteFile ? (
              <div onClick={() => clearFile(comprobanteInputRef, setComprobanteFile)}><DeleteIcon /></div>
            ) : (
              <UploadICon />
            )
          }
          onChange={handleFileChange(setComprobanteFile)}
        />

      </Form>
    </>
  )
}

export default Step4
