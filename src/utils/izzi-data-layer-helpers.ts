import type { IzziSelection, OttProps } from '@/types/ConfiguradorTypes';

interface RawUserData {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string | number;
}

export interface PlanItemInput {
    sku?: string;
    id?: string;
    name?: string;
    category?: string;
    technology?: string;
    speedTier?: string;
    contractTerm?: string | number | null;
    price?: string | number;
    speed?: string | number | null;
    channels?: string | number | null;
    contractMonths?: string | number | null;
}

declare global {
    interface Window {
        izziDataLayerHelpers?: unknown;
    }
}

const normalizePhone = (phone: string) => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
        return '+52' + digits;
    }
    if (digits.length === 12 && digits.startsWith('52')) {
        return '+' + digits;
    }
    return null;
};

const normalizeUserData = (rawData: RawUserData) => {
    return {
        email: rawData.email ? rawData.email.trim().toLowerCase() : null,
        phone_number: normalizePhone(rawData.phone ?? ''),
        address: {
            first_name: rawData.firstName ? rawData.firstName.trim().toLowerCase() : null,
            last_name: rawData.lastName ? rawData.lastName.trim().toLowerCase() : null,
            street: rawData.street || null,
            city: rawData.city || null,
            region: rawData.state || null,
            postal_code: rawData.postalCode ? rawData.postalCode.toString().padStart(5, '0') : null,
            country: 'MX'
        }
    };
};

/** Evita totales negativos en GA4 cuando el resumen aplica descuentos netos raros. */
const normalizeEcommerceValue = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0);

export type BuildEcommerceLineItemsOptions = {
    /** Total del carrito; se reparte entre línea principal y extras para que sume con `value`. */
    precioTotal: number;
    mainListId?: string;
    mainListName?: string;
    extrasListId?: string;
    extrasListName?: string;
};

const buildPlanItem = (plan: PlanItemInput, index: number, listId: string, listName: string) => {
    const price = plan.price != null ? parseFloat(String(plan.price)) : 0;
    return {
        item_id: plan.sku || plan.id,
        item_name: plan.name,
        item_brand: 'izzi',
        item_category: plan.category,
        item_category2: 'Residencial',
        item_category3: plan.technology || 'Fibra',
        item_category4: plan.speedTier || null,
        item_category5: plan.contractTerm ?? null,
        item_list_id: listId || null,
        item_list_name: listName || null,
        index,
        price,
        quantity: 1,
        speed_mbps: plan.speed ?? null,
        channel_count: plan.channels != null ? String(plan.channels) : '0',
        contract_months: plan.contractMonths ?? null
    };
};

const buildOttLineItem = (
    ott: OttProps,
    index: number,
    listId: string,
    listName: string
) =>
    buildPlanItem(
        {
            id: String(ott.idExtra),
            sku: ott.nombreSiebel,
            name: ott.titulo,
            category: 'Add-on',
            technology: ott.categoriaExtra ?? 'OTT',
            price: ott.costo,
            speed: null,
            channels: null,
            contractMonths: null,
        },
        index,
        listId,
        listName
    );

const buildMovilAddonLineItem = (
    extras: NonNullable<IzziSelection['extras']>,
    index: number,
    listId: string,
    listName: string
) =>
    buildPlanItem(
        {
            id: String(extras.idPaquete ?? extras.idExtra),
            name: extras.titulo ?? '',
            category: 'Add-on',
            technology: 'Movil',
            price: extras.precioPaquete,
            speed: extras.velocidadMinima,
            channels: extras.canales,
            contractMonths: null,
        },
        index,
        listId,
        listName
    );

/**
 * Líneas de ecommerce (GA4): paquete principal + OTTs + línea móvil add-on si aplica.
 * El precio del bundle es `precioTotal` menos extras para que la suma de líneas coincida con `value`.
 */
const buildEcommerceLineItems = (
    selection: IzziSelection | null,
    options: BuildEcommerceLineItemsOptions
) => {
    if (!selection?.idPaquete) {
        return [] as ReturnType<typeof buildPlanItem>[];
    }

    const mainListId = options.mainListId ?? 'checkout';
    const mainListName = options.mainListName ?? 'Checkout - plan principal';
    const extrasListId = options.extrasListId ?? mainListId;
    const extrasListName = options.extrasListName ?? 'Checkout - extras';

    const otts = selection.extrasMap?.ott ?? [];
    const sumOtt = otts.reduce((acc, o) => acc + (Number(o.costo) || 0), 0);
    const movilExtra = selection.extras;
    const movilPrice = movilExtra ? Number(movilExtra.precioPaquete) || 0 : 0;

    const safeTotal = normalizeEcommerceValue(options.precioTotal);
    const mainPrice = Math.max(0, safeTotal - sumOtt - movilPrice);

    const bundleTechnology = (() => {
        const tp = selection.tiempoPlan;
        if (tp) {
            return tp.includes('TRIPLE') ? 'Triple_Play' : 'Doble_Play';
        }
        return selection.spTV || selection.spMovil ? 'Triple_Play' : 'Doble_Play';
    })();

    const items: ReturnType<typeof buildPlanItem>[] = [
        buildPlanItem(
            {
                id: String(selection.idPaquete),
                sku: selection.nombreCode,
                name: selection.tituloTriplePlay ?? selection.titulo ?? '',
                category: 'Bundle',
                technology: bundleTechnology,
                price: mainPrice,
                speed: selection.velocidadMinima,
                channels: selection.canales,
                contractMonths: selection.tiempoPlan,
            },
            0,
            mainListId,
            mainListName
        ),
    ];

    otts.forEach((ott) => {
        items.push(buildOttLineItem(ott, items.length, extrasListId, extrasListName));
    });

    if (movilExtra) {
        items.push(buildMovilAddonLineItem(movilExtra, items.length, extrasListId, extrasListName));
    }

    return items;
};

const izziDataLayerHelpers = {
    generateCheckoutSessionId: () => {
        return 'CHK-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    },
    generateLeadId: () => {
        return 'LEAD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    },
    /** ID único para tracking de abandono (doc: session_id formato COV-...) */
    generateCoverageSessionId: () => {
        return 'COV-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
    },
    pushEcommerceEvent: (eventName: string, ecommerceData: Record<string, unknown>, additionalParams?: Record<string, unknown>) => {
        if (typeof window === 'undefined') return;

        const w = window as typeof window & { dataLayer?: unknown[] };

        if (!Array.isArray(w.dataLayer)) {
            w.dataLayer = [];
        }

        w.dataLayer.push({ ecommerce: null });

        const payload: Record<string, unknown> = {
            event: eventName,
            ecommerce: ecommerceData
        };

        if (additionalParams) {
            Object.assign(payload, additionalParams);
        }

        w.dataLayer.push(payload);
    },
    normalizePhone,
    normalizeUserData,
    normalizeEcommerceValue,
    buildPlanItem,
    buildEcommerceLineItems,
    Item: buildPlanItem,
};

if (typeof window !== 'undefined') {
    window.izziDataLayerHelpers = izziDataLayerHelpers;
}

export default izziDataLayerHelpers;