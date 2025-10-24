
export async function GetCapacity(processId: string) {

    try {
        const headers = new Headers({
            "Content-Type": "application/json",
            "x-processId": processId,
        });

        const response = await fetch("/api/contratacion/getCapacity", {
            method: "GET",
            headers,
        });

        const data = await response.json();
        console.log('response getCapacity:', data)
        if (!data) throw new Error("Invalid response from server");

        return data;

    } catch (err) {
        console.error("Error al generar GetCapacity", err);
        throw err;
    }

}