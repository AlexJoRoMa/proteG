import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useCallback, useEffect, useRef, useState } from "react";

function getFormData(ref: React.RefObject<HTMLFormElement | null>) {
    if (!ref.current) return {};
    const data = new FormData(ref.current);
    return Object.fromEntries(data.entries());
}

export const useStep2Form = () => {
    const { registerStepValidator, registerFormData, setIsStepValid, conditionCheckboxChecked, datosContratacion, currentStep, privacyCheckboxChecked } = useCheckout();

    const DatosPersonalesRef = useRef<HTMLFormElement | null>(null);
    const DireccionEnvioRef = useRef<HTMLFormElement | null>(null);
    const DatosFacturacionRef = useRef<HTMLFormElement | null>(null);
    const DireccionFacturacionRef = useRef<HTMLFormElement | null>(null);

    const [facturarOtraDireccion, setFacturarOtraDireccion] = useState(datosContratacion?.DatosPersonales?.meta?.facturarOtraDireccion ?? false);
    const [necesitaFacturar, setNecesitaFacturar] = useState(datosContratacion?.DatosPersonales?.meta?.necesitaFacturar ?? false);
    const [esExtranjero, setEsExtranjero] = useState(datosContratacion?.DatosPersonales?.meta?.esExtranjero ?? false);

    //Estado para normalizacion del origen de la informacion
    const [rfc, setRfc] = useState(datosContratacion.DatosPersonales?.facturacion?.rfc ?? '')
    // Estados para los Selects de HeroUI
    const [cfdi, setCfdi] = useState(datosContratacion?.DatosPersonales?.meta?.cfdi ?? '');
    const [regimen, setRegimen] = useState(datosContratacion?.DatosPersonales?.meta?.regimen ?? '');

    // Estados de validación para cada formulario usando HeroUI
    const [isPersonalValid, setIsPersonalValid] = useState(false);
    const [isEnvioValid, setIsEnvioValid] = useState(false);
    const [isFacturacionValid, setIsFacturacionValid] = useState(false);
    const [isDireccionFacturacionValid, setIsDireccionFacturacionValid] = useState(false);

    // Función para validar el paso 2 basado en estados
    const validateStep2 = useCallback(async () => {
        const personalOk = isPersonalValid;
        const envioOk = isEnvioValid;
        const facturacionOk = !necesitaFacturar || (isFacturacionValid && cfdi.trim() !== '' && regimen.trim() !== '');
        const direccionFacturacionOk = !necesitaFacturar || !facturarOtraDireccion || isDireccionFacturacionValid;

        return personalOk && envioOk && facturacionOk && direccionFacturacionOk && conditionCheckboxChecked && privacyCheckboxChecked;
    }, [isPersonalValid, isEnvioValid, isFacturacionValid, isDireccionFacturacionValid, necesitaFacturar, facturarOtraDireccion, cfdi, regimen, conditionCheckboxChecked, privacyCheckboxChecked]);

    // Registrar el validador del paso 2
    useEffect(() => {
        if (currentStep === 2) {
            registerStepValidator(2, validateStep2);
        }
    }, [registerStepValidator, validateStep2, currentStep]);

    // Actualizar la validez del paso cuando cambien los estados de validación
    useEffect(() => {
        if (currentStep === 2) {
            validateStep2().then(isValid => setIsStepValid(isValid));
        }
    }, [currentStep, validateStep2, setIsStepValid, isPersonalValid, isEnvioValid, isFacturacionValid, isDireccionFacturacionValid, cfdi, regimen, conditionCheckboxChecked, privacyCheckboxChecked]);

    // Registrar la función para obtener los datos del formulario
    useEffect(() => {
        registerFormData(2, () => {
            const allData = {
                personal: getFormData(DatosPersonalesRef),
                instalacion: getFormData(DireccionEnvioRef),
                facturacion: necesitaFacturar ? getFormData(DatosFacturacionRef) : null,
                direccionFacturacion: necesitaFacturar && facturarOtraDireccion ? getFormData(DireccionFacturacionRef) : null,
                meta: { esExtranjero, necesitaFacturar, facturarOtraDireccion, cfdi, regimen }
            };

            return {
                personal: Object.keys(allData.personal).length ? allData.personal : datosContratacion.DatosPersonales?.personal ?? {},
                instalacion: Object.keys(allData.instalacion).length ? allData.instalacion : datosContratacion.DatosPersonales?.instalacion ?? {},
                facturacion: allData.facturacion ?? datosContratacion.DatosPersonales?.facturacion ?? null,
                direccionFacturacion: allData.direccionFacturacion ?? datosContratacion.DatosPersonales?.direccionFacturacion ?? null,
                meta: allData.meta,
            };
        });
    }, [esExtranjero, necesitaFacturar, facturarOtraDireccion, cfdi, regimen, registerFormData, datosContratacion?.DatosPersonales?.personal, datosContratacion?.DatosPersonales?.instalacion, datosContratacion?.DatosPersonales?.facturacion, datosContratacion?.DatosPersonales?.direccionFacturacion]);

    return {
        DatosPersonalesRef,
        DireccionEnvioRef,
        DatosFacturacionRef,
        DireccionFacturacionRef,
        esExtranjero,
        setEsExtranjero,
        necesitaFacturar,
        setNecesitaFacturar,
        facturarOtraDireccion,
        setFacturarOtraDireccion,
        cfdi,
        setCfdi,
        regimen,
        setRegimen,
        rfc,
        setRfc,
        isDireccionFacturacionValid,
        // Estados de validación
        setIsPersonalValid,
        setIsEnvioValid,
        setIsFacturacionValid,
        setIsDireccionFacturacionValid
    };
};



