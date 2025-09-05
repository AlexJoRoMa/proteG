export const TRIPLE_PLAY = "linear-gradient(90deg, #FF6C07 0%, #4DA9A7 33%, #D31772 66%, #FCD116 100%)";
export const INTERNET_TV = "linear-gradient(90deg, #FF6C07 0%, #4DA9A7 100%)";
export const MOVIL_TV = "linear-gradient(90deg, #D31772 0%, #4DA9A7 100%)";
export const INTERNET_MOVIL = "linear-gradient(90deg, #FF6C07 0%, #D31772 100%)";
export const INTERNET = "linear-gradient(90deg, #FF6C07 0%, #FF6C07 100%)";
export const TV = "linear-gradient(90deg, #4DA9A7 0%, #4DA9A7 100%)";
export const MOVIL = "linear-gradient(90deg, #D31772 0%, #D31772 100%)";

// Mapa de colores para fácil acceso
export const COLOR_MAP = {
  TRIPLE_PLAY,
  INTERNET_TV,
  MOVIL_TV,
  INTERNET_MOVIL,
  INTERNET,
  TV,
  MOVIL,
} as const;

// Tipo para las opciones de color
export type ColorOption = keyof typeof COLOR_MAP;