import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useCallback, useEffect, useRef, useState } from "react";

function validarFormulario(form?: HTMLFormElement | null) {
    if (!form) return false;
    const requeridos = Array.from(
        form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')
    );

    for (const input of requeridos) {
        const isVisible = (input.offsetWidth > 0 && input.offsetHeight > 0) ||
            input.getClientRects().length > 0;
        if (!isVisible) continue;

        if (input instanceof HTMLInputElement && (input.type === 'checkbox' || input.type === 'radio')) {
            if (!input.checked) return false;
        } else {
            const val = input.value ?? '';
            if (val.toString().trim() === '') return false;
        }
    }
    return true;
}

function getFormData(ref: React.RefObject<HTMLFormElement | null>) {
    if (!ref.current) return {};
    const data = new FormData(ref.current);
    return Object.fromEntries(data.entries());
}

export const useStep2Form = () => {
    const { registerStepValidator, registerFormData, setIsStepValid, checkboxChecked, datosContratacion, currentStep } = useCheckout();

    const DatosPersonalesRef = useRef<HTMLFormElement | null>(null);
    const DireccionEnvioRef = useRef<HTMLFormElement | null>(null);
    const DatosFacturacionRef = useRef<HTMLFormElement | null>(null);
    const DireccionFacturacionRef = useRef<HTMLFormElement | null>(null);

    const [facturarOtraDireccion, setFacturarOtraDireccion] = useState(datosContratacion?.DatosPersonales?.meta?.facturarOtraDireccion ?? false);
    const [necesitaFacturar, setNecesitaFacturar] = useState(datosContratacion?.DatosPersonales?.meta?.necesitaFacturar ?? false);
    const [esExtranjero, setEsExtranjero] = useState(datosContratacion?.DatosPersonales?.meta?.esExtranjero ?? false);
    const [mounted, setMounted] = useState(false);

    // Estados para los Selects de HeroUI
    const [cfdi, setCfdi] = useState('');
    const [regimen, setRegimen] = useState('');

    useEffect(() => setMounted(true), []);

    const validateStep2 = useCallback(async () => {
        const activeForms = [
            DatosPersonalesRef,
            DireccionEnvioRef,
            necesitaFacturar ? DatosFacturacionRef : null,
            necesitaFacturar && facturarOtraDireccion ? DireccionFacturacionRef : null,
        ].filter(ref => ref?.current) as React.RefObject<HTMLFormElement>[];

        const allValid = activeForms.every(ref => validarFormulario(ref.current));

        const selectsValid = !necesitaFacturar || (cfdi.trim() !== '' && regimen.trim() !== '');

        return allValid && selectsValid;

    }, [necesitaFacturar, facturarOtraDireccion, cfdi, regimen]);

    useEffect(() => {
        if (currentStep === 2) {
            if (
                DatosPersonalesRef.current ||
                DireccionEnvioRef.current ||
                DatosFacturacionRef.current ||
                DireccionFacturacionRef.current
            ) {
                registerStepValidator(2, validateStep2);

                setTimeout(async () => {
                    const ok = await validateStep2();
                    setIsStepValid(ok);
                }, 100);
            }
        }
    }, [registerStepValidator, validateStep2, currentStep, setIsStepValid]);

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

    useEffect(() => {
        if (currentStep === 2) {
            const checkValidity = () => {
                if (!mounted) return;

                const activeForms = [
                    DatosPersonalesRef,
                    DireccionEnvioRef,
                    necesitaFacturar ? DatosFacturacionRef : null,
                    necesitaFacturar && facturarOtraDireccion ? DireccionFacturacionRef : null,
                ].filter(ref => ref?.current) as React.RefObject<HTMLFormElement>[];

                let allValid = true;

                for (const ref of activeForms) {
                    if (!ref.current) continue;

                    const inputs = Array.from(ref.current.querySelectorAll<HTMLInputElement>('input'));

                    for (const input of inputs) {
                        const isVisible = (input.offsetWidth > 0 && input.offsetHeight > 0) || input.getClientRects().length > 0;
                        if (!isVisible) continue;

                        if (input.getAttribute("aria-invalid") === "true") {
                            allValid = false;
                            break;
                        }

                        if (input.required && input.value.trim() === '') {
                            allValid = false;
                            break;
                        }

                        if (input.pattern && input.value.trim() !== '' && !input.checkValidity()) {
                            allValid = false;
                            break;
                        }
                    }

                    if (!allValid) break;
                }

                // const allValid = activeForms.every(ref => validarFormulario(ref.current));

                // Validar selects
                const selectsValid = !necesitaFacturar || (cfdi.trim() !== '' && regimen.trim() !== '');

                const finalValid = allValid && selectsValid && checkboxChecked;
                setIsStepValid(finalValid);
            };

            const persistFormData = () => {
                const newData = {
                    personal: getFormData(DatosPersonalesRef),
                    instalacion: getFormData(DireccionEnvioRef),
                    facturacion: necesitaFacturar ? getFormData(DatosFacturacionRef) : null,
                    direccionFacturacion: necesitaFacturar && facturarOtraDireccion ? getFormData(DireccionFacturacionRef) : null,
                    meta: { esExtranjero, necesitaFacturar, facturarOtraDireccion, cfdi, regimen }
                };
                registerFormData(2, () => newData);
            };

            const forms = [
                DatosPersonalesRef.current,
                DireccionEnvioRef.current,
                necesitaFacturar ? DatosFacturacionRef.current : null,
                necesitaFacturar && facturarOtraDireccion ? DireccionFacturacionRef.current : null,
            ].filter(Boolean) as HTMLFormElement[];

            forms.forEach(form => {
                form.addEventListener("input", checkValidity);
                form.addEventListener("change", checkValidity);
                form.addEventListener("input", persistFormData);
                form.addEventListener("change", persistFormData);
            });

            // Validación inicial
            setTimeout(checkValidity, 100);

            return () => {
                forms.forEach(form => {
                    form.removeEventListener("input", checkValidity);
                    form.removeEventListener("change", checkValidity);
                    form.addEventListener("input", persistFormData);
                    form.addEventListener("change", persistFormData);
                });
            };
        }
    }, [necesitaFacturar, facturarOtraDireccion, cfdi, regimen, setIsStepValid, checkboxChecked, mounted, currentStep, esExtranjero, registerFormData]);

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
        setRegimen
    };
};



