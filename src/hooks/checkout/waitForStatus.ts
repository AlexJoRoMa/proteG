
export async function waitForStatusAndRun<T extends { waitingForAction?: boolean }>(
    getStatus: () => T,
    callback: () => Promise<void>,
    interval = 1000
) {

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    while (true) {
        const status = getStatus();

        if (status?.waitingForAction === true) {
            console.log("waitingForAction = true -> ejecutando callback...")
            await callback();
            break;
        }

        await sleep(interval);
    }
}