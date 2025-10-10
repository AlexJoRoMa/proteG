import { useCheckout } from "@/components/providers/CheckoutProvider";
import { isValidElement, useCallback, useEffect, useRef, useState } from "react";

function getFormData(ref: React.RefObject<HTMLFormElement | null>) {
    if (!ref.current) return {};
    const data = new FormData(ref.current);
    return Object.fromEntries(data.entries());
}

export const useStep3Form = () => {
    const { registerStepValidator, registerFormData, setIsStepValid } = useCheckout();

    const CodigoVerificacionRef = useRef<HTMLFormElement | null>(null);
    const [otpValue, setOtpValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [timer, setTimer] = useState<number>(0); //cuenta regresiva
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // verifica codigo
    const verificarCodigo = useCallback(async (codigo: string) => {
        setIsLoading(true);
        setIsValid(null);

        try {
            // llamada a api
            //TODO: conexion a api VerificaCodigo
            
            // const response = await fetch("/api/contratacion/verificacionContacto/verificaCodigo", {
            //     method: "POST",
            // });

            // const data = await response.json();

            // if (res.ok) {
            //     setIsValid(true);
            //     setIsStepValid(true);
            // } else {
            //     setIsValid(false);
            //     setIsStepValid(false);
            // }

            setIsValid(true);
            setIsStepValid(true);
        } catch (err) {
            setIsValid(false);
            setIsStepValid(false);
        } finally {
            setIsLoading(false);
        }
    }, [setIsStepValid]);

    // validador de paso
    const validateStep3 = useCallback(async () => {
        const activeForms = [
            CodigoVerificacionRef,
        ].filter(ref => ref?.current) as React.RefObject<HTMLFormElement>[];

        const allValid = activeForms.every(ref => ref.current?.checkValidity());

        return allValid;

    }, []);

    useEffect(() => {
        registerStepValidator(3, validateStep3);
    }, [registerStepValidator, validateStep3]);

    // registar datos del formulario
    useEffect(() => {
        registerFormData(3, () => {
            const allData = {
                codigoVerificacion: otpValue || getFormData(CodigoVerificacionRef),
            };

            return allData;
        });
    }, [registerFormData, otpValue]);

    useEffect(() => {
        if (otpValue.length === 4 && isValid !== true) {
            verificarCodigo(otpValue);
        }
    }, [verificarCodigo, otpValue, isValid]);

    //Handler para comunicar cambios del OTP
    const handleOtpChange = useCallback((value: string) => {
        setOtpValue(prev => (isValid === true ? prev : value));
    }, [isValid]);

    //temporizador (60 segundos)
    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimer(60);

        timerRef.current = setInterval(() => {
            setTimer((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => {
        if (isValid === true && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [isValid]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const resetStep3 = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setOtpValue("");
        setIsValid(null);
        setIsLoading(false)
        setTimer(0);
        setIsStepValid(false);
    }, [setIsStepValid])

    return {
        CodigoVerificacionRef,
        handleOtpChange,
        startTimer,
        resetStep3,
        otpValue,
        timer,
        isLoading,
        isValid,
    };
};