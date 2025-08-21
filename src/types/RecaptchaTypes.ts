// Tipos simplificados solo para reCAPTCHA v2
export interface RecaptchaVerificationResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: RecaptchaErrorCode[];
}

export type RecaptchaErrorCode = 
  | 'missing-input-secret'
  | 'invalid-input-secret'
  | 'missing-input-response'
  | 'invalid-input-response'
  | 'bad-request'
  | 'timeout-or-duplicate';

export interface TeLlamamosFormData {
  nombre?: string;
  telefono: string;
  recaptchaToken: string;
}

export const RECAPTCHA_ERROR_MESSAGES: Record<RecaptchaErrorCode, string> = {
  'missing-input-secret': 'Falta la clave secreta',
  'invalid-input-secret': 'Clave secreta inválida',
  'missing-input-response': 'Falta el token de respuesta',
  'invalid-input-response': 'Token de respuesta inválido',
  'bad-request': 'Solicitud malformada',
  'timeout-or-duplicate': 'Tiempo agotado o token duplicado'
} as const;
