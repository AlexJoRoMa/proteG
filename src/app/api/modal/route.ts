import { contentfulClient } from '@/services/contentful/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
    }

  try {
    const entry = await contentfulClient.getEntries({
       content_type: 'modalComponentModel',
      'sys.id': id,
       select: ['fields.sideImage', 'fields.modalContent', 'fields.imageResponsive'],
       include: 2 // Incluir referencias hasta 2 niveles de profundidad
    });

    return new Response(JSON.stringify(entry), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Contentful fetch error', e }), { status: 500 });
  }
}