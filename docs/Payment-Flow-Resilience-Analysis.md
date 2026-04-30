# Análisis y fix: Resiliencia del flujo de pago en checkout (step6)

> **Branch:** `fix/payment-timeout-resilience`
> **Fecha:** 2026-04-30
> **Scope:** `validatePayment.ts`, `GetSubmitCapacity.ts`, `resumenContainer.tsx` (step6)
> **No toca:** lógica de doble llamada paypal+tarjeta, lógica de diferenciación de método ganador, código de pagos del equipo dueño (`PagoTarjeta`, `PagoPayPal`, `GetLigaPago`).

---

## 1. Síntoma reportado

Al dar **Continuar** en el último paso del checkout (paso de pago), el modal `cargaGenerica` se queda abierto **eternamente** y nunca redirige a `/thank-you` ni a `/error`. Casos observados:

- Pago con tarjeta: API `verificaPago` regresa `{"izziErrorCode":"001", "izziError":"El pago no se ha reflejado, intenta nuevamente en 5 segundos"}` → modal pegado.
- Pago con PayPal: ayer funcionó, hoy intermitentemente igual.

## 2. Análisis técnico

### 2.1 Flujo actual del step6

```
1. Usuario click "Continuar" → setIsSpecificModalOpen(true) — modal abre
2. await validatePayment(...)
     └─ Promise.all([
          validateAPI(paypal=false),  ← fetch verificaPago
          validateAPI(paypal=true)    ← fetch verificaPago
        ])
3. await runSubmitCapacity(...)
     └─ fetch submitCapacity
4. router.push("/thank-you") | router.push("/error")
5. Componente se desmonta → modal desaparece
```

### 2.2 Causas raíz identificadas

| # | Causa | Archivo | Impacto |
|---|---|---|---|
| 1 | `fetch` sin timeout en `verificaPago` | `validatePayment.ts:39` | Si la API se cuelga, `await` nunca resuelve → modal eterno |
| 2 | `Promise.all` espera a las DOS llamadas aunque una ya respondió `000` | `validatePayment.ts:56` | Si una llamada se cuelga, `Promise.all` nunca resuelve aunque la otra ya tuvo éxito |
| 3 | `001` ("intenta de nuevo en 5s") se trata como error fatal | `validatePayment.ts:47, 51` | El `try/catch` regresa `false` sin reintentar, aunque el copy de la API explícitamente sugiere reintentar |
| 4 | `try/catch {}` opaco se traga el error | `validatePayment.ts:51` | Imposible diagnosticar en producción si fue red, JSON malo, 001 o cualquier otro código |
| 5 | `fetch` sin timeout en `submitCapacity` | `GetSubmitCapacity.ts:44` | Mismo riesgo que (1) en la segunda mitad del flujo |
| 6 | step6 sin red de seguridad global | `resumenContainer.tsx:322` | Si todo lo demás falla, el modal se queda sin escape posible |

### 2.3 ¿Por qué tarjeta sí y paypal no (o viceversa)?

El mensaje de la API (`"intenta nuevamente en 5 segundos"`) es la pista. **El pago se ejecuta**, pero el backend tarda en reflejarlo. Es una condición de carrera:

- En el caso "ayer funcionó con PayPal" → el round-trip de la red dio tiempo a que el backend reflejara el pago antes de `verificaPago`.
- En el caso "hoy falló con tarjeta" → `verificaPago` corrió antes de que el backend reflejara el cobro → `001` → sin retry → `/error`.

No es un bug de pagos, es un bug de **tiempos de espera del frontend**.

## 3. Solución implementada

### 3.1 Fix prioridad alta — `validatePayment.ts`

**Cambios:**

1. **`AbortController` con timeout de 20s por llamada.** Cada `fetch` se aborta si tarda más de 20 segundos. Antes podía colgarse indefinidamente.
2. **`Promise.all` → `Promise.allSettled`.** Si una llamada falla o hace timeout, la otra sigue contando. Si cualquiera regresa `000`, ese gana.
3. **Retry condicional al recibir `001`.** Hasta 2 reintentos con espera de 5s entre intentos (justo lo que sugiere el copy de la API). Otros códigos no se reintentan.
4. **Logging de `izziErrorCode`.** Antes el `catch {}` se tragaba todo silenciosamente. Ahora se loguea cada respuesta no exitosa para diagnóstico.
5. **Tipo de retorno explícito** `{ ok: boolean; isPayPal: boolean }` para que la diferenciación de método sea más clara.

**Constantes nuevas:**

```ts
const VERIFICA_PAGO_TIMEOUT_MS = 20000;          // por llamada
const VERIFICA_PAGO_MAX_RETRIES_ON_001 = 2;      // máx reintentos solo en 001
const VERIFICA_PAGO_RETRY_DELAY_MS = 5000;       // espera entre reintentos
```

**Tiempo máximo en peor caso por llamada:** 20s + (5s + 20s) × 2 = 70s antes de timeout total. La que tenga éxito gana antes.

### 3.2 Fix prioridad media — `GetSubmitCapacity.ts`

**Cambios:**

1. **`AbortController` con timeout de 30s.** El timeout es más generoso porque submitCapacity crea la cuenta del cliente y puede tardar más.
2. **Logging diferenciado** (timeout vs. otro error) para diagnóstico.

```ts
const SUBMIT_CAPACITY_TIMEOUT_MS = 30000;
```

### 3.3 Red de seguridad — `resumenContainer.tsx` (step6)

**Cambios:**

1. **Timeout global de 90s.** Si por cualquier razón el flujo no termina (validatePayment + tracking + submitCapacity + redirect), después de 90s se cierra el modal y se redirige a `/error`. Es la última línea de defensa.
2. **Flag `safetyTriggered`** para que las funciones internas que estaban en vuelo no intenten redirigir en paralelo después del timeout.
3. **Limpieza de `clearTimeout` en `finally`** para que si el flujo termina antes, no quede el timeout colgado.

```ts
const STEP6_SAFETY_TIMEOUT_MS = 90000;
```

## 4. Lo que NO cambia

| Decisión | Razón |
|---|---|
| Doble llamada paralela paypal+tarjeta | Es decisión de producto; el endpoint no acepta un solo request "agnóstico" de método |
| Lógica de diferenciación (paypal gana sobre card) | Ya funciona correctamente |
| Modal único cubriendo validate+submit+redirect | Mejor UX, sin parpadeos |
| Lógica del paso anterior (`PagoTarjeta`, `GetLigaPago`) | Owner es otro equipo (issue separado abierto con Ángel) |

## 5. Casos esperados después del fix

| Caso | Resultado | Tiempo aprox. |
|---|---|---|
| Pago tarjeta reflejado al primer intento | `/thank-you` | < 5s |
| Pago paypal reflejado al primer intento | `/thank-you` | < 5s |
| Pago tarjeta reflejado al 2do intento (001 → 000) | `/thank-you` | ~10s |
| Pago no reflejado tras 2 reintentos de 001 | `/error` con log | ~30s |
| API verificaPago colgada, otra responde 000 | `/thank-you` | hasta 20s |
| API verificaPago colgada, otra también | `/error` | hasta 20s |
| submitCapacity colgada | `/error` | hasta 30s |
| Cualquier escenario imprevisto | `/error` (red de seguridad) | 90s |

## 6. Pendientes y siguientes pasos

### 6.1 Bug separado de `PagoTarjeta` / `GetLigaPago`

**No es parte de este branch.** Reportado al equipo de pagos (Ángel David) — el `useEffect` de `PagoTarjeta.tsx:28` dispara `GetLigaPago` antes de tener listos `precioTotal` y `processStatus.orderNumber`, por eso al final llegan referencias inválidas a `verificaPago`. Owner natural: Juan Rodriguez (commit `c7a61b714` de enero 2026).

### 6.2 Mejoras futuras sugeridas

- Mostrar un mensaje específico al usuario cuando hay 001 ("Estamos confirmando tu pago, un momento más…") en vez del modal genérico.
- Telemetría de los códigos `izziErrorCode` para observabilidad.
- Considerar mover el reintento de 001 al backend (`/api/contratacion/verificaPago` route handler) para mantener el cliente más simple.
- Eliminar la doble llamada cuando exista un endpoint que acepte cualquier método (coordinar con backend).

## 7. Validación manual (pendiente)

- [ ] Pago tarjeta caso happy path → `/thank-you` con modal visible todo el camino
- [ ] Pago paypal caso happy path → `/thank-you`
- [ ] Pago técnico caso happy path → `/thank-you`
- [ ] Forzar 001 en backend (mock) → ver retry y eventual `/thank-you`
- [ ] Forzar timeout en backend → ver `/error` a los 20s
- [ ] Validar que el modal NO se cierra antes de tiempo en navegación lenta

## 8. Archivos modificados

```
src/utils/validatePayment.ts                                  (+78 / -33)
src/utils/GetSubmitCapacity.ts                                (+10 / -2)
src/components/molecules/checkout/resumenContainer.tsx        (+22 / -1)
```

Más el commit cherry-pickeado `418c2637` (refactor de step6 para modal único, base necesaria para la red de seguridad).
