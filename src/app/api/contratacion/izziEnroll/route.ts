'use server'

import { getIzziEnroll } from "@/services/izzi/contratacion";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {

    try {
        const body = await request.json();
        console.log('body', body)
        const Cookie = request.headers.get("x-Cookie")!;

        const data = await getIzziEnroll({
            body,
            headers: { Cookie }
        });

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        console.log("Error de API")
        return new Response(JSON.stringify({ error: 'API fetch error', e }), { status: 500 });
    }
}