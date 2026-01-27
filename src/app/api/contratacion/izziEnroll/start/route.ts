'use server'

import { randomUUID } from "crypto";
import { getIzziEnroll } from "@/services/izzi/contratacion";
import { NextRequest } from "next/server";
import { jobs, cleanupOldJobs } from "../_store";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const Cookie = request.headers.get("x-Cookie") ?? "";

        const jobId = randomUUID();

        // Registrar el job como queued
        jobs.set(jobId, { status: "queued", createdAt: Date.now() });

        // Limpiar jobs viejos periódicamente
        cleanupOldJobs();

        // Ejecutar en background "best effort" usando setImmediate/queueMicrotask
        // No bloqueamos la respuesta HTTP
        (async () => {
            try {
                jobs.set(jobId, { 
                    status: "running", 
                    createdAt: jobs.get(jobId)?.createdAt ?? Date.now() 
                });

                const data = await getIzziEnroll({
                    body,
                    headers: { Cookie }
                });

                jobs.set(jobId, { 
                    status: "done", 
                    createdAt: jobs.get(jobId)?.createdAt ?? Date.now(), 
                    result: data 
                });
            } catch (e: unknown) {
                const errorMessage = e instanceof Error ? e.message : "Unknown error";
                jobs.set(jobId, {
                    status: "failed",
                    createdAt: jobs.get(jobId)?.createdAt ?? Date.now(),
                    error: errorMessage,
                });
            }
        })();

        // Responder inmediatamente con el jobId (evita el timeout de 30s)
        return new Response(
            JSON.stringify({ jobId, message: "Job started" }), 
            { 
                status: 202,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (e) {
        console.error("Error al iniciar job de izziEnroll:", e);
        return new Response(
            JSON.stringify({ error: "Error al iniciar el proceso" }), 
            { status: 500 }
        );
    }
}
