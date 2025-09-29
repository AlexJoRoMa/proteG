import { contentfulClient } from '@/services/contentful/client';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
        return new Response(JSON.stringify({ error: 'Missing key' }), { status: 400 });
    }

    try {
        const iconKeys = [`modal-configurador-${key}-1`, `modal-configurador-${key}-2`, `modal-configurador-${key}-3`];

        const entry = await contentfulClient.getEntries({
            content_type: 'media',
            'fields.internalName[in]': iconKeys.join(','),
            include: 5
        });

        const items = entry.items ?? [];

        const iconsInOrder = iconKeys.map((key) =>
            items.find((item) => item.fields.internalName === key) || null
        );

        const response = {
            ...entry,
            items: iconsInOrder,
        };

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Contentful fetch error', e }), { status: 500 });
    }
}