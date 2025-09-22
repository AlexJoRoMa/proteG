import { Calendar, Radio, RadioGroup } from '@heroui/react'
import React from 'react'

const Step4 = () => {
  return (
    <div>
      <h5 className='text-[18px] leading-6 font-bold mb-2'>Es necesario hacer una cita para la instalación</h5>
      <p className='text-[18px] leading-6 mb-6'>Selecciona el día y el horario para la visita de nuestro técnico</p>
      <div className='flex flex-col md:flex-row'>
        <Calendar className='w-9/12 ' calendarWidth='100%' weekdayStyle="short"  classNames={{content: 'w-full bg-(--color-gray-50) px-4', headerWrapper: 'bg-(--color-gray-50) mb-[24px] pt-6', header: 'capitalize order-1 justify-start ml-[30px]', prevButton: 'order-2', title:'font-bold text-[18px] leading-6 text-black', gridHeader: 'bg-(--color-gray-50) shadow-none', base: 'w-full shadow-none', grid: 'w-full', gridHeaderRow: 'justify-around px-0 text-black', gridHeaderCell: 'font-bold', gridBodyRow: 'justify-around', cell: 'cursor-pointer', gridWrapper: 'pb-6'}} aria-label="Date (No Selection)" />
        <div className='w-auto ml-auto'>
          <RadioGroup orientation='vertical' className='flex flex-col gap-6' defaultValue={'09:00 - 14:00'}>
            <Radio value="09:00 - 14:00">De 9am a 2pm</Radio>
            <Radio value="14:00 - 18:00">De 2pm a 6pm</Radio>
          </RadioGroup>
        </div>
      </div>

    </div>
  )
}

export default Step4
