declare global {
  interface Window {
    grecaptcha?: {
      reset: (widgetId?: number) => void;
      render: (container: string | Element, parameters: Record<string, unknown>) => number;
      getResponse: (widgetId?: number) => string;
      execute: (widgetId?: number) => void;
    };
  }
}

export {};
