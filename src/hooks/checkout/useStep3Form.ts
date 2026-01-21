/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useCallback, useEffect, useRef, useState } from "react";

function getFormData(ref: React.RefObject<HTMLFormElement | null>) {
    if (!ref.current) return {};
    const data = new FormData(ref.current);
    return Object.fromEntries(data.entries());
}

function generateTransactionId(): string {
    const uuid = crypto.randomUUID();
    return `P${uuid}`;
}

export const useStep3Form = (radioState: string) => {
    const { registerStepValidator, registerFormData, setIsStepValid, currentStep } = useCheckout();

    const CodigoVerificacionRef = useRef<HTMLFormElement | null>(null);
    const [otpValue, setOtpValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [timer, setTimer] = useState<number>(0); //cuenta regresiva
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [idTransaction] = useState<string>(generateTransactionId);
    const [lastVerifiedCode, setLastVerifiedCode] = useState<string | null>(null);

    // verifica codigo
    const verificarCodigo = useCallback(async (codigo: string) => {
        if (isLoading || lastVerifiedCode === codigo) return;
        setIsLoading(true);
        setIsStepValid(false);

        try {
            const body = JSON.stringify({
                idTransaction,
                codigo,
            });
            const headers = new Headers({
                "Content-Type": "application/json",
                "medio": radioState === "Correo Electrónico" ? "CORREO" : radioState === "WhatsApp" ? "WHATSAPP" : "SMS",
                "oferta": "IZZI",
                "x-origin": "PORTALVL",
            });

            const response = await fetch("/api/contratacion/verificacionContacto/verificaCodigo", {
                method: "POST",
                headers,
                body,
            });

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data?.izziErrorCode === "000") {
                setIsValid(true);
                setIsStepValid(true);
                setLastVerifiedCode(codigo);
            } else {
                setIsValid(false);
                setIsStepValid(false);
            }

            return data;
        } catch (err) {
            setIsValid(false);
            setIsStepValid(false);
            console.error("Error al verificar codigo", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, lastVerifiedCode, setIsStepValid, idTransaction, radioState]);

    // validador de paso
    const validateStep3 = useCallback(async () => {
        const activeForms = [
            CodigoVerificacionRef,
        ].filter(ref => ref?.current) as React.RefObject<HTMLFormElement>[];

        const allValid = activeForms.every(ref => ref.current?.checkValidity());

        return allValid;

    }, []);

    useEffect(() => {
        if (currentStep === 3) {
            registerStepValidator(3, validateStep3);
        }
    }, [registerStepValidator, validateStep3, currentStep]);

    // registar datos del formulario
    useEffect(() => {
        if (!lastVerifiedCode) return;

        registerFormData(3, () => {
            const allData = {
                idTransaction: idTransaction,
                codigoVerificacion: lastVerifiedCode,
            };
            return allData;
        });
    }, [registerFormData, lastVerifiedCode, idTransaction]);

    useEffect(() => {
        if (otpValue.length === 4 && !isLoading) {
            verificarCodigo(otpValue);
        }
    }, [verificarCodigo, otpValue, isValid, isLoading]);

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

    const resetStep3 = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setOtpValue("");
        setIsValid(null);
        setIsLoading(false)
        setTimer(0);
        setIsStepValid(false);
    }

    return {
        CodigoVerificacionRef,
        setLastVerifiedCode,
        handleOtpChange,
        startTimer,
        resetStep3,
        otpValue,
        timer,
        isLoading,
        isValid,
        idTransaction,
        setIsValid,
        setIsStepValid,
        setIsLoading,
        setOtpValue,
        setTimer
    };
};