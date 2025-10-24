import { NextResponse } from "next/server";

const paypalBasePath = process.env.PAYPAL_BASE_PATH!;
const apiKey = process.env.API_KEY!;
const paypalChannel = process.env.PAYPAL_CHANNEL!;
const paypalPlatform = process.env.PAYPAL_PLATFORM!;
const paypalAuthorization = process.env.AUTHORIZATION_KEY!;

export async function GET() {
    try {
        console.log({
            paypalBasePath,
            apiKey,
            paypalChannel,
            paypalPlatform,
        })

        const url = paypalBasePath;

        const headers = new Headers({
            "Content-Type": "application/json",
            channel: paypalChannel,
            platform: paypalPlatform,
            "Authorization": paypalAuthorization,
        });

        const res = await fetch(`${url}/getPaypalScript`, {
            method: "GET",
            headers,
            cache: "no-store",
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Error HTTP ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error("Error en proxy getPaypalScript:", err);
        return NextResponse.json(
            { error: "Error interno al obtener configuracion PayPal" },
            { status: 500 }
        );
    }
}