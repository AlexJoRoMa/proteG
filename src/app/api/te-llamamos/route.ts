import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyRecaptchaToken, 
  getClientIP 
} from '@/services/recaptcha/recaptchaService';

export interface TeLlamamosFormData {
  nombre?: string;
  telefono: string;
  email?: string;
  mensaje?: string;
  recaptchaToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData: TeLlamamosFormData = await request.json();
    const { nombre, telefono, email, mensaje, recaptchaToken } = formData;

    // Validaciones básicas
    if (!telefono || !recaptchaToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campos requeridos: teléfono y token de reCAPTCHA' 
        },
        { status: 400 }
      );
    }

    // Obtener la IP del cliente
    const clientIP = getClientIP(request);

    // Verificar reCAPTCHA
    const verificationResult = await verifyRecaptchaToken(recaptchaToken, clientIP);

    if (!verificationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Verificación de seguridad falló. Intenta nuevamente.',
        details: verificationResult['error-codes']
      }, { status: 400 });
    }

    // Para reCAPTCHA v2, no necesitamos validar score ni action
    // Solo verificamos que sea exitoso

    // Aquí iría la lógica para procesar el formulario
    // Por ejemplo: enviar email, guardar en base de datos, etc.
    console.log('Formulario Te Llamamos recibido:', {
      nombre: nombre || 'No proporcionado',
      telefono,
      email,
      mensaje,
      timestamp: new Date().toISOString(),
      ip: clientIP
    });

    // Simular procesamiento
    // TODO: Implementar lógica de negocio específica
    
    return NextResponse.json({
      success: true,
      message: 'Solicitud recibida exitosamente. Te contactaremos pronto.',
      data: {
        nombre: nombre || 'Usuario',
        telefono,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error procesando formulario Te Llamamos:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
