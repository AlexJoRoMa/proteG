'use server'

import { getSendCode } from "@/services/izzi/contratacion";

export async function POST() {
    console.log("API route /envioCodigo ejecutandose...")

    try {

        // const body:  = await request.json();
        const data = await getSendCode();
        console.log("respuesta de getSendCode", data)

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        console.log("Error de API")
        return new Response(JSON.stringify({ error: 'API fetch error', e }), { status: 500 });
    }
}