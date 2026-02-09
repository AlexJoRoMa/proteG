import { TeLlamamosFormData } from '@/types/RecaptchaTypes';
import { ExternalApiPayload } from '@/types/TeLlamamosRouteType';
import { NextRequest, NextResponse } from 'next/server';


async function sendToExternalApi(data: TeLlamamosFormData): Promise<boolean> {
  const apiEndpoint = process.env.API_TE_LLAMAMOS_ENDPOINT;
  
  if (!apiEndpoint) {
    console.error('[Te Llamamos API] ERROR: API_TE_LLAMAMOS_ENDPOINT no está configurado');
    return false;
  }

  // Preparar el payload según la especificación
  const payload: ExternalApiPayload = {
    nombre: data.nombre || 'anonimo',
    email: data.email || 'dummy@izzi.mx',
    telefono: data.telefono,
    Tipo: 'local',
    utm: data.utm || "",
    flujo: "footer",
    canal: 'llamame',
    captcha: data.recaptchaToken,
    from: data.url
  };

  try {

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
      redirect: 'manual' 
    });

    if (response.status === 301) {
      console.error('[Te Llamamos API] ⚠️ REDIRECT 301 DETECTADO (Moved Permanently)');
      const locationHeader = response.headers.get('location');
      console.error('[Te Llamamos API] Location header:', locationHeader);
    } else if (response.status === 302) {
      console.error('[Te Llamamos API] ⚠️ REDIRECT 302 DETECTADO (Found/Temporary)');
      const locationHeader = response.headers.get('location');
      console.error('[Te Llamamos API] Location header:', locationHeader);
    } else if (response.status === 307) {
      console.error('[Te Llamamos API] ⚠️ REDIRECT 307 DETECTADO (Temporary Redirect)');
      const locationHeader = response.headers.get('location');
      console.error('[Te Llamamos API] Location header:', locationHeader);
    } else if (response.status === 308) {
      console.error('[Te Llamamos API] ⚠️ REDIRECT 308 DETECTADO (Permanent Redirect)');
      const locationHeader = response.headers.get('location');
      console.error('[Te Llamamos API] Location header:', locationHeader);
    }

    if (!response.ok) {
      const responseText = await response.text();
      console.error('[Te Llamamos API] ERROR: Respuesta no exitosa');
      console.error('[Te Llamamos API] Response Status:', response.status);
      console.error('[Te Llamamos API] Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));
      console.error('[Te Llamamos API] Response Body:', responseText);
      
      // Si es un redirect, dar instrucciones
      if (response.status >= 300 && response.status < 400) {
        console.error('[Te Llamamos API] 🔄 REDIRECCIÓN DETECTADA - Revisar configuración del endpoint');
      }
      
      return false;
    }

    await response.text();
    
    return response.status === 200;
  } catch (error) {
    console.error('[Te Llamamos API] ❌ ERROR FATAL al llamar al endpoint del cliente');
    console.error('[Te Llamamos API] Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[Te Llamamos API] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[Te Llamamos API] Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    
    // Información adicional del error
    if (error instanceof TypeError) {
      console.error('[Te Llamamos API] TypeError detectado - Posible problema de red o URL inválida');
    }
    
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData: TeLlamamosFormData = await request.json();

    const { telefono, recaptchaToken, utm, url } = formData;

    if (!telefono || !recaptchaToken) {
      console.warn('[Te Llamamos] ⚠️ Validación fallida - Campos faltantes:', {
        telefono: !telefono ? 'FALTANTE' : 'OK',
        recaptchaToken: !recaptchaToken ? 'FALTANTE' : 'OK'
      });
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
      console.error('[Te Llamamos] ❌ Fallo al enviar a API externa');
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
    console.error('[Te Llamamos] ❌ ERROR CRÍTICO al procesar formulario');
    console.error('[Te Llamamos] Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[Te Llamamos] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[Te Llamamos] Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    
    // Si es un error de parsing JSON
    if (error instanceof SyntaxError) {
      console.error('[Te Llamamos] SyntaxError - Posible problema al parsear JSON del request');
    }
    
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
