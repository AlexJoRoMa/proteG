// Store para jobs de izziEnroll

export type JobStatus = "queued" | "running" | "done" | "failed";

export type Job = {
  status: JobStatus;
  createdAt: number;
  result?: unknown;
  error?: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __izziEnrollJobs: Map<string, Job> | undefined;
}

export const jobs = globalThis.__izziEnrollJobs ?? new Map<string, Job>();
globalThis.__izziEnrollJobs = jobs;

// Limpiar jobs viejos (más de 10 minutos) para evitar memory leaks
export function cleanupOldJobs() {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [jobId, job] of jobs.entries()) {
    if (job.createdAt < tenMinutesAgo) {
      jobs.delete(jobId);
    }
  }
}
