# izzi.mx - Implementación Data Layer GA4 (Next.js + TypeScript)

## Contexto del Proyecto

Este proyecto implementa el **Tracking Plan GA4** para el flujo de compra online de **izzi.mx Residencial**. El sitio está construido en **Next.js con TypeScript**. La implementación se basa en un Digital Data Layer que alimenta Google Tag Manager (GTM), el cual a su vez envía datos a GA4, Google Ads (Enhanced Conversions) y BigQuery.

### Stack Tecnológico
- **Frontend:** Next.js + TypeScript
- **Tag Management:** Google Tag Manager (GTM) - ya instalado
- **Analytics:** Google Analytics 4 (GA4) - ya configurado
- **Ads:** Google Ads con Enhanced Conversions - ya habilitado
- **User-ID:** `phone_hash` (SHA-256 del teléfono) - ya implementado

### Objetivo Principal
Implementar el Digital Data Layer en el frontend para que GTM pueda capturar todos los eventos del funnel de compra, carrito abandonado y lead generation.

---

## Estructura de Archivos a Crear

```
src/
├── lib/
│   └── tracking/
│       ├── types.ts                    # Tipos TypeScript para todos los eventos y schemas
│       ├── constants.ts                # Constantes: nombres de eventos, pasos del checkout, etc.
│       ├── helpers.ts                  # Funciones helper (normalización, generación de IDs, etc.)
│       ├── dataLayer.ts               # Función principal safePush y utilidades del dataLayer
│       ├── events/
│       │   ├── pageData.ts            # Evento page_data (inicialización por página)
│       │   ├── userData.ts            # Evento user_data (estado de autenticación)
│       │   ├── ecommerce.ts           # Eventos ecommerce: view_item_list, select_item, view_item, add_to_cart
│       │   ├── checkout.ts            # Eventos checkout: begin_checkout, checkout_progress (steps 1-4), add_shipping_info, add_payment_info
│       │   ├── purchase.ts            # Evento purchase con Enhanced Conversions
│       │   ├── coverage.ts            # Eventos coverage_complete y coverage_failed (MVP crítico)
│       │   ├── leadGen.ts             # Eventos generate_lead, help_request_open, click_to_call, chat_open
│       │   ├── promotions.ts          # Eventos view_promotion y select_promotion
│       │   ├── exitIntent.ts          # Eventos checkout_exit_intent y checkout_abandon
│       │   └── auth.ts               # Eventos login_intent, login, sign_up
│       └── hooks/
│           ├── usePageTracking.ts     # Hook para tracking automático de page_data
│           ├── useEcommerceTracking.ts # Hook para eventos ecommerce en componentes
│           └── useCheckoutTracking.ts  # Hook para el flujo de checkout con session_id persistente
├── components/
│   └── tracking/
│       └── TrackingProvider.tsx        # Provider que inicializa dataLayer y GTM
```

---

## Plan de Trabajo por Fases

### Fase 1: Core & MVP Carrito Abandonado (Prioridad CRÍTICA)

#### 1.1 Tipos TypeScript (`types.ts`)

Definir interfaces para:

```typescript
// Tipos base
interface PageData {
  type: 'home' | 'category' | 'product' | 'checkout' | 'confirmation' | 'landing' | 'support';
  name: string;
  section: 'residencial' | 'empresarial';
  language?: string;
  category?: string;
  checkout_step?: number;
  transaction_id?: string;
}

interface SiteData {
  environment: 'production' | 'staging' | 'development';
  version: string;
}

// Item de ecommerce GA4
interface EcommerceItem {
  item_id: string;           // Ej: 'PLAN-INT-500'
  item_name: string;         // Ej: 'Internet 500 Mbps'
  item_brand: 'izzi';
  item_category: 'Internet' | 'TV' | 'Bundle' | 'Móvil';
  item_category2?: 'Residencial' | 'Empresarial';
  item_category3?: string;   // Fibra | Coaxial | Doble_Play | Triple_Play
  item_category4?: string;   // Velocidad: '500_mbps'
  item_category5?: string;   // Contrato: '12_meses'
  item_variant?: string;
  item_list_id?: string;
  item_list_name?: string;
  index?: number;
  price: number;
  discount?: number;
  quantity: number;
  coupon?: string;
  // Custom telecom
  speed_mbps?: string;
  contract_months?: string;
  installation_fee?: string;
  router_included?: string;
  channel_count?: string;
  tv_package?: string;
  phone_minutes?: string;
  // Promotions
  promotion_id?: string;
  promotion_name?: string;
  creative_name?: string;
  creative_slot?: string;
  location_id?: string;
}

// User data para Enhanced Conversions
interface UserData {
  email?: string | null;
  phone_number?: string | null;  // Formato E.164: +525512345678
  address?: {
    first_name?: string;
    last_name?: string;
    street?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country: 'MX';
  };
}

// Lead data para coverage_complete
interface LeadData {
  name: string;
  phone: string;         // Formato E.164
  email?: string | null;
  address: {
    street: string;
    colony: string;
    city: string;
    state: string;
    postal_code: string;
  };
}

// Coverage types
type CoverageType = 'fiber' | 'coaxial' | 'unavailable';

// Checkout step names
type CheckoutStepName = 'package_configuration' | 'personal_data' | 'contact_verification' | 'documents' | 'payment';

// Lead sources
type LeadSource = 'whatsapp' | 'callback' | 'call' | 'chat' | 'form';

// Payment types
type PaymentType = 'credit_card' | 'debit_card' | 'bank_transfer' | 'oxxo';

// Abandon reasons
type AbandonReason = 'user_confirmed_exit' | 'timeout' | 'error';
```

#### 1.2 Constantes (`constants.ts`)

```typescript
export const EVENTS = {
  PAGE_DATA: 'page_data',
  USER_DATA: 'user_data',
  // Ecommerce
  VIEW_ITEM_LIST: 'view_item_list',
  SELECT_ITEM: 'select_item',
  VIEW_ITEM: 'view_item',
  ADD_TO_CART: 'add_to_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  CHECKOUT_PROGRESS: 'checkout_progress',
  ADD_SHIPPING_INFO: 'add_shipping_info',
  ADD_PAYMENT_INFO: 'add_payment_info',
  PURCHASE: 'purchase',
  // Coverage (MVP)
  COVERAGE_COMPLETE: 'coverage_complete',
  COVERAGE_FAILED: 'coverage_failed',
  // Lead Gen
  GENERATE_LEAD: 'generate_lead',
  HELP_REQUEST_OPEN: 'help_request_open',
  CLICK_TO_CALL: 'click_to_call',
  CHAT_OPEN: 'chat_open',
  // Promotions
  VIEW_PROMOTION: 'view_promotion',
  SELECT_PROMOTION: 'select_promotion',
  // Exit Intent
  CHECKOUT_EXIT_INTENT: 'checkout_exit_intent',
  CHECKOUT_ABANDON: 'checkout_abandon',
  CHECKOUT_ERROR: 'checkout_error',
  // Auth
  LOGIN_INTENT: 'login_intent',
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  // User Properties
  SET_USER_PROPERTIES: 'set_user_properties',
} as const;

export const CHECKOUT_STEPS = {
  PACKAGE_CONFIGURATION: { step: 1, name: 'package_configuration' },
  PERSONAL_DATA: { step: 2, name: 'personal_data' },
  CONTACT_VERIFICATION: { step: 3, name: 'contact_verification' },
  DOCUMENTS: { step: 4, name: 'documents' },
  PAYMENT: { step: 5, name: 'payment' },
} as const;

export const CURRENCY = 'MXN' as const;
```

#### 1.3 Helpers (`helpers.ts`)

Implementar las siguientes funciones:

- **`generateCheckoutSessionId()`**: Retorna `'CHK-' + Date.now() + '-' + random(9)`
- **`generateLeadId()`**: Retorna `'LEAD-' + Date.now() + '-' + random(6)`
- **`generateCoverageSessionId()`**: Retorna `'COV-' + Date.now() + '-' + random(6)`
- **`normalizePhone(phone: string): string | null`**: Convierte a formato E.164 (`+52XXXXXXXXXX`). Si recibe 10 dígitos, agrega `+52`. Si recibe 12 con `52` al inicio, agrega `+`.
- **`normalizeEmail(email: string): string | null`**: `trim().toLowerCase()`
- **`normalizeName(name: string): string | null`**: `trim().toLowerCase()`
- **`normalizePostalCode(code: string): string | null`**: Pad a 5 dígitos
- **`normalizeUserData(rawData): UserData`**: Aplica todas las normalizaciones anteriores
- **`buildPlanItem(plan, index, listId, listName): EcommerceItem`**: Construye un item GA4 completo a partir de datos del plan

#### 1.4 DataLayer Core (`dataLayer.ts`)

```typescript
// Inicializar dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

// Push seguro con try-catch
export function safePush(payload: Record<string, any>): void

// Push de evento ecommerce (limpia ecommerce previo antes de pushear)
export function pushEcommerceEvent(
  eventName: string,
  ecommerceData: Record<string, any>,
  additionalParams?: Record<string, any>
): void

// Limpiar ecommerce
export function clearEcommerce(): void
```

**Regla crítica:** Antes de cada push de evento ecommerce, SIEMPRE hacer `dataLayer.push({ ecommerce: null })` para limpiar datos previos.

#### 1.5 Eventos de Coverage (MVP CRÍTICO) (`events/coverage.ts`)

**`coverage_complete`** - Se dispara cuando la cobertura es verificada exitosamente. Este es el evento más importante del MVP porque:
- Inicia el tracking de carrito abandonado
- Captura los datos del lead (nombre, teléfono, dirección)
- Incluye datos para Enhanced Conversions

Parámetros del push:
```
event: 'coverage_complete'
session_id: generado con generateCoverageSessionId()
coverage_timestamp: new Date().toISOString()
coverage_available: true
coverage_type: 'fiber' | 'coaxial'
coverage_region: string
lead_data: { name, phone (E.164), email, address }
user_data: { phone_number, address { first_name, last_name, street, city, region, postal_code, country: 'MX' } }
```

**`coverage_failed`** - Se dispara cuando NO hay cobertura. Misma estructura pero con `coverage_available: false` y `coverage_type: 'unavailable'`.

#### 1.6 Eventos Ecommerce (`events/ecommerce.ts`)

Cada función debe llamar a `pushEcommerceEvent()` (que hace clear + push):

- **`trackViewItemList(items, listId, listName)`** — Disparar en: `/internet`, `/tv`, `/movil`, `/promociones` al cargar la página
- **`trackSelectItem(item, listId, listName)`** — Disparar en: click en card de plan
- **`trackViewItem(item)`** — Disparar en: modal de detalle o página de configuración de plan
- **`trackAddToCart(item)`** — Disparar en: click en "Contratar este plan"

#### 1.7 Eventos de Checkout (`events/checkout.ts`)

- **`trackBeginCheckout(items, value, sessionId)`** — Disparar al cargar Paso 1. Incluye `checkout_session_id`.
- **`trackCheckoutProgress(step, stepName, sessionId, ecommerceData, extraParams?)`** — Disparar al completar cada paso (1-4). El paso 1 incluye `coverage_verified`, `coverage_type`, `coverage_region` y `user_data`.
- **`trackAddShippingInfo(items, value, shippingTier, sessionId)`** — Disparar al confirmar dirección de instalación (Paso 2). `shipping_tier`: `'standard_installation'` | `'express_installation'`.
- **`trackAddPaymentInfo(items, value, paymentType, sessionId)`** — Disparar en Paso 5 al ingresar datos de pago. `payment_type`: `'credit_card'` | `'debit_card'` | `'bank_transfer'` | `'oxxo'`.

#### 1.8 Evento Purchase (`events/purchase.ts`)

- **`trackPurchase(transactionData)`** — Disparar en página de confirmación. Incluye `user_data` completo para Enhanced Conversions, `transaction_id` (formato `IZZ-YYYY-NNNNNN`), `tax` (IVA), `shipping` (fee de instalación), `coupon`, `payment_type`, `installation_date`, `contract_months`, y `checkout_session_id`.

---

### Fase 2: Funnel Completo (Pasos adicionales y errores)

#### 2.1 Eventos de Exit Intent (`events/exitIntent.ts`)

- **`trackCheckoutExitIntent(sessionId, step, stepName)`** — Disparar cuando aparece modal de "¿Seguro que quieres salir?"
- **`trackCheckoutAbandon(sessionId, step, stepName, reason)`** — Disparar si el usuario confirma que quiere salir. `abandon_reason`: `'user_confirmed_exit'` | `'timeout'` | `'error'`.
- **`trackCheckoutError(errorType, errorMessage, step)`** — Disparar en errores durante checkout.

---

### Fase 3: Lead Gen + Promotions

#### 3.1 Eventos de Lead Generation (`events/leadGen.ts`)

- **`trackGenerateLead(source, serviceInterest, userData, value?)`** — Disparar en cualquier captura de lead. Genera `lead_id` automáticamente. Incluye `user_data` para Enhanced Conversions for Leads. Valor por defecto: $150 MXN.
- **`trackHelpRequestOpen()`** — Click en "Te ayudamos?"
- **`trackClickToCall(phoneNumber)`** — Click en teléfono
- **`trackChatOpen(chatSource)`** — Apertura de chat

#### 3.2 Eventos de Promotions (`events/promotions.ts`)

- **`trackViewPromotion(items)`** — Cuando promociones son visibles en viewport. Items incluyen `promotion_id`, `promotion_name`, `creative_name`, `creative_slot`, `location_id`.
- **`trackSelectPromotion(item)`** — Click en banner/card de promoción.

#### 3.3 Eventos de Autenticación (`events/auth.ts`)

- **`trackLoginIntent()`**
- **`trackLogin(method: 'web' | 'app')`**
- **`trackSignUp(method: string)`**

---

### Fase 4: Hooks y Provider

#### 4.1 `usePageTracking` Hook

Hook que dispara `page_data` automáticamente en cambios de ruta de Next.js. Usa `usePathname()` y `useEffect()`.

```typescript
// Determina page.type basado en pathname:
// '/' → 'home'
// '/internet', '/tv', '/movil' → 'category'
// '/promociones' → 'category'
// '/checkout/*' → 'checkout'
// '/confirmacion' → 'confirmation'
```

#### 4.2 `useCheckoutTracking` Hook

Hook que mantiene el `checkout_session_id` persistente durante todo el flujo de checkout (usando state o sessionStorage). Expone funciones para cada paso.

#### 4.3 `TrackingProvider`

Componente provider que:
1. Inicializa `window.dataLayer = window.dataLayer || []`
2. Dispara `page_data` en cada cambio de ruta
3. Dispara `user_data` cuando el usuario está identificado

---

## Naming Conventions (OBLIGATORIO)

| Elemento | Convención | Ejemplo ✅ | Ejemplo ❌ |
|----------|-----------|-----------|-----------|
| Eventos | snake_case | `add_to_cart` | `AddToCart` |
| Parámetros | snake_case | `item_name` | `itemName` |
| Valores | lowercase + underscore | `doble_play` | `Doble Play` |
| IDs | UPPER-PREFIX-number | `PLAN-INT-500` | `plan500` |

## Migración de Eventos Actuales

Los siguientes eventos legacy deben consolidarse en `generate_lead` con parámetro `lead_source`:

| Evento Actual | → Evento Nuevo |
|---|---|
| `generate_lead_whatsapp` | `generate_lead` + `lead_source=whatsapp` |
| `generate_lead_llamar` | `generate_lead` + `lead_source=call` |
| `generate_lead_callme` | `generate_lead` + `lead_source=callback` |
| `generate_lead_chat` | `generate_lead` + `lead_source=chat` |
| `lead_internet_tv` | `generate_lead` + `service_interest=internet_tv` |
| `lead_internet` | `generate_lead` + `service_interest=internet` |
| `lead_promociones` | `generate_lead` + `service_interest=promociones` |
| `lead_combos` | `generate_lead` + `service_interest=combos` |
| `lead_izzi_movil` | `generate_lead` + `service_interest=movil` |
| `login_event_intent` | `login_intent` |
| `registered_users_login_web` | `login` + `login_method=web` |

## Reglas Críticas de Implementación

1. **SIEMPRE limpiar ecommerce antes de pushear:** `dataLayer.push({ ecommerce: null })` antes de cada evento ecommerce.
2. **SIEMPRE usar `safePush` con try-catch** para no romper el flujo del usuario si el tracking falla.
3. **El dataLayer debe inicializarse ANTES del snippet de GTM** en el `<head>`.
4. **Teléfonos en formato E.164:** `+52` + 10 dígitos sin espacios ni caracteres extra.
5. **`price` siempre como `number`**, nunca como string.
6. **`currency: 'MXN'`** debe estar presente siempre que haya `value`.
7. **`checkout_session_id`** debe persistir durante todo el flujo de checkout del usuario.
8. **Enhanced Conversions:** Los eventos `checkout_progress` (step=1), `purchase` y `generate_lead` DEBEN incluir `user_data` con los campos normalizados.
9. **No disparar eventos duplicados:** Usar guards para evitar re-disparos en re-renders de React.

## Taxonomía de Productos (Items)

```
item_category (L1): Internet | TV | Telefonía | Bundle
item_category2 (L2): Residencial | Empresarial
item_category3 (L3): Fibra | Coaxial | Doble_Play | Triple_Play
item_category4 (L4): Velocidad (100_mbps | 200_mbps | 300_mbps | 500_mbps | 1000_mbps)
item_category5 (L5): Contrato (12_meses | 18_meses)
```

## Integración con Páginas del Sitio

| Página | Eventos a Disparar |
|---|---|
| `/` (Home) | `page_data`, `view_promotion` (si hay hero banners) |
| `/internet`, `/tv`, `/movil` | `page_data`, `view_item_list`, `select_item` (en click), `view_promotion` (si hay promos) |
| Modal/Detalle de Plan | `view_item`, `add_to_cart` (en click "Contratar") |
| `/checkout` - Paso 1 | `page_data`, `begin_checkout`, `coverage_complete`/`coverage_failed`, `checkout_progress` step=1 |
| `/checkout` - Paso 2 | `checkout_progress` step=2, `add_shipping_info` |
| `/checkout` - Paso 3 | `checkout_progress` step=3 |
| `/checkout` - Paso 4 | `checkout_progress` step=4 |
| `/checkout` - Paso 5 | `add_payment_info` |
| `/confirmacion` | `page_data`, `purchase` |
| Cualquier página | `generate_lead` (Te ayudamos?), `click_to_call`, `chat_open` |
| Checkout (modal salida) | `checkout_exit_intent`, `checkout_abandon` |

---

## Notas Adicionales

- El proyecto ya tiene GTM instalado y GA4 configurado.
- El `phone_hash` ya funciona como User-ID.
- Enhanced Conversions ya está habilitado en Google Ads.
- Los SKUs/item_ids propuestos siguen el formato `PLAN-{TIPO}-{VELOCIDAD}` (ej: `PLAN-INT-500`, `PLAN-DP-500-PLUS`, `PLAN-TP-500-PLUS`).
- La detección de carrito abandonado se ejecuta server-side (BigQuery + N8N → Siebel CRM/Genesys), no en el frontend. El frontend solo necesita enviar los eventos correctamente.
