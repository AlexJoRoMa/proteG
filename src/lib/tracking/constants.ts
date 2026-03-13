export const EVENTS = {
    PAGE_DATA: 'page_data',
    ADD_TO_CART: 'add_to_cart',
    BEGIN_CHECKOUT: 'begin_checkout',
    CHECKOUT_PROGRESS: 'checkout_progress',
    ADD_SHIPPING_INFO: 'add_shipping_info',
    ADD_PAYMENT_INFO: 'add_payment_info',
    PURCHASE: 'purchase',
    COVERAGE_COMPLETE: 'coverage_complete',
    COVERAGE_FAILED: 'coverage_failed',
    CHECKOUT_EXIT_INTENT: 'checkout_exit_intent',
    CHECKOUT_ABANDON: 'checkout_abandon',
    SELECT_ITEM: 'select_item',
    VIEW_ITEM_LIST: 'view_item_list',
    VIEW_ITEM: 'view_item', // para cuando implementes view_item
} as const;

export const CURRENCY = 'MXN' as const;

