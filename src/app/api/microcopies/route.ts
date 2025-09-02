import { contentfulClient } from '@/services/contentful/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');


    if (!key) {
        return new Response(JSON.stringify({ error: 'Missing key' }), { status: 400 });
    }

  try {
       const microCopies = await contentfulClient.getEntries({
        content_type: 'resourceSet',
        'fields.name': key,
        include: 2
    });

    return new Response(JSON.stringify(microCopies.items), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Contentful fetch error', e }), { status: 500 });
  }
}