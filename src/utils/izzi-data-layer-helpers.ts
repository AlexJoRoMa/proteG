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

const izziDataLayerHelpers = {
    generateCheckoutSessionId: () => {
        return 'CHK-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    },
    generateLeadId: () => {
        return 'LEAD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    },
    pushEcommerceEvent: (eventName: string, ecommerceData: Record<string, unknown>, additionalParams?: Record<string, unknown>) => {
        const dataLayer = window.dataLayer || [];
        dataLayer.push({ ecommerce: null });
        const payload = {
            event: eventName,
            ecommerce: ecommerceData
        };
        if (additionalParams) {
            Object.assign(payload, additionalParams);
        }
        dataLayer.push(payload);
    },
    normalizePhone,
    normalizeUserData: (rawData: RawUserData) => {
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
    },
    buildPlanItem: (plan: PlanItemInput, index: number, listId: string, listName: string) => {
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
    },
}

window.izziDataLayerHelpers = izziDataLayerHelpers;

export default izziDataLayerHelpers;