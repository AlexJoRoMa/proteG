'use server'

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

    return new Response(
        JSON.stringify({ 
            jobId, 
            status: job.status, 
            error: job.error ?? null,
            createdAt: job.createdAt
        }), 
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}
