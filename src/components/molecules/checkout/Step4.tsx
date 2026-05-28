
import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Progress } from '@heroui/react'
import { DeleteIcon, UploadICon } from '@/constants/IconsConstants';
import { useStep4Form } from '@/hooks/checkout/useStep4Form';
import { useMicrocopies } from '@/hooks/useMicrocopies';
import { useCheckout } from '@/components/providers/CheckoutProvider';

const descriptionStyle = 'mt-2 w-full text-black text-[16px] animate-appearance-in';
const barTextStyle = 'flex items-center justify-between gap-3';

const Step4 = () => {

  const { markStepAsIncompleted, currentStep } = useCheckout();

  const [progressIne, setProgressIne] = useState(0);

  const { DocumentosTitularRef, ineFile, isPreparingFiles, setIneFile, invalidateStep } = useStep4Form(progressIne);

  const { getValue } = useMicrocopies('contratacion-documentosTitular');

  const ineInputRef = useRef<HTMLInputElement | null>(null);

  const [errorIne, setErrorIne] = useState<string | null>(null);

  const isIneLoad = !!ineFile && progressIne < 100;

  useEffect(() => {
    if (ineFile) {
      const timer = setInterval(() => {
        setProgressIne((prev) => (prev >= 100 ? 100 : prev + 10));
      }, 300);
      return () => clearInterval(timer);
    } else {
      setProgressIne(0);
    }

  }, [ineFile])

  const getSeconds = (progress: number) => Math.ceil((100 - progress) / 33.33)

  const handleFileChange =
    (
      setter: (f: File | null) => void,
      setError: (e: string | null) => void,
      resetProgress: (n: number) => void
    ) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];
        if (!file) {
          setter(null);
          setError(null);
          resetProgress(0)
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

        resetProgress(0)
        setError(null);
        setter(file);
      };

  const clearFile = (
    ref: React.RefObject<HTMLInputElement | null>,
    setter: (f: File | null) => void,
    setError: (e: string | null) => void,
    resetProgress: (n: number) => void
  ) => {
    if (ref.current) ref.current.value = "";
    setter(null);
    setError(null);
    invalidateStep();
    resetProgress(0);
    markStepAsIncompleted(currentStep);
  };

  const borderClass = (hasFile: boolean, hasError: boolean, progress: number) =>
    hasError ? "!p-1 border-dashed border-red-700" :
      hasFile && progress === 100 ? "bg-conic-custom !p-1 group-data-[hover=true]:!border-0 group-data-[focus=true]:!border-0" :
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
            base: `${isIneLoad ? 'pointer-events-none' : 'data-[hover=true]:!cursor-pointer'}`,
            label: 'font-bold text-lg leading-[24px] text-[#11181C] mt-[25px] px-[24px] cursor-pointer',
            mainWrapper: 'mb-[16px] pointer',
            input: "cursor-pointer file:!hidden text-indent-[-9999px] text-transparent h-full",
            inputWrapper: `cursor-pointer rounded-xl shadow-none h-[78px] ${borderClass(!!ineFile, !!errorIne, progressIne)}`,
            innerWrapper: "!items-center cursor-pointer bg-white-0 rounded-md px-[24px] !border-0 group-data-[focus=true]:border-0",
          }}
          required
          className='w-full'
          endContent={
            ineFile && progressIne === 100 ? (
              <div onClick={() => clearFile(ineInputRef, setIneFile, setErrorIne, setProgressIne)}><DeleteIcon /></div>
            ) : (
              <UploadICon />
            )
          }
          onChange={handleFileChange(setIneFile, setErrorIne, setProgressIne)}
          description={
            ineFile && progressIne < 100 && (
              <div className={descriptionStyle}>
                <div className={barTextStyle}>
                  <Progress
                    size="md"
                    value={progressIne}
                    classNames={{ indicator: "bg-black" }}
                  /><span>{Math.round(progressIne)}%</span>
                </div>
                <div className='mt-2'>
                  <span>Subiendo documento...</span>
                  <span>({getSeconds(progressIne)})s restantes</span>
                </div>
              </div>
            )
          }

        />
        {errorIne && (
          <p className='mt-[12px] text-red-700 text-xs md:text-sm'>{errorIne}</p>
        )}

        {isPreparingFiles && (
          <p className='mt-[12px] text-gray-500 text-xs md:text-sm'>
            Estamos preparando tus archivos para enviarlos. Esto puede tardar unos segundos.
          </p>
        )}


      </Form>
    </>
  )
}

export default Step4
