
import React, { useRef, useState } from 'react';
import { Form, Input } from '@heroui/react'
import { DeleteIcon, UploadICon } from '@/constants/IconsConstants';
import { useStep4Form } from '@/hooks/checkout/useStep4Form';
import { useMicrocopies } from '@/hooks/useMicrocopies';

const Step4 = () => {

  const { DocumentosTitularRef, ineFile, comprobanteFile, setIneFile, setComprobanteFile, invalidateStep } = useStep4Form();

  const { getValue } = useMicrocopies('contratacion-documentosTitular');

  const ineInputRef = useRef<HTMLInputElement | null>(null);
  const comprobanteInputRef = useRef<HTMLInputElement | null>(null);

  const [errorComprobante, setErrorComprobante] = useState<string | null>(null);
  const [errorIne, setErrorIne] = useState<string | null>(null);

  const handleFileChange =
    (
      setter: (f: File | null) => void,
      setError: (e: string | null) => void
    ) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];
        if (!file) {
          setter(null);
          setError(null);
          invalidateStep();
          return;
        }

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
        if (!validTypes.includes(file.type)) {
          setError("El archivo tiene un formato inválido. Intentalo de nuevo.");
          e.target.value = "";
          setter(null);
          invalidateStep();
          return;
        }

        if (file.size > 4 * 1024 * 1024) {
          setError("El archivo rebasa el límite de 4 MB. inténtalo de nuevo.");
          e.target.value = "";
          setter(null);
          invalidateStep();
          return;
        }

        setError(null);
        setter(file);
      };

  const clearFile = (
    ref: React.RefObject<HTMLInputElement | null>,
    setter: (f: File | null) => void,
    setError: (e: string | null) => void
  ) => {
    if (ref.current) ref.current.value = "";
    setter(null);
    setError(null);
    invalidateStep();
  };

  const borderClass = (hasFile: boolean, hasError: boolean) =>
    hasError ? "!p-1 border-dashed border-red-700" :
      hasFile ? "bg-conic-custom !p-1 group-data-[hover=true]:!border-0 group-data-[focus=true]:!border-0" :
        "!p-1 border-dashed border-gray-200";

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
            base: 'data-[hover=true]:!cursor-pointer',
            label: 'font-bold text-lg leading-[24px] text-[#11181C] mt-[25px] px-[24px] cursor-pointer',
            mainWrapper: 'mb-[16px] pointer',
            input: "cursor-pointer file:!hidden text-indent-[-9999px] text-transparent h-full",
            inputWrapper: `cursor-pointer rounded-xl shadow-none h-[78px] ${borderClass(!!ineFile, !!errorIne)}`,
            innerWrapper: "!items-center cursor-pointer bg-white-0 rounded-md px-[24px] !border-0 group-data-[focus=true]:border-0",
          }}
          required
          className='w-full'
          endContent={
            ineFile ? (
              <div onClick={() => clearFile(ineInputRef, setIneFile, setErrorIne)}><DeleteIcon /></div>
            ) : (
              <UploadICon />
            )
          }
          onChange={handleFileChange(setIneFile, setErrorIne)}
        />
        {errorIne && (
          <p className='mt-[12px] text-red-700 text-xs md:text-sm'>{errorIne}</p>
        )}

        <p
          className='text-[18px] mb-4 mt-6'
        >
          {`${getValue('documentos.comprobante.titulo')} `}
          <b>{getValue('documentos.formatos')}</b>
        </p>

        <Input
          ref={comprobanteInputRef}
          label={comprobanteFile ? `${getValue('documentos.input.comprobante')}.${comprobanteFile.type.split("/")[1].toLowerCase()}` : getValue('documentos.input.vacio')}
          name="comprobante"
          type="file"
          variant='bordered'
          radius='sm'
          accept='.jpg, .jpeg, .png, .pdf'
          classNames={{
            base: 'data-[hover=true]:!cursor-pointer',
            label: 'font-bold text-lg leading-[24px] text-[#11181C] mt-[25px] px-[24px] cursor-pointer',
            mainWrapper: 'mb-[16px] pointer',
            input: "cursor-pointer file:!hidden text-indent-[-9999px] text-transparent",
            inputWrapper: `cursor-pointer rounded-xl shadow-none h-[78px] ${borderClass(!!comprobanteFile, !!errorComprobante)}`,
            innerWrapper: "!items-center cursor-pointer bg-white-0 rounded-md px-[24px] !border-0 group-data-[focus=true]:border-0 group-data-[hover=true]:!border-0",
          }}
          required
          className='w-full'
          endContent={
            comprobanteFile ? (
              <div onClick={() => clearFile(comprobanteInputRef, setComprobanteFile, setErrorComprobante)}><DeleteIcon /></div>
            ) : (
              <UploadICon />
            )
          }
          onChange={handleFileChange(setComprobanteFile, setErrorComprobante)}
        />

        {errorComprobante && (
          <p className='mt-[12px] text-red-700 text-xs md:text-sm'>{errorComprobante}</p>
        )}


      </Form>
    </>
  )
}

export default Step4
