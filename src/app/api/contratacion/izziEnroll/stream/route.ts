import { getIzziEnroll } from "@/services/izzi/contratacion";
import { NextRequest } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const upstreamCookie = request.headers.get("cookie") ?? request.headers.get("x-upstream-cookie") ?? "";

    console.log('🚩 body ', JSON.stringify(body))
    // Crear un stream de respuesta
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
        async start(controller) {
            
            // Función para enviar heartbeat
            const sendHeartbeat = () => {
                try {
                    const heartbeatMsg = `data: ${JSON.stringify({ type: "heartbeat", timestamp: Date.now() })}\n\n`;
                    console.log('heartbeatMsg ', heartbeatMsg)
                    controller.enqueue(encoder.encode(heartbeatMsg));
                } catch (err) {
                    void err;
                    console.error("[Stream Route] Error en heartbeat");
                }
            };

            // Enviar heartbeat cada 10 segundos para mantener la conexión viva
            const heartbeatInterval = setInterval(sendHeartbeat, 10000);

            // Enviar primer heartbeat inmediatamente
            sendHeartbeat();

            try {
                
                // Llamar al servicio real (esto puede tardar 40-50s)
                const data = await getIzziEnroll({
                    body,
                    headers: { Cookie: upstreamCookie }
                });

                // Enviar el resultado
                const resultMsg = `data: ${JSON.stringify({ type: "result", data })}\n\n`;
                controller.enqueue(encoder.encode(resultMsg));
                console.log('🚩 getIzziEnroll Data ', data);
            } catch (error) {
                console.error("[Stream Route] Error en izziEnroll");
                
                const errorMessage = error instanceof Error ? error.message : "Error desconocido";
                const errorMsg = `data: ${JSON.stringify({ type: "error", error: errorMessage })}\n\n`;
                controller.enqueue(encoder.encode(errorMsg));
            } finally {
                clearInterval(heartbeatInterval);
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // Desactivar buffering en nginx/proxies
        },
    });
}
