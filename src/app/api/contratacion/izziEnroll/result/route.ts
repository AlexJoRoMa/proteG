import { NextRequest } from "next/server";
import { jobs } from "../_store";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
        return new Response(
            JSON.stringify({ error: "Missing jobId parameter" }), 
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const job = jobs.get(jobId);

    if (!job) {
        return new Response(
            JSON.stringify({ error: "Job not found" }), 
            { status: 404, headers: { "Content-Type": "application/json" } }
        );
    }

    if (job.status === "failed") {
        return new Response(
            JSON.stringify({ 
                jobId, 
                status: job.status,
                error: job.error 
            }), 
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

    if (job.status !== "done") {
        return new Response(
            JSON.stringify({ 
                error: "Result not ready yet", 
                status: job.status 
            }), 
            { status: 409, headers: { "Content-Type": "application/json" } }
        );
    }

    // Job completado, devolver resultado y limpiar
    const result = job.result;
    jobs.delete(jobId); // Limpiamos después de entregar el resultado

    return new Response(
        JSON.stringify({ jobId, result }), 
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}
