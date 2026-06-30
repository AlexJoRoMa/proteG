'use client'

import { Form, Input } from "@heroui/react";
import { FC, RefObject, useEffect, useState } from "react";
import { inputStyles } from "@/constants/StylesConstants";
import { InputFilter } from "@/utils/inputFilters";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { useCheckout } from "@/components/providers/CheckoutProvider";
import { DatosContratacion } from "@/types/Contratacion";

interface Props {
    formRef: RefObject<HTMLFormElement | null>
    isValid: boolean;
    // updateIsForeign: (value: boolean) => void;
    setIsValid: (valid: boolean) => void
    submitAttempted: boolean
}
// type PersonalData = {
//     firstName: string;
//     secondName: string;
//     firstLastName: string;
//     secondLastName: string;
//     phone: string;
//     aditionalTel: string;
//     email: string;
//     curp?: string;
//     passportNumber?: string;
//     isForeign: boolean;
// }

export const DatosPersonalesForm: FC<Props> = ({ formRef, isValid, setIsValid, submitAttempted, /*updateIsForeign*/ }) => {
    const { datosContratacion } = useCheckout();
    const { getValue } = useMicrocopies('formulario-datosPersonales');

    const personal: Partial<DatosContratacion> = datosContratacion ?? {};
    const datosPersonales = personal.DatosPersonales?.personal;

    // const getLocalPropertyByKey = (propertyName: string) => JSON.parse(localStorage.getItem(propertyName) as string) ?? null;

    // Estados para validación individual de campos
    const getLocalPersonalData = () => {
        if (typeof window === 'undefined') return null
        return JSON.parse(localStorage.getItem('PersistentPersonalData') ?? 'null')
    }
    // const [curp, setCurp] = useState(() => {
    //     const local = getLocalPersonalData()
    //     return local?.curp ?? datosPersonales?.curp ?? ""
    // })
    // const [passport, setPassport] = useState(() => {
    //     const local = getLocalPersonalData()
    //     return local?.passport ?? datosPersonales?.passport ?? ""
    // })
    const [firstName, setFirstName] = useState(() => {
        const local = getLocalPersonalData()
        return local?.firstName ?? datosPersonales?.firstName ?? ""
    })
    const [secondName, setSecondName] = useState(() => {
        const local = getLocalPersonalData()
        return local?.secondName ?? datosPersonales?.secondName ?? ""
    })
    const [firstLastName, setFirstLastName] = useState(() => {
        const local = getLocalPersonalData()
        return local?.firstLastName ?? datosPersonales?.firstLastName ?? ""
    })
    const [secondLastName, setSecondLastName] = useState(() => {
        const local = getLocalPersonalData()
        return local?.secondLastName ?? datosPersonales?.secondLastName ?? ""
    })
    const [phone, setPhone] = useState(() => {
        const local = getLocalPersonalData()
        return local?.phone ?? datosPersonales?.phone ?? ""
    })
    // const [aditionalTel, setAditionalTel] = useState(() => {
    //     const local = getLocalPersonalData()
    //     return local?.aditionalTel ?? datosPersonales?.aditionalTel ?? ""
    // })
    const [email, setEmail] = useState(() => {
        const local = getLocalPersonalData()
        return local?.email ?? datosPersonales?.email ?? ""
    })

    // Estados para controlar si los campos han sido tocados
    const [firstNameTouched, setFirstNameTouched] = useState(false);
    const [firstLastNameTouched, setFirstLastNameTouched] = useState(false);
    const [secondLastNameTouched, setSecondLastNameTouched] = useState(false);
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [isFirstLoad, setFirstLoad] = useState(true);

    const writePersonalInfoToLocal = () => {
        const persistentPersonalData = {
            "firstName": firstName ?? "",
            "secondName": secondName ?? "",
            "firstLastName": firstLastName ?? "",
            "secondLastName": secondLastName ?? "",
            "phone": phone ?? "",
            // "aditionalTel": aditionalTel ?? "",
            "email": email ?? "",
            // "curp": curp ?? "",
            // "isForeign": esExtrangero,
            // "passportNumber": esExtrangero ? passport : ""
        }
        localStorage.setItem('PersistentPersonalData', JSON.stringify(persistentPersonalData))
    }

    // const updateDataStateOnLoad = (personalDataFromLocal: PersonalData) => {
    //     updateIsForeign(personalDataFromLocal.isForeign)

    //     setPassport(personalDataFromLocal.passportNumber ?? "")
    //     setCurp(personalDataFromLocal.curp ?? "")

    // }

    useEffect(() => {
        // const personalDataFromLocal = getLocalPropertyByKey('PersistentPersonalData')
        // if (personalDataFromLocal != null) {

        //     updateDataStateOnLoad(personalDataFromLocal)
        // }
        setFirstLoad(false)
    }, [])

    // Validar el formulario completo cuando cambien los valores
    useEffect(() => {
        const isFormValid =
            firstName.trim() !== '' &&
            firstLastName.trim() !== '' &&
            secondLastName.trim() !== '' &&
            phone.trim() !== '' && phone.length === 10 &&
            email.trim() !== '' && email.includes('@')

        setIsValid(isFormValid);

        if (isFormValid && isFirstLoad == false) {
            writePersonalInfoToLocal()
        }

    }, [firstName, firstLastName, secondLastName, phone, email, setIsValid, isFirstLoad]);


    useEffect(() => {
        const areAdditionalValid =
            secondName.trim() !== '' 
            // aditionalTel.trim() !== '' && aditionalTel.length === 10

        if (areAdditionalValid && isValid) {
            writePersonalInfoToLocal()
        }
    }, [secondName, /*aditionalTel*/])

    return (
        <Form
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
        >
            {/* Nombre */}
            <div className='order-1'>
                <Input
                    label={getValue('datosPersonales.label.nombre')}
                    name="firstName"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder={getValue('datosPersonales.placeholder.nombre')}
                    errorMessage={getValue('datosPersonales.error.nombre')}
                    onInput={(e) => InputFilter(e, 'letras')}
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value);
                        setFirstNameTouched(true);
                    }}
                    onBlur={() => setFirstNameTouched(true)}
                    isInvalid={(firstNameTouched || submitAttempted) && firstName.trim() === ''}
                />
            </div>

            {/* Segundo nombre */}
            <div className='order-2'>
                <Input
                    label={getValue('datosPersonales.label.segundoNombre')}
                    name="secondName"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    className='w-full'
                    placeholder={getValue('datosPersonales.placeholder.segundoNombre')}
                    onInput={(e) => InputFilter(e, 'letras')}
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                />
            </div>

            {/* Apellido paterno */}
            <div className='order-3'>
                <Input
                    label={getValue('datosPersonales.label.apellidoPaterno')}
                    name="firstLastName"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder={getValue('datosPersonales.placeholder.apellidoPaterno')}
                    errorMessage={getValue('datosPersonales.error.apellido')}
                    onInput={(e) => InputFilter(e, 'letras')}
                    value={firstLastName}
                    onChange={(e) => {
                        setFirstLastName(e.target.value);
                        setFirstLastNameTouched(true);
                    }}
                    onBlur={() => setFirstLastNameTouched(true)}
                    isInvalid={(firstLastNameTouched || submitAttempted) && firstLastName.trim() === ''}
                />
            </div>

            {/* Apellido materno */}
            <div className='order-4'>
                <Input
                    label={getValue('datosPersonales.label.apellidoMaterno')}
                    name="secondLastName"
                    type="text"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder={getValue('datosPersonales.placeholder.apellidoMaterno')}
                    errorMessage={getValue('datosPersonales.error.apellido')}
                    onInput={(e) => InputFilter(e, 'letras')}
                    value={secondLastName}
                    onChange={(e) => {
                        setSecondLastName(e.target.value);
                        setSecondLastNameTouched(true);
                    }}
                    onBlur={() => setSecondLastNameTouched(true)}
                    isInvalid={(secondLastNameTouched || submitAttempted) && secondLastName.trim() === ''}
                />
            </div>

            {/* Teléfono */}
            <div className='order-5'>
                <Input
                    label={getValue('datosPersonales.label.telefono')}
                    name="phone"
                    type="tel"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    maxLength={10}
                    placeholder={getValue('datosPersonales.placeholder.telefono')}
                    errorMessage={getValue('datosPersonales.error.telefono')}
                    onInput={(e) => InputFilter(e, 'numeros')}
                    value={phone}
                    onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneTouched(true);
                    }}
                    onBlur={() => setPhoneTouched(true)}
                    isInvalid={(phoneTouched || submitAttempted) && (phone.trim() === '' || phone.length < 10)}
                />
            </div>

            {/* Correo */}
            <div className='order-6'>
                <Input
                    label={getValue('datosPersonales.label.correo')}
                    name="email"
                    type="email"
                    variant='bordered'
                    radius='sm'
                    classNames={inputStyles}
                    labelPlacement="outside"
                    isRequired
                    className='w-full'
                    placeholder={getValue('datosPersonales.placeholder.correo')}
                    errorMessage={getValue('datosPersonales.error.correo')}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailTouched(true);
                    }}
                    onBlur={() => setEmailTouched(true)}
                    isInvalid={(emailTouched || submitAttempted) && (email.trim() === '' || !email.includes('@'))}
                />
            </div>
        </Form>
    )
}