import { DatosContratacion, PaymentReference, ProcessStatus } from "@/types/Contratacion";

const VERIFICA_PAGO_TIMEOUT_MS = 20000;
const VERIFICA_PAGO_MAX_RETRIES_ON_001 = 2;
const VERIFICA_PAGO_RETRY_DELAY_MS = 5000;

type ValidateResult = { ok: boolean; isPayPal: boolean };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function validatePayment(
    datosContratacion: Partial<DatosContratacion>,
    setDatosContratacion: React.Dispatch<React.SetStateAction<Partial<DatosContratacion>>>,
    processStatus: Partial<ProcessStatus>,
    paymentReference: Partial<PaymentReference> | undefined
) {

    const account = processStatus.accountNumber;

    try {

        if (datosContratacion.Pago?.metodoPago === 'tecnico') {
            setDatosContratacion((prev) => ({
                ...prev,
                Pago: {
                    metodoPago: "tecnico",
                    success: true,
                }
            }));
            return true;
        };

        const validateAPI = async (isPayPal: boolean): Promise<ValidateResult> => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), VERIFICA_PAGO_TIMEOUT_MS);

            try {
                const origin = process.env.ACCESS_ORIGIN;
                const channel = process.env.ACCESS_CHANNEL;

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const headers = new Headers({
                    "Content-Type": "application/json",
                    "x-access-origin": `${origin}`,
                    "x-access-channel": `${channel}`,
                });

                const body = JSON.stringify({
                    "referencia": isPayPal ? `${paymentReference?.paypalReference}` : `${paymentReference?.cardReference}`,
                    "cuenta": account,
                    "paypal": isPayPal,
                });

                let attempt = 0;
                while (attempt <= VERIFICA_PAGO_MAX_RETRIES_ON_001) {
                    const response = await fetch("/api/contratacion/verificaPago", {
                        method: "POST",
                        body,
                        signal: controller.signal,
                    });

                    const data = await response.json();

                    if (!data) {
                        console.warn(`verificaPago(paypal=${isPayPal}) respuesta vacía`);
                        return { ok: false, isPayPal };
                    }

                    if (data.izziErrorCode === "000") {
                        return { ok: true, isPayPal };
                    }

                    // 001 = pago aún no reflejado, reintentar tras 5s
                    if (data.izziErrorCode === "001" && attempt < VERIFICA_PAGO_MAX_RETRIES_ON_001) {
                        console.warn(`verificaPago(paypal=${isPayPal}) izziErrorCode=001, retry ${attempt + 1}/${VERIFICA_PAGO_MAX_RETRIES_ON_001}`);
                        attempt += 1;
                        await sleep(VERIFICA_PAGO_RETRY_DELAY_MS);
                        continue;
                    }

                    console.warn(`verificaPago(paypal=${isPayPal}) izziErrorCode=${data.izziErrorCode}`);
                    return { ok: false, isPayPal };
                }

                return { ok: false, isPayPal };

            } catch (err) {
                const isAbort = (err as { name?: string })?.name === "AbortError";
                console.warn(`verificaPago(paypal=${isPayPal}) ${isAbort ? "timeout" : "error"}`, err);
                return { ok: false, isPayPal };
            } finally {
                clearTimeout(timeoutId);
            }
        };

        const settled = await Promise.allSettled([
            validateAPI(false),
            validateAPI(true),
        ]);

        const results = settled
            .filter((r): r is PromiseFulfilledResult<ValidateResult> => r.status === "fulfilled")
            .map((r) => r.value);

        const successful = results.find((r) => r.ok);

        if (successful) {
            setDatosContratacion((prev) => ({
                ...prev,
                Pago: {
                    metodoPago: successful.isPayPal ? "paypal" : "creditCard",
                    success: true,
                }
            }));
            return true;
        }

        setDatosContratacion((prev) => ({
            ...prev,
            Pago: {
                ...prev.Pago,
                success: false,
            }
        }));
        return false;

    } catch (err) {
        console.error("Error validando pago:", err);
        return false;
    }
}
