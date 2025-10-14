
export async function waitForStatusAndRun<T>(
    getStatus: () => boolean | undefined,
    serviceFn: () => Promise<T>,
    interval: number = 1000,
    timeout: number = 60000
): Promise<T> {
    const start = Date.now();

    while (true) {
        const status = getStatus();

        if (status) {
            return await serviceFn();
        }

        if (Date.now() - start > timeout) {
            throw new Error("Timeout esperando waitingForAction = true");
        }

        await new Promise((res) => setTimeout(res, interval));
    }
}