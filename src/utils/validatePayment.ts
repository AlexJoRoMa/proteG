/**
 * valida los metodos de pago (tarjeta / paypal) en paralelo.
 * si ambas fallan, se asume "pago al tecnico".
 * retorna el método exitoso o el fallback
 */

interface ValidatePaymentResult {
    metodoPago: "tarjeta" | "paypal" | "tecnico";
    success: boolean;
}

export async function validatePayment(): Promise<ValidatePaymentResult> {
    try {

        const validateAPI = async (isPayPal: boolean) => {
            try {
                // llamado a api

            } catch {
                return false;
            }
        }

        const [okCard, okPayPal] = await Promise.all([
            validateAPI(false),
            validateAPI(true),
        ]);

        if (okPayPal) {
            return { metodoPago: "paypal", success: true };
        }
        if (okCard) {
            return { metodoPago: "tarjeta", success: true };
        }
        return {
            metodoPago: "tecnico",
            success: true,
        };
    } catch (err) {
        console.error("Error validando pago:", err);
        return {
            metodoPago: "tecnico",
            success: true,
        };
    }
}