'use server'

import { GetProcessStatus } from "@/services/izzi/contratacion";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

    try {
        const processId = request.headers.get("processId")!;

        const data = await GetProcessStatus({
            headers: { processId }
        });

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        console.error("Error de API:", e)
        return new Response(JSON.stringify({ error: 'API fetch error' }), { status: 500 });
    }
}