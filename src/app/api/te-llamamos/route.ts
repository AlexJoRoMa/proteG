import { NextRequest, NextResponse } from 'next/server';

export interface TeLlamamosFormData {
  nombre?: string;
  telefono: string;
  email?: string;
  mensaje?: string;
  recaptchaToken: string;
  utm?: string;
  url: string; // URL del navegador
}

interface ExternalApiPayload {
  nombre: string;
  email: string;
  telefono: string;
  Tipo: string;
  utm: string | null; // Puede ser null si no se proporciona
  flujo: string | null;
  canal: string;
  captcha: string;
  from: string;
}

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
    canal: 'llamame', // Canal siempre será el mismo
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

    console.log('Enviando request a:', url.toString());
    console.log('Payload:', payload);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

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

    console.log('=== Inicio POST /api/te-llamamos ===');

    const formData: TeLlamamosFormData = await request.json();
    console.log('Form data recibida:', formData);

    const { telefono, recaptchaToken, utm, url } = formData;

    // Validaciones básicas
    if (!telefono || !recaptchaToken) {
      console.log('Validación fallida:', { telefono: !!telefono, recaptchaToken: !!recaptchaToken });

      return NextResponse.json(
        { 
          success: false, 
          error: 'Campos requeridos: teléfono y token de reCAPTCHA' 
        },
        { status: 400 }
      );
    }

    console.log('Validaciones pasadas, enviando a API externa...');

    // Enviar datos a la API externa
    const externalApiSuccess = await sendToExternalApi(formData);

    console.log('Resultado API externa:', externalApiSuccess);

    if (!externalApiSuccess) {
      console.log('Error en API externa, retornando error 500');
      return NextResponse.json({
        success: false,
        error: 'Error al procesar la solicitud. Intenta nuevamente.'
      }, { status: 500 });
    }

    console.log('Formulario Te Llamamos procesado exitosamente');
    
    return NextResponse.json({
      success: true,
      message: 'Solicitud recibida exitosamente. Te contactaremos pronto.',
      data: {
        nombre: 'anonimo',
        telefono,
        timestamp: new Date().toISOString(),
        url
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
