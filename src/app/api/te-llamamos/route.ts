import { TeLlamamosFormData } from '@/types/RecaptchaTypes';
import { ExternalApiPayload } from '@/types/TeLlamamosRouteType';
import { NextRequest, NextResponse } from 'next/server';


async function sendToExternalApi(data: TeLlamamosFormData): Promise<boolean> {
  const apiEndpoint = process.env.API_TE_LLAMAMOS_ENDPOINT;
  
  if (!apiEndpoint) {
    console.error('API_TE_LLAMAMOS_ENDPOINT no está configurado');
    return false;
  }

  // Preparar el payload según la especificación
  const payload: ExternalApiPayload = {
    nombre: 'anonimo',
    email: 'dummy@izzi.mx',
    telefono: data.telefono,
    Tipo: 'local',
    utm: data.utm || null,
    flujo: null,
    canal: 'llamame',
    captcha: data.recaptchaToken,
    from: data.url
  };

  try {
    // Enviar como GET con parámetros en query string
    const url = new URL(apiEndpoint);
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

     if (!response.ok) {
      const responseText = await response.text();
      console.error('Response error:', responseText);
    }

    return response.status === 200;
  } catch (error) {
    console.error('Error enviando datos a API externa:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData: TeLlamamosFormData = await request.json();

    const { telefono, recaptchaToken, utm, url } = formData;

    if (!telefono || !recaptchaToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campos requeridos: teléfono y token de reCAPTCHA' 
        },
        { status: 400 }
      );
    }

    const externalApiSuccess = await sendToExternalApi(formData);

    if (!externalApiSuccess) {
      return NextResponse.json({
        success: false,
        error: 'Error al procesar la solicitud. Intenta nuevamente.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud recibida exitosamente. Te contactaremos pronto.',
      data: {
        nombre: 'anonimo',
        telefono,
        timestamp: new Date().toISOString(),
        url,
        utm
      }
    });

  } catch (error) {
     console.error('=== Error procesando formulario Te Llamamos ===');
    console.error('Error:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'Unknown error');
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
