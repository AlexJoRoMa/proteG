
export async function GetProcessStatus(processId: string) {
    
    try {
        const headers = new Headers({
            "Content-Type": "application/json",
            "processId": processId
        });

        const response = await fetch("/api/contratacion/processStatus", {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error("Fallo en el servicio processStatus");
        }

        const data = await response.json();
        if (data.error) throw new Error("Invalid response from server");

        console.log('response processStatus:', data)
        return data;

    } catch (err) {
        console.error("Error al ejecutar processStatus", err);
        throw err;
    }

}