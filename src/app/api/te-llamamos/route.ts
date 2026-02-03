import { TeLlamamosFormData } from '@/types/RecaptchaTypes';
import { ExternalApiPayload } from '@/types/TeLlamamosRouteType';
import { NextRequest, NextResponse } from 'next/server';


async function sendToExternalApi(data: TeLlamamosFormData): Promise<boolean> {
  console.log('=== [Te Llamamos API] Iniciando envío a API externa ===');
  const apiEndpoint = process.env.API_TE_LLAMAMOS_ENDPOINT;
  
  console.log('[Te Llamamos API] Endpoint configurado:', apiEndpoint ? 'Sí' : 'No');
  
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
  
  console.log('[Te Llamamos API] Payload preparado:', JSON.stringify(payload, null, 2));

  try {
    // Enviar como GET con parámetros en query string
    const url = new URL(apiEndpoint);
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    console.log('[Te Llamamos API] URL completa a llamar:', url.toString());
    console.log('[Te Llamamos API] URL base:', url.origin + url.pathname);
    console.log('[Te Llamamos API] Query params count:', url.searchParams.toString().length);
    console.log('[Te Llamamos API] Método:', 'GET');
    console.log('[Te Llamamos API] Iniciando llamada al cliente...');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'manual' // No seguir redirects automáticamente para detectar 301
    });

    console.log('[Te Llamamos API] Respuesta recibida - Status:', response.status);
    console.log('[Te Llamamos API] Respuesta recibida - Status Text:', response.statusText);
    console.log('[Te Llamamos API] Respuesta recibida - OK:', response.ok);
    console.log('[Te Llamamos API] Respuesta recibida - Type:', response.type);
    
    // Detectar específicamente redirects 301, 302, 307, 308
    if (response.status === 301) {
      console.error('[Te Llamamos API] ⚠️ REDIRECT 301 DETECTADO (Moved Permanently)');
      const locationHeader = response.headers.get('location');
      console.error('[Te Llamamos API] Location header:', locationHeader);
      console.error('[Te Llamamos API] Esto indica que el endpoint está redirigiendo a otra URL');
      console.error('[Te Llamamos API] Posibles causas:');
      console.error('[Te Llamamos API]   - Falta o sobra barra "/" al final de la URL');
      console.error('[Te Llamamos API]   - Redirección HTTP -> HTTPS');
      console.error('[Te Llamamos API]   - Configuración de Apache/Nginx redirigiendo');
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
    
    // Log de todos los headers de respuesta
    const allHeaders = Object.fromEntries(response.headers.entries());
    console.log('[Te Llamamos API] Response Headers completos:', JSON.stringify(allHeaders, null, 2));

    if (!response.ok) {
      const responseText = await response.text();
      console.error('[Te Llamamos API] ERROR: Respuesta no exitosa');
      console.error('[Te Llamamos API] Response Status:', response.status);
      console.error('[Te Llamamos API] Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));
      console.error('[Te Llamamos API] Response Body:', responseText);
      
      // Si es un redirect, dar instrucciones
      if (response.status >= 300 && response.status < 400) {
        console.error('[Te Llamamos API] 🔄 REDIRECCIÓN DETECTADA - Revisar configuración del endpoint');
        console.error('[Te Llamamos API] Sugerencias:');
        console.error('[Te Llamamos API]   1. Verificar que la URL no tenga redirects configurados');
        console.error('[Te Llamamos API]   2. Usar la URL final después del redirect');
        console.error('[Te Llamamos API]   3. Revisar configuración de Apache/Nginx');
      }
      
      return false;
    }

    const responseText = await response.text();
    console.log('[Te Llamamos API] Response Body exitoso:', responseText);
    console.log('[Te Llamamos API] ✅ Llamada exitosa al endpoint del cliente');
    
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
  console.log('=== [Te Llamamos] Nueva petición POST recibida ===');
  console.log('[Te Llamamos] Timestamp:', new Date().toISOString());
  console.log('[Te Llamamos] Request URL:', request.url);
  console.log('[Te Llamamos] Request Method:', request.method);
  
  try {
    const formData: TeLlamamosFormData = await request.json();
    
    console.log('[Te Llamamos] Datos recibidos:', JSON.stringify({
      telefono: formData.telefono ? `***${formData.telefono.slice(-4)}` : 'no proporcionado',
      nombre: formData.nombre || 'no proporcionado',
      email: formData.email ? `${formData.email.substring(0, 3)}***` : 'no proporcionado',
      hasRecaptchaToken: !!formData.recaptchaToken,
      utm: formData.utm || 'no proporcionado',
      url: formData.url || 'no proporcionado'
    }, null, 2));

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

    console.log('[Te Llamamos] ✅ Validación exitosa - Procediendo a enviar a API externa');

    const externalApiSuccess = await sendToExternalApi(formData);

    if (!externalApiSuccess) {
      console.error('[Te Llamamos] ❌ Fallo al enviar a API externa');
      return NextResponse.json({
        success: false,
        error: 'Error al procesar la solicitud. Intenta nuevamente.'
      }, { status: 500 });
    }

    console.log('[Te Llamamos] ✅ Proceso completado exitosamente');
    
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
