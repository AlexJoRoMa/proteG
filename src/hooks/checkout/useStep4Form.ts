import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useCallback, useEffect, useRef, useState } from "react";

async function processFileToBase64(file: File): Promise<string> {
    let processedFile = file;

    if (processedFile.size > 4 * 1024 * 1024) {
        throw new Error("El archivo no puede superar los 4 MB.");
    }

    const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const cleanBase64 = result.split(",")[1];
            resolve(cleanBase64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(processedFile);
    });

    const estimatedBytes = base64.length * (3 / 4);
    if (estimatedBytes > 4 * 1024 * 1024) {
        throw new Error("El archivo convertido supera los 4 MB permitidos.");
    }

    return base64;
}

export const useStep4Form = () => {
    const { registerStepValidator, registerFormData, setIsStepValid, datosContratacion, currentStep } = useCheckout();

    const DocumentosTitularRef = useRef<HTMLFormElement | null>(null);
    const [ineFile, setIneFile] = useState<File | null>(datosContratacion.DocumentosTitular?.documentos.ine.file ?? null);
    const [comprobanteFile, setComprobanteFile] = useState<File | null>(datosContratacion.DocumentosTitular?.documentos.comprobante.file ?? null);

    // validar archivos cargados existen
    const validateStep4 = useCallback(async () => {
        const valid =
            !!ineFile &&
            !!comprobanteFile &&
            (ineFile.size <= 4 * 1024 * 1024) &&
            (comprobanteFile.size <= 4 * 1024 * 1024);

        setIsStepValid(valid);
        return Promise.resolve(valid);
    }, [ineFile, comprobanteFile, setIsStepValid]);

    // registro de validador
    useEffect(() => {
        registerStepValidator(4, validateStep4);
    }, [registerStepValidator, validateStep4]);

    // registro de datos (base64)
    useEffect(() => {
        const setFormData = async () => {

            try {
                const ineBase64 = ineFile ? await processFileToBase64(ineFile) : null;
                const comprobanteBase64 = comprobanteFile ? await processFileToBase64(comprobanteFile) : null;

                registerFormData(4, () => {

                    return {
                        documentos: {
                            ine: {
                                file: ineFile
                            },
                            comprobante: {
                                file: comprobanteFile
                            },
                        },
                        ine: ineFile ?
                            {
                                fileName: "INEIFE",
                                fileExtension: ineFile?.type === 'application/pdf' ? 'pdf' : 'jpg',
                                data: ineBase64,
                            } : null,
                        comprobante: comprobanteFile ?
                            {
                                fileName: "COMDOMICILIO",
                                fileExtension: comprobanteFile?.type === 'application/pdf' ? 'pdf' : 'jpg',
                                data: comprobanteBase64,
                            } : null,
                    };
                });

            } catch (err) {
                console.error("Error procesando archivos:", err);
                setIsStepValid(false);
            }
        };

        if (ineFile || comprobanteFile) {
            setFormData();
        }

    }, [registerFormData, ineFile, comprobanteFile, setIsStepValid]);

    useEffect(() => {
        validateStep4();
    }, [ineFile, comprobanteFile, validateStep4])

    const invalidateStep = useCallback(() => {
        setIsStepValid(false);
    }, [setIsStepValid]);

    return {
        DocumentosTitularRef,
        ineFile,
        comprobanteFile,
        setIneFile,
        setComprobanteFile,
        invalidateStep
    };
};