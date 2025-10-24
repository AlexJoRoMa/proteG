import { NextRequest, NextResponse } from "next/server";

// Captura una orden PayPal (cuando el usuario aprueba el pago)

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ account: string }> }
) {
    try {
        const paypalBasePath = process.env.PAYPAL_BASE_PATH!;
        const paypalChannel = process.env.PAYPAL_CHANNEL!;
        const paypalPlatform = process.env.PAYPAL_PLATFORM!;

        const body = await request.json();
        const rpt = request.headers.get("rpt")!;

        const { account } = await context.params;

        const headers = new Headers({
            "Content-Type": "application/json",
            "channel": `${paypalChannel}`,
            "platform": `${paypalPlatform}`,
            "rpt": `${rpt}`,
        });

        const res = await fetch(`${paypalBasePath}/captureOrder/${account}`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const data = await res.json();
        return NextResponse.json(data);

    } catch (err) {
        console.error("Error en proxy captureOrder;", err);
        return NextResponse.json(
            { error: "Error interno al capturar orden PayPal" },
            { status: 500 }
        );
    }
}