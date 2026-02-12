import useSWR from "swr";

interface MicrocopyItem {
    fields: {
        key: string;
        value: string;
        valueLong: string;
    };
}

interface MicrocopyEntry {
    fields: {
        resources: MicrocopyItem[]
    };
}

async function fetchMicrocopies(key: string) {
    const res = await fetch(`/api/microcopies?key=${key}`);

    if (!res.ok) throw new Error("Error al obtener los microcopies desde Contentful");
    return res.json();
}

export function useMicrocopies(key: string) {
    const { data, error, isLoading } = useSWR<MicrocopyEntry[]>(
        ["microcopies", key],
        () => fetchMicrocopies(key),
        {
            dedupingInterval: 3600000, // 1 hora
            revalidateOnFocus: false,
            keepPreviousData: true,
            revalidateIfStale: false,
        }
    );

    const getValue = (key: string): string => {

        const resources = data?.[0]?.fields?.resources;

        if (!resources) return '';
        const item = resources.find((r) => r.fields.key === key);
        return item?.fields.value || "";
    };

    const getValue2 = (key: string): string => {

        const resources = data?.[0]?.fields?.resources;

        if (!resources) return '';
        const item = resources.find((r) => r.fields.key === key);
        return item?.fields.value || "";
    };

    return {
        getValue,
        getValue2,
        isLoading,
        error,
        rawData: data,
    };
}