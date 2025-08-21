export interface RecaptchaVerificationResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export interface RecaptchaVerificationRequest {
  token: string;
  action: string;
  userIP?: string;
}

/**
 * Verifica un token de reCAPTCHA v3 con Google
 */
export async function verifyRecaptchaToken(
  token: string,
  userIP?: string
): Promise<RecaptchaVerificationResponse> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    throw new Error('RECAPTCHA_SECRET_KEY no está configurada');
  }

  const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
  
  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);
  
  if (userIP) {
    formData.append('remoteip', userIP);
  }

  try {
    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: RecaptchaVerificationResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error verificando reCAPTCHA:', error);
    throw new Error('Error al verificar reCAPTCHA');
  }
}

/**
 * Valida si el score de reCAPTCHA es aceptable
 */
export function isValidRecaptchaScore(
  score: number | undefined,
  minScore: number = 0.5
): boolean {
  return score !== undefined && score >= minScore;
}

/**
 * Obtiene la IP del cliente desde los headers de la request
 */
export function getClientIP(request: Request): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return realIP || remoteAddr || undefined;
}
