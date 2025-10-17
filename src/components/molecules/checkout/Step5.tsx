import React from 'react';
import { Calendar, Form, Radio, RadioGroup } from '@heroui/react'
import { useStep5Form } from '@/hooks/checkout/useStep5Form';
import { useMicrocopies } from '@/hooks/useMicrocopies';

const RadioStyles = {
  base: "flex items-center p-0 xl:py-0 w-full m-0",
  control: "group-data-[selected=true]:bg-black-0 h-[10px] w-[10px]",
  wrapper: "bg-white-0 group-data-[selected=true]:border-black-0 border-1 h-[24px] w-[24px]",
  label: "text-base xl:text-lg"
}

const Step5 = () => {

  const {
    CapacityRef,
    selectedShift,
    setSelectedShift,
    selectedDateValue,
    handleDateChange,
    isDateUnavailable,
  } = useStep5Form();

  const { getValue } = useMicrocopies('contratacion-instalacion');

  return (
    <Form ref={CapacityRef}>
      <>
        <h5
          className='text-[16px] xl:text-[18px] leading-6 font-bold mb-2'
        >
          {getValue('instalacion.titulo')}
        </h5>
        <p
          className='text-[16px] xl:text-[18px] leading-6 mb-6'
        >
          {getValue('instalacion.subtitulo')}
        </p>

        <div className='flex flex-col gap-[16px] md:flex-row md:gap-[25px] w-full'>
          <Calendar
            calendarWidth='100%'
            weekdayStyle="short"
            onChange={handleDateChange}
            isDateUnavailable={isDateUnavailable}
            value={selectedDateValue}
            classNames={{
              content: 'w-full bg-(--color-gray-50) px-0',
              headerWrapper: 'bg-(--color-gray-50) mb-[24px] pt-6 px-[24px] xl:px-[26px]',
              header: 'capitalize order-1 justify-start',
              prevButton: 'order-2 text-black-0',
              nextButton: 'text-black-0',
              title: 'font-bold leading-6 text-black-0 text-base xl:text-lg',
              gridHeader: 'bg-(--color-gray-50) shadow-none',
              base: 'w-full shadow-none rounded-sm',
              grid: 'w-full',
              gridHeaderRow: 'justify-around px-0 text-black',
              gridHeaderCell: 'font-bold text-xs xl:text-base',
              gridBodyRow: 'justify-around mt-[16px]',
              cell: 'cursor-pointer text-xs xl:text-[14px]',
              cellButton: 'data-[disabled=true]:text-gray-150 data-[selected=true]:bg-black-0 data-[selected=true]:text-white-0 data-[selected=true]:data-[hover=true]:bg-black-0',
              gridWrapper: 'pb-6'
            }}
            aria-label="Seleccionar día"
          />

          <div className='w-auto ml-0 md:ml-auto text-nowrap'>
            <RadioGroup
              orientation='vertical'
              className='flex flex-col gap-6'
              defaultValue={'09:00 - 14:00'}
              value={selectedShift}
              onValueChange={(value) => setSelectedShift(value as "09:00 - 14:00" | "14:00 - 18:00")}
            >
              <Radio
                value="09:00 - 14:00"
                classNames={RadioStyles}
              >
                {getValue('instalacion.horario.matutino')}
              </Radio>
              <Radio
                value="14:00 - 18:00"
                classNames={RadioStyles}
              >
                {getValue('instalacion.horario.vespertino')}
              </Radio>
            </RadioGroup>
          </div>
        </div>
      </>
    </Form>
  )
}

export default Step5
