import { getToken } from "@/services/izzi/configurador";
import { NextRequest, NextResponse } from "next/server";

const paypalBasePath = process.env.PAYPAL_BASE_PATH!;
const apiKey = process.env.API_KEY!;
const paypalChannel = process.env.PAYPAL_CHANNEL!;
const paypalPlatform = process.env.PAYPAL_PLATFORM!;
const authorizationKey = process.env.AUTHORIZATION_KEY!;

// Crea una orden PayPal

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ account: string }> }
) {
    try {
        const body = await request.json();
        const rpt = request.headers.get("rpt")!;


        const { account } = await context.params;
        console.log('body', body)

        const headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": authorizationKey,
            channel: paypalChannel,
            platform: paypalPlatform,
            rpt: rpt,
            "x-api-key": apiKey
        });

        const res = await fetch(`${paypalBasePath}/createOrder/${account}`, {
            method: "POST",
            headers,
            body,
            cache: "no-store",
        });

        const data = await res.json();
        return NextResponse.json(data);

    } catch (err) {
        console.error("Error en proxy createOrder:", err);
        return NextResponse.json(
            { error: "Error interno al crear orden PayPal" },
            { status: 500 }
        );
    }
}

