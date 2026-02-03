import { getIzziEnroll } from "@/services/izzi/contratacion";
import { NextRequest } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    console.log('[Stream Route] === Nueva petición POST recibida ===');
    console.log('[Stream Route] Timestamp:', new Date().toISOString());
    console.log('[Stream Route] URL:', request.url);
    console.log('[Stream Route] Method:', request.method);
    
    const body = await request.json();
    console.log('[Stream Route] Body recibido:', JSON.stringify(body, null, 2));
    
    const Cookie = request.headers.get("x-Cookie") ?? "";
    console.log('[Stream Route] Cookie header:', Cookie ? `Presente (${Cookie.substring(0, 50)}...)` : 'No presente');

    // Crear un stream de respuesta
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
        async start(controller) {
            console.log('[Stream Route] Stream iniciado');
            
            // Función para enviar heartbeat
            const sendHeartbeat = () => {
                try {
                    const heartbeatMsg = `data: {"type":"heartbeat","timestamp":${Date.now()}}\n\n`;
                    controller.enqueue(encoder.encode(heartbeatMsg));
                    console.log('[Stream Route] Heartbeat enviado');
                } catch (err) {
                    console.log('[Stream Route] Stream cerrado, no se puede enviar heartbeat');
                    console.error("[Stream Route] Error en la peticion: "+err);
                }
            };

            // Enviar heartbeat cada 10 segundos para mantener la conexión viva
            const heartbeatInterval = setInterval(sendHeartbeat, 10000);
            console.log('[Stream Route] Heartbeat interval configurado (cada 10s)');

            // Enviar primer heartbeat inmediatamente
            sendHeartbeat();

            try {
                console.log("[Stream Route] Iniciando llamada a getIzziEnroll...");
                const callStartTime = Date.now();
                
                // Llamar al servicio real (esto puede tardar 40-50s)
                const data = await getIzziEnroll({
                    body,
                    headers: { Cookie }
                });
                
                const callEndTime = Date.now();
                const callDuration = callEndTime - callStartTime;

                console.log("[Stream Route] ✅ Respuesta recibida de getIzziEnroll");
                console.log('[Stream Route] Duración total de la llamada:', `${callDuration}ms (${(callDuration/1000).toFixed(2)}s)`);
                console.log('[Stream Route] Tipo de dato recibido:', typeof data);
                console.log('[Stream Route] Data length:', typeof data === 'string' ? data.length : 'N/A');

                // Enviar el resultado
                const resultMsg = `data: {"type":"result","data":${JSON.stringify(data)}}\n\n`;
                controller.enqueue(encoder.encode(resultMsg));
                console.log('[Stream Route] Resultado enviado al cliente');
                
            } catch (error) {
                console.error("[Stream Route] ❌ ERROR en izziEnroll");
                console.error('[Stream Route] Error type:', error instanceof Error ? error.constructor.name : typeof error);
                console.error('[Stream Route] Error message:', error instanceof Error ? error.message : String(error));
                console.error('[Stream Route] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
                
                const errorMessage = error instanceof Error ? error.message : "Error desconocido";
                const errorMsg = `data: {"type":"error","error":"${errorMessage}"}\n\n`;
                controller.enqueue(encoder.encode(errorMsg));
                console.log('[Stream Route] Error enviado al cliente');
            } finally {
                console.log('[Stream Route] Limpiando recursos...');
                clearInterval(heartbeatInterval);
                controller.close();
                console.log('[Stream Route] Stream cerrado');
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
