import { getPackageInfo } from "@/services/izzi/configurador";
import { PackageInfo } from "@/types/ConfiguradorTypes";

export async function POST(request: Request) {

    try {

        const body: PackageInfo = await request.json();
        const data = await getPackageInfo(body);

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'API fetch error', e }), { status: 500 });
    }
}