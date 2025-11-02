import { DatosContratacion, PaymentReference, ProcessStatus } from "@/types/Contratacion";

export async function validatePayment(datosContratacion: Partial<DatosContratacion>, setDatosContratacion: React.Dispatch<React.SetStateAction<Partial<DatosContratacion>>>, processStatus: Partial<ProcessStatus>, paymentReference: Partial<PaymentReference> | undefined) {
    
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
            console.log("pago Tecnico", datosContratacion.Pago)
            return true;
        };

        const validateAPI = async (isPayPal: boolean) => {
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


                const response = await fetch("/api/contratacion/verificaPago", {
                    method: "POST",
                    body,
                });

                const data = await response.json();
                console.log('response getVerificaPago:', data)

                if (!data) throw new Error("Invalid response from server");
                if (data.izziErrorCode !== "000") throw new Error("No se ha reflejado el Pago");

                return true;

            } catch {
                return false;
            }
        }

        const [okCard, okPayPal] = await Promise.all([
            validateAPI(false),
            validateAPI(true),
        ]);

        if (okPayPal) {
            setDatosContratacion((prev) => ({
                ...prev,
                Pago: {
                    metodoPago: "paypal",
                    success: true,
                }
            }));
            console.log("pago paypal", datosContratacion.Pago)
            return true;
        } else if (okCard) {
            setDatosContratacion((prev) => ({
                ...prev,
                Pago: {
                    metodoPago: "creditCard",
                    success: true,
                }
            }));
            console.log("pago Tarjeta", datosContratacion.Pago)
            return true;
        } else {
            setDatosContratacion((prev) => ({
                ...prev,
                Pago: {
                    ...prev.Pago,
                    success: false,
                }
            }));
            return false;
        }
    } catch (err) {
        console.error("Error validando pago:", err);
        return false;
    }
}