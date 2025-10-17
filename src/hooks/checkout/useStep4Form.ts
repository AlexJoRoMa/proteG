import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useCallback, useEffect, useRef, useState } from "react";

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export const useStep4Form = () => {
    const { registerStepValidator, registerFormData, setIsStepValid } = useCheckout();

    const DocumentosTitularRef = useRef<HTMLFormElement | null>(null);
    const [ineFile, setIneFile] = useState<File | null>(null);
    const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);

    // validar archivos cargados existen
    const validateStep4 = useCallback(async () => {
        const valid =
            !!ineFile &&
            !!comprobanteFile &&
            ineFile.size <= 4 * 1024 * 1024 &&
            comprobanteFile.size <= 4 * 1024 * 1024;
        setIsStepValid(valid);
        return valid;
    }, [ineFile, comprobanteFile, setIsStepValid]);

    // registro de validador
    useEffect(() => {
        registerStepValidator(4, validateStep4);
    }, [registerStepValidator, validateStep4]);

    // registro de datos (base64)
    useEffect(() => {
        const setFormData = async () => {
            console.log('ineFile', ineFile)
            console.log('comprobante', comprobanteFile)
            const ineBase64 = ineFile ? await fileToBase64(ineFile) : null;
            const comprobanteBase64 = comprobanteFile ? await fileToBase64(comprobanteFile) : null;

            registerFormData(4, () => {

                return {
                    ine: {
                        fileName: ineFile?.name,
                        fileExtension: ineFile?.type === 'application/pdf' ? 'pdf' : 'jpg',
                        data: ineBase64,
                    },
                    comprobante: {
                        fileName: comprobanteFile?.name,
                        fileExtension: comprobanteFile?.type === 'application/pdf' ? 'pdf' : 'jpg',
                        data: comprobanteBase64,
                    },
                };
            });
        }

        if (ineFile || comprobanteFile) {
            setFormData();
        }

    }, [registerFormData, ineFile, comprobanteFile]);

    useEffect(() => {
        validateStep4();
    }, [ineFile, comprobanteFile, validateStep4])

    return {
        DocumentosTitularRef,
        ineFile,
        comprobanteFile,
        setIneFile,
        setComprobanteFile
    };
};