 import { useCheckout } from "@/components/providers/CheckoutProvider";
import { DateValue } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface CapacityItem {
    cvTimeslot: string,
    requestedShipDate: string //formato "dd/mm/yyy"
}

type Shift = '09:00 - 14:00' | '14:00 - 18:00';

export function useStep5Form() {

    const { registerStepValidator, registerFormData, setIsStepValid, getCapacity, datosContratacion, currentStep } = useCheckout();

    const [selectedShift, setSelectedShift] = useState<Shift>('09:00 - 14:00');
    const [selectedDateIso, setSelectedDateIso] = useState<string | null>(null);
    const [selectedCapacityItem, setSelectedCapacityItem] = useState<CapacityItem | null>(null);

    const CapacityRef = useRef<HTMLFormElement | null>(null);

    //mapear horarios
    const shiftMap: Record<Shift, "matutino" | "vespertino"> = {
        '09:00 - 14:00': 'matutino',
        '14:00 - 18:00': 'vespertino'
    };

    // normalizar datos del provider (convertir fecha y detectar turno)
    const normalizarCapacity = useMemo(() => {
        if (!Array.isArray(getCapacity)) return [];

        return getCapacity.map((item) => {
            if (!item?.requestedShipDate || !item?.cvTimeslot) return null;
            const [day, month, year] = item.requestedShipDate.split('/');

            if (!day || !month || !year) return null;
            const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            const lower = item.cvTimeslot.toLowerCase();
            const shift = lower.includes('vespertino') ? 'vespertino' : 'matutino';
            return { isoDate, original: item, shift };
        }).filter(Boolean) as unknown as {
            isoDate: string;
            original: CapacityItem;
            shift: "matutino" | "vespertino"
        }[];
    }, [getCapacity]);

    //fechas disponibles según turno
    const availableIsos = useMemo(() => {
        const wanted = shiftMap[selectedShift];
        return normalizarCapacity.filter(item => item.shift === wanted)
            .map(item => item.isoDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedShift, normalizarCapacity]);

    //validacion de step5
    const validateStep5 = useCallback(async () => {
        const valid = !!selectedCapacityItem;
        setIsStepValid(valid);
        return Promise.resolve(valid);
    }, [selectedCapacityItem, setIsStepValid]);

    useEffect(() => {
        registerStepValidator(5, validateStep5);
    }, [registerStepValidator, validateStep5]);

    //registro de los datos seleccionados
    useEffect(() => {
        registerFormData(5, () => {
            const allData = selectedCapacityItem ?
                {
                    cvTimeslot: selectedCapacityItem.cvTimeslot,
                    requestedShipDate: selectedCapacityItem.requestedShipDate,
                } :
                null

            return allData;
        });
    }, [registerFormData, selectedCapacityItem]);

    //reset al cambiar de turno, mantener fecha si está disponible en el nuevo turno
    useEffect(() => {
        if (!selectedDateIso) return;
        const wanted = shiftMap[selectedShift];
        const found = normalizarCapacity.find(
            item => item.isoDate === selectedDateIso && item.shift === wanted
        );
        if (found) {
            setSelectedCapacityItem(found.original);
        } else {
            setSelectedDateIso(null);
            setSelectedCapacityItem(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedShift]);

    useEffect(() => {
        validateStep5();
    }, [selectedCapacityItem, validateStep5]);

    useEffect(() => {
        localStorage.removeItem('PersistentPersonalData');
        localStorage.removeItem('PersistentDireccionData');
    }, [])

    //al seleccionar fecha
    const handleDateChange = (date: DateValue) => {
        const iso = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
        const wanted = shiftMap[selectedShift];
        const found = normalizarCapacity.find(item => item.isoDate === iso && item.shift === wanted);

        if (!found) {
            setSelectedDateIso(null);
            setSelectedCapacityItem(null);
            return;
        }

        setSelectedDateIso(iso);
        setSelectedCapacityItem(found.original);
    };

    //bloquear dias no disponibles
    const isDateUnavailable = (date: DateValue) => {
        const iso = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
        return !availableIsos.includes(iso);
    };

    // convertir la ISO seleccionada a DateValue
    const selectedDateValue: DateValue | null = selectedDateIso ?
        (() => {
            const [year, month, day] = selectedDateIso.split("-").map(Number);
            return new CalendarDate(year, month, day);
        })() : null;

    //hidratar datos el regresar al step
    useEffect(() => {
        if (currentStep === 5) {
            const prev = datosContratacion?.Instalacion;
            if (prev?.cvTimeslot && prev?.requestedShipDate && normalizarCapacity.length) {
                const [day, month, year] = prev.requestedShipDate.split("/");
                const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

                const lower = prev.cvTimeslot.toLowerCase();
                const shift = lower.includes("vespertino") ? "14:00 - 18:00" : "09:00 - 14:00";

                const found = normalizarCapacity.find((item) => item.isoDate === iso && item.original.cvTimeslot === prev.cvTimeslot);

                if (found) {
                    setSelectedShift(shift);
                    setSelectedDateIso(iso);
                    setSelectedCapacityItem(found.original);
                    setIsStepValid(true);
                }
            } else {
                setSelectedShift("09:00 - 14:00");
                setSelectedDateIso(null);
                setSelectedCapacityItem(null);
                setIsStepValid(false);
            }
        }
    }, [datosContratacion, normalizarCapacity, setIsStepValid, currentStep])

    return {
        CapacityRef,
        selectedShift,
        setSelectedShift,
        selectedDateIso,
        selectedCapacityItem,
        selectedDateValue,
        availableIsos,
        handleDateChange,
        isDateUnavailable
    };
}