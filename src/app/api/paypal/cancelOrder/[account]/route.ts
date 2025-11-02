import { NextRequest, NextResponse } from "next/server";

// Cancela una orden PayPal

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ account: string }> }
) {
    try {
        const paypalBasePath = process.env.PAYPAL_BASE_PATH!;
        const paypalChannel = process.env.PAYPAL_CHANNEL!;
        const paypalPlatform = process.env.PAYPAL_PLATFORM!;
        const paypalCookie = process.env.PAYPAL_COOKIE!;

        const body = await request.json();
        const rpt = request.headers.get("rpt")!;

        const { account } = await context.params;

        const headers = new Headers({
            "Content-Type": "application/json",
            "channel": `${paypalChannel}`,
            "platform": `${paypalPlatform}`,
            "rpt": `${rpt}`,
            "Cookie": `${paypalCookie}`,
        });

        const res = await fetch(`${paypalBasePath}/cancelOrder/${account}`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const data = await res.json();
        return NextResponse.json(data);

    } catch (err) {
        console.error("Error en proxy cancelOrder:", err);
        return NextResponse.json(
            { error: "Error interno al cancelar orden PayPal" },
            { status: 500 }
        );
    }
}