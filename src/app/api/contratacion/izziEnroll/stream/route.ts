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
                    const heartbeatMsg = `data: {"type":"heartbeat","timestamp":${Date.now()}}\n\n`;
                    controller.enqueue(encoder.encode(heartbeatMsg));
                } catch (err) {
                    console.error("[Stream Route] Error en la peticion: "+err);
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
                    headers: { Cookie }
                });

                // Enviar el resultado
                const resultMsg = `data: {"type":"result","data":${JSON.stringify(data)}}\n\n`;
                controller.enqueue(encoder.encode(resultMsg));
                
            } catch (error) {
                console.error("[Stream Route] ❌ ERROR en izziEnroll");
                console.error('[Stream Route] Error type:', error instanceof Error ? error.constructor.name : typeof error);
                console.error('[Stream Route] Error message:', error instanceof Error ? error.message : String(error));
                console.error('[Stream Route] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
                
                const errorMessage = error instanceof Error ? error.message : "Error desconocido";
                const errorMsg = `data: {"type":"error","error":"${errorMessage}"}\n\n`;
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
