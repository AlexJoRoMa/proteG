'use server'

import { getVerifyCode } from "@/services/izzi/contratacion";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {

    try {

        const body = await request.json();
        console.log('body verifica', body)
        const medio = request.headers.get("medio")!;
        const oferta = request.headers.get("oferta")!;
        const origin = request.headers.get("x-origin")!;

        const data = await getVerifyCode({
            body,
            headers: { medio, oferta, origin}
        });
        // console.log('headers:', { medio, oferta, origin })
        console.log('response verifica:', data)

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        console.log("Error de API")
        return new Response(JSON.stringify({ error: 'API fetch error', e }), { status: 500 });
    }
}