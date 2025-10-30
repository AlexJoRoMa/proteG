'use server'

import { getVerificaPago } from "@/services/izzi/contratacion";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {

    try {
        const body = await request.json();
        console.log('body', body)
        const channel = request.headers.get("x-access-channel")!;
        const origin = request.headers.get("x-access-origin")!;

        const data = await getVerificaPago({
            body,
            headers: { channel, origin }
        });

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        console.log("Error de API")
        return new Response(JSON.stringify({ error: 'API fetch error', e }), { status: 500 });
    }
}