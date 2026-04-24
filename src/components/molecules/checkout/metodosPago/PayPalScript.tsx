/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useRef, useState } from "react";
import { PayPalScriptProvider, PayPalButtons, type ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { useCheckout } from "@/components/providers/CheckoutProvider";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { CheckIcon } from "@/constants/IconsConstants";

type PaypalPaymentStatus = "idle" | "success" | "error" | "cancelled";

interface TabPayPalProps {
    amount: number;
    rptGetOffer: string;
    account: string | undefined;
    isRecurrent: boolean;
}

// Convertir URL a objeto de opciones para PayPalScriptProvider
const parsePaypalUrl = (url: string): Record<string, string> => {
    const parsed = new URL(url);
    return Object.fromEntries(parsed.searchParams.entries());
};

export default function PayPalScript({ amount, rptGetOffer, account, isRecurrent }: TabPayPalProps) {
    const [paypalOptions, setPaypalOptions] = useState<ReactPayPalScriptOptions | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaypalPaymentStatus>("idle");
    const { setPaymentReference, currentStep, totalSteps } = useCheckout();
    const { getValue } = useMicrocopies("contratacion-pago");

    let payPalPaymentRef: string | undefined;
    let PaypalStatus: string | undefined;
    const safeAccount = encodeURIComponent(account ?? "");

    /**
   * Creates a PayPal order by sending a POST request to the server.
   *
   * @returns {Promise<Object>} A promise that resolves to the created PayPal order object.
   * @throws {Error} If the server response is invalid or the request fails.
   */
    const createOrder = async (): Promise<string> => {

        setPaymentStatus("idle");
        try {
            const body = JSON.stringify({
                "amount": amount
            }); // Monto total a cobrar

            const headers = new Headers({
                "Content-Type": "application/json",
                "rpt": rptGetOffer,
            });

            const res = await fetch(`/api/paypal/createOrder/${safeAccount}`, {
                method: 'POST',
                headers,
                body,
            });

            const data = await res.json();
            if (!data.order || !data) throw new Error("Invalid response from server");

            payPalPaymentRef = data.reference;
            setPaymentReference((prev) => ({
                ...prev,
                paypalReference: payPalPaymentRef,
            }));
            return data.order;
        } catch (err) {
            console.error("Error creating PayPal order", err);
            setPaymentStatus("error");
            throw err;
        }
    }

    /**
     * Handles the approval of a PayPal payment, captures the order, and processes the response.
     *
     * @async
     * @param {Object} data - The data object containing payment information.
     * @property {boolean} errorTest - Flag to simulate error during capture for testing.
     * @property {boolean} baFlag - Indicates if the payment is a recurring charge.
     *
     * @returns {Promise<void>} Resolves when the capture process is complete.
     */
    const onApprove = async (data: Record<string, any>): Promise<void> => {

        try {
            data["errorTest"] = false; //validacion de error de prueba
            data["baFlag"] = isRecurrent;

            const headers = new Headers({
                "Content-Type": "application/json",
                "rpt": rptGetOffer,
            });

            const res = await fetch(`/api/paypal/captureOrder/${safeAccount}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            const details = await res.json();
            if (!details || !details.status) {
                setPaymentStatus("error");
                return;
            }

            PaypalStatus = details.status;
            if (PaypalStatus !== "COMPLETED") {
                //TODO: add error handling
                console.warn("Pago no completado correctamente");
                setPaymentStatus("error");
                return;
            }
            setPaymentStatus("success");
            //TODO: add handling for capture response if needed
        } catch (err) {
            console.error("Error capturando el pago de PayPal:", err);
            setPaymentStatus("error");
        }
    };

    /**
     * Handles the cancellation of a PayPal order.
     *
     * Sends a POST request to the cancelOrder endpoint with the order ID and required headers.
     *
     * @async
     * @function onCancel
     * @param {Object} data - The data object containing order information.
     * @param {string} data.orderID - The ID of the order to cancel.
     * @returns {Promise<void>} Resolves when the cancellation request is complete.
     */
    const onCancel = async (data: Record<string, any>): Promise<void> => {

        try {
            const req = { orderID: data.orderID };

            const headers = new Headers({
                "Content-Type": "application/json",
                "rpt": rptGetOffer,
            });

            const res = await fetch(`/api/paypal/cancelOrder/${safeAccount}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(req),
            });

            const dataCancel = await res.json();
            setPaymentStatus("cancelled");
            //TODO: add handling for cancel response if needed
        } catch (err) {
            console.error("Error cancelando la orden:", err);
            setPaymentStatus("cancelled");
        }
    };

    useEffect(() => {
        const fetchPaypalConfig = async () => {
            try {
                const res = await fetch(`/api/paypal/getScript`);
                if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

                const data = await res.json();

                if (data?.paypal_url) {
                    const options = parsePaypalUrl(data.paypal_url);

                    const mergeOptions: ReactPayPalScriptOptions = {
                        clientId: options["client-id"] ?? "test",
                        currency: options["currency"] ?? "MXN",
                        ...options,
                    };
                    setPaypalOptions(mergeOptions);
                } else {
                    throw new Error("Respuesta inválida del servicio PayPal");
                }

            } catch (err) {
                console.error("Error obteniendo configuración de PayPal:", err);
                setError("No se pudo cargar la configuración de PayPal.");
            }
        };

        if (currentStep === totalSteps) {
            fetchPaypalConfig();
        }
    }, []);

    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!paypalOptions) return <div>Cargando métodos de pago...</div>;

    return (
        <PayPalScriptProvider options={paypalOptions}>
            <div
                style={{ width: "100%", marginTop: "8px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: "10", position: "relative" }}
            >
                {/* <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input type="checkbox" id="pago_recurrente_paypal" />
                    Pago recurrente
                </label> */}

                <div
                    style={{ width: "100%", maxWidth: "400px" }}
                >
                    <PayPalButtons
                        style={{ label: "pay", layout: "vertical" }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onCancel={onCancel}
                    />
                </div>

                <PaypalPaymentStatusBanner
                    status={paymentStatus}
                    successMessage={getValue("pago.paypal.estado.exito") || "Pago confirmado en PayPal. Continúa para finalizar tu contratación."}
                    errorMessage={getValue("pago.paypal.estado.error") || "No pudimos completar el pago. Inténtalo de nuevo."}
                    cancelledMessage={getValue("pago.paypal.estado.cancelado") || "Cancelaste el pago con PayPal. Puedes reintentarlo cuando quieras."}
                />
            </div>
        </PayPalScriptProvider>
    );
}

interface PaypalPaymentStatusBannerProps {
    status: PaypalPaymentStatus;
    successMessage: string;
    errorMessage: string;
    cancelledMessage: string;
}

function PaypalPaymentStatusBanner({ status, successMessage, errorMessage, cancelledMessage }: PaypalPaymentStatusBannerProps) {
    if (status === "idle") return null;

    const baseClasses = "flex flex-row items-center gap-[12px] w-full max-w-[400px] py-[12px] px-[16px] rounded-md mt-[16px] text-sm leading-[20px]";

    if (status === "success") {
        return (
            <div
                role="status"
                aria-live="polite"
                className={`${baseClasses} bg-green-700/10 text-green-700 border border-green-700/20`}
            >
                <CheckIcon width="16px" height="16px" className="flex-shrink-0" />
                <p className="font-semibold">{successMessage}</p>
            </div>
        );
    }

    const message = status === "cancelled" ? cancelledMessage : errorMessage;

    return (
        <div
            role="alert"
            aria-live="assertive"
            className={`${baseClasses} bg-red-700/10 text-red-700 border border-red-700/20`}
        >
            <svg
                aria-hidden="true"
                focusable="false"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                width="16px"
                height="16px"
                className="flex-shrink-0"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="font-semibold">{message}</p>
        </div>
    );
}
