'use server'

import { getCapacity} from "@/services/izzi/contratacion";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

    try {
        const processId = request.headers.get("x-processId")!;

        const data = await getCapacity({
            headers: { processId }
        });

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        console.error("Error de API")
        return new Response(JSON.stringify({ error: 'API fetch error', e }), { status: 500 });
    }
}