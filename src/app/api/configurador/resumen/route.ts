
import { getQuote } from "@/services/izzi/configurador";
import { QuoteInfo } from "@/types/ConfiguradorTypes";

export async function POST(request: Request) {

    try {

        const body: QuoteInfo = await request.json();
        const data = await getQuote(body);

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'API fetch error', e }), { status: 500 });
    }
}