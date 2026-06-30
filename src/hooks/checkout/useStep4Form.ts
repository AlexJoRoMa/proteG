import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useCallback, useEffect, useRef, useState } from "react";

async function processFileToBase64(file: File): Promise<string> {
    // eslint-disable-next-line prefer-const
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

function getFileExtension(file: File): "pdf" | "png" | "jpg" {
    if (file.type === "application/pdf") return "pdf";
    if (file.type === "image/png") return "png";
    return "jpg";
}

type Step4FormData = {
    documentos: {
        ine: {
            file: File | null
        }
    },
    ine: {
        fileName: string,
        fileExtension: string,
        data: string,
    } | null
}

export const useStep4Form = (progressIne: number) => {
    const { registerStepValidator, registerFormData, setIsStepValid, datosContratacion, currentStep } = useCheckout();

    const DocumentosTitularRef = useRef<HTMLFormElement | null>(null);
    const [ineFile, setIneFile] = useState<File | null>(datosContratacion.DocumentosTitular?.documentos.ine.file ?? null);
    const [preparedPayload, setPreparedPayload] = useState<Step4FormData | null>(datosContratacion.DocumentosTitular ?? null);
    const [isPreparingFiles, setIsPreparingFiles] = useState(false);
    const latestPreparationId = useRef(0);

    // validar archivos cargados existen
    const validateStep4 = useCallback(async () => {
        const valid =
            progressIne === 100 &&
            !!ineFile &&
            !!preparedPayload?.ine?.data &&
            !isPreparingFiles &&
            (ineFile.size <= 4 * 1024 * 1024)

        setIsStepValid(valid);
        return Promise.resolve(valid);
    }, [ineFile, isPreparingFiles, preparedPayload, setIsStepValid, progressIne]);

    // registro de validador
    useEffect(() => {
        if (currentStep === 4) {
            registerStepValidator(4, validateStep4);
        }
    }, [registerStepValidator, validateStep4, currentStep]);

    useEffect(() => {
        registerFormData(4, () => preparedPayload ?? {
            documentos: {
                ine: {
                    file: ineFile
                }
            },
            ine: null,
        });
    }, [registerFormData, preparedPayload, ineFile]);

    // Preparar payload final antes de permitir continuar.
    useEffect(() => {
        const preparationId = latestPreparationId.current + 1;
        latestPreparationId.current = preparationId;

        if (!ineFile) {
            setPreparedPayload(null);
            setIsPreparingFiles(false);
            return;
        }

        setPreparedPayload(null);
        setIsPreparingFiles(true);
        setIsStepValid(false);

        const prepareFiles = async () => {
            try {
                const [ineBase64] = await Promise.all([
                    processFileToBase64(ineFile),
                ]);

                if (latestPreparationId.current !== preparationId) {
                    return;
                }

                setPreparedPayload({
                    documentos: {
                        ine: {
                            file: ineFile
                        }
                    },
                    ine: {
                        fileName: "INEIFE",
                        fileExtension: getFileExtension(ineFile),
                        data: ineBase64,
                    }
                });
            } catch (err) {
                if (latestPreparationId.current !== preparationId) {
                    return;
                }
                console.error("Error procesando archivos:", err);
                setPreparedPayload(null);
                setIsStepValid(false);
            } finally {
                if (latestPreparationId.current === preparationId) {
                    setIsPreparingFiles(false);
                }
            }
        };

        prepareFiles();
    }, [ineFile, setIsStepValid]);

    useEffect(() => {
        if (currentStep === 4) {
            validateStep4();
        }
    }, [ineFile, isPreparingFiles, preparedPayload, validateStep4, currentStep])

    const invalidateStep = useCallback(() => {
        setIsStepValid(false);
    }, [setIsStepValid]);

    return {
        DocumentosTitularRef,
        ineFile,
        isPreparingFiles,
        setIneFile,
        invalidateStep
    };
};
