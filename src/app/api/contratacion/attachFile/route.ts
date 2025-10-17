'use server'

import { getAttachFiles } from "@/services/izzi/contratacion";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {

    try {
        const body = await request.json();
        console.log('body files', body)

        const data = await getAttachFiles({
            body,
        });

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        console.log("Error de API")
        return new Response(JSON.stringify({ error: 'API fetch error', e }), { status: 500 });
    }
}