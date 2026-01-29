import { getIzziEnroll } from "@/services/izzi/contratacion";
import { NextRequest } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const Cookie = request.headers.get("x-Cookie") ?? "";

    // Crear un stream de respuesta
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
        async start(controller) {
            // Función para enviar heartbeat
            const sendHeartbeat = () => {
                try {
                    controller.enqueue(encoder.encode(`data: {"type":"heartbeat","timestamp":${Date.now()}}\n\n`));
                } catch {
                    // Stream cerrado, ignorar
                }
            };

            // Enviar heartbeat cada 10 segundos para mantener la conexión viva
            const heartbeatInterval = setInterval(sendHeartbeat, 10000);

            // Enviar primer heartbeat inmediatamente
            sendHeartbeat();

            try {
                console.log("[Stream] Iniciando llamada a izziEnroll...");
                
                // Llamar al servicio real (esto puede tardar 40-50s)
                const data = await getIzziEnroll({
                    body,
                    headers: { Cookie }
                });

                console.log("[Stream] Respuesta recibida de izziEnroll");

                // Enviar el resultado
                controller.enqueue(encoder.encode(`data: {"type":"result","data":${JSON.stringify(data)}}\n\n`));
                
            } catch (error) {
                console.error("[Stream] Error en izziEnroll:", error);
                const errorMessage = error instanceof Error ? error.message : "Error desconocido";
                controller.enqueue(encoder.encode(`data: {"type":"error","error":"${errorMessage}"}\n\n`));
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
