'use server'

import { getLigaPago } from "@/services/izzi/contratacion";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {

    try {

        const body = await request.json();
        const origin = request.headers.get("x-access-origin")!;
        const channel = request.headers.get("x-access-channel")!;

        const data = await getLigaPago({
            body,
            headers: { origin, channel }
        });

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        console.error("Error de API")
        return new Response(JSON.stringify({ error: 'API fetch error', e }), { status: 500 });
    }
}