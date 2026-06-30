
export interface ExternalApiPayload {
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
