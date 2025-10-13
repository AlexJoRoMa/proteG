import { getToken } from "@/services/izzi/configurador";
import { NextRequest, NextResponse } from "next/server";

const paypalBasePath = process.env.PAYPAL_BASE_PATH!;
const apiKey = process.env.API_KEY!;
const paypalChannel = process.env.PAYPAL_CHANNEL!;
const paypalPlatform = process.env.PAYPAL_PLATFORM!;

// Cancela una orden PayPal

export async function POST(
    req: NextRequest,
    { params }: { params: { account: string } }
) {
    try {
        const body = await req.json();
        const accessToken = await getToken();

        const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
            // Accept: "application/json",
            // channel: paypalChannel,
            // platform: paypalPlatform,
            // rpt: body.rptGetOffer ?? "",
            // "x-api-key": apiKey
        });

        const res = await fetch(`${paypalBasePath}/cancelOrder/${params.account}`, {
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