/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useRef, useState } from "react";
import { PayPalScriptProvider, PayPalButtons, type ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { useCheckout } from "@/components/providers/CheckoutProvider";

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
    const { setPaymentReference, currentStep, totalSteps } = useCheckout();

    let payPalPaymentRef: string | undefined;
    let PaypalStatus: string | undefined;

    /**
   * Creates a PayPal order by sending a POST request to the server.
   *
   * @returns {Promise<Object>} A promise that resolves to the created PayPal order object.
   * @throws {Error} If the server response is invalid or the request fails.
   */
    const createOrder = async (): Promise<string> => {

        try {
            const body = JSON.stringify({
                "amount": amount
            }); // Monto total a cobrar

            const headers = new Headers({
                "Content-Type": "application/json",
                "rpt": rptGetOffer,
            });

            const res = await fetch(`/api/paypal/createOrder/${account}`, {
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

            const res = await fetch(`/api/paypal/captureOrder/${account}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            const details = await res.json();
            if (!details || !details.status) return;

            PaypalStatus = details.status;
            if (PaypalStatus !== "COMPLETED") {
                //TODO: add error handling
                console.warn("Pago no completado correctamente:", PaypalStatus);
                return;
            }
            //TODO: add handling for capture response if needed
        } catch (err) {
            console.error("Error capturando el pago de PayPal:", err);
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

            const res = await fetch(`/api/paypal/cancelOrder/${account}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(req),
            });

            const dataCancel = await res.json();
            //TODO: add handling for cancel response if needed
        } catch (err) {
            console.error("Error cancelando la orden:", err);
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
                style={{ width: "100%", marginTop: "8px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "10", position: "relative" }}
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
            </div>
        </PayPalScriptProvider>
    );
}