import { contentfulClient } from '@/services/contentful/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type');
  const contentType = searchParams.get('contentType');

    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
    }

  try {
    const entry = await contentfulClient.getEntries
    ({
        content_type: contentType as string,
        'sys.id': id,
        'fields.type': type,
    });

    return new Response(JSON.stringify(entry), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Contentful fetch error', e }), { status: 500 });
  }
}